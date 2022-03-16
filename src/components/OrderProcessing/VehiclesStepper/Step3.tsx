import React, { useEffect, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import {
  setOrderDetail,
  getAutocompleteDataAction,
  resetAutoCompleteAddressAction,
  getPaymentOptionAction,
  getAvaiableDates,
} from "../../../actions/Actions/OrderActions";
import IntlMessages from "../../../util/IntlMessages";
import { Card, CardBody, CardSubtitle } from "reactstrap";
import moment from "moment";
import axios from "../../../util/Api";
import ClientDetails from "../../ClientDetails";
import AlertPopUp from "../../../common/AlertPopUp";
import DataAssignment from "./DataAssignment";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import {
  IRootStep3State,
  IStep3Props,
  IRootStep3State1,
} from "./Interface/Step3Interface";
import { useIntl } from "react-intl";
import { IService } from "./Interface/Step4Interface";

const VehiclesStep3 = (props: IStep3Props) => {
  const initialDateAndTime = {
    date: null,
    time: false,
  };
  const dispatch = useDispatch();

  const { formatMessage: f } = useIntl();

  /**
   *  orderCreate reducer state
   */
  const orderCreateState = useSelector(
    (state: IRootStep3State) => state.orderState.orderCreate
  );

  /**
   *  autoComplete Address reducer state
   */
  const autoCompleteAddressState = useSelector(
    (state: IRootStep3State1) =>
      state.orderState.orderCreate.autoCompleteAddress
  );

  /**
   *  title state handler
   */
  const [title, setTitle] = useState("Mr. Mrs.");

  /**
   *  name state handler
   */
  const [name, setName] = useState("");

  /**
   *  email state handler
   */
  const [email, setEmail] = useState<any>("");

  /**
   *  emailAddress state handler
   */
  const [emailIDList, setEmailIDList] = useState<any>([]);

  /**
   *  Date row state handler
   */
  const [preferredDates, setPreferredDates] = useState<any>([
    initialDateAndTime,
  ]);

  /**
   *  phone state handler
   */
  const [phone, setPhone] = useState<any>("");

  /**
   *  postal code state handler
   */
  const [postalCode, setPostalCode] = useState("");

  /**
   *  house number state handler
   */
  const [houseNo, setHouseNo] = useState("");

  /**
   *  address state handler
   */
  const [address, setAddress] = useState("");

  /**
   *  place state handler
   */
  const [place, setPlace] = useState("");

  const [optionList, setOptionList] = useState([]);
  const [paymentList, setpaymentList] = useState<any>([]);
  /**
   *  selected pickup option state handler
   */
  const [selectedOption, setSelectedOption] = useState("Select Pickup Option");

  /**
   *  selected payment option state handler
   */
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(0);

  /**
   *  comments state handler
   */
  const [comments, setComments] = useState("");

  /**
   *  alert pop up state handler
   */
  const [alert, setAlert] = useState(false);

  /**
   *  alert pop up message state handler
   */
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    if (houseNo && postalCode) {
      const timer = setTimeout(() => {
        dispatch(getAutocompleteDataAction(houseNo, postalCode));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, houseNo, postalCode]);

  useEffect(() => {
    dispatch(
      getPaymentOptionAction(
        preparePaymentPayload(),
        false,
        (status, response) => {
          if (status) {
            setOptionList(response);
          }
        }
      )
    );

    return () => {
      dispatch(resetAutoCompleteAddressAction());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(
      getPaymentOptionAction(
        preparePaymentPayload(),
        true,
        (status, response) => {
          if (status && response && response.length) {
            setpaymentList(response);
          }
        }
      )
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedPaymentOption && paymentList.length) {
      setSelectedPaymentOption(paymentList[0].id);
    }
  }, [selectedPaymentOption, paymentList])

  useEffect(() => {
    if (title && name && place) {
      props.onHeadingChange(
        `${f({
          id: "clientTitle",
          defaultMessage: "Client",
        })} : ${title} ${name} - ${f({
          id: "cityTitle",
          defaultMessage: "City",
        })}: ${place}`,
        2
      );
    }
  }, [title, name, place]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (Boolean(autoCompleteAddressState)) {
      if (autoCompleteAddressState.Address) {
        const { Address } = autoCompleteAddressState;
        setAddress(Address.street);
        setPlace(Address.city);
      }
    } else {
      setAddress("");
      setPlace("");
    }
  }, [autoCompleteAddressState]);

  const preparePaymentPayload = () => {
    const selectedServices: object[] = [];
    orderCreateState.services &&
      orderCreateState.services.forEach((service: IService) => {
        if (service.checked) {
          selectedServices.push({ id: service.id, price: service.service_price?.price });
        }
      });
    const data = {
      vehicle_id: orderCreateState.order.vehicle.vehicleData.vehicle_id,
      selected_services: selectedServices,
      delivery_option_id: selectedOption,
    };
    if (orderCreateState.order.vehicle.vehicleData.plate_id)
      data["license-plate"] =
        orderCreateState.order.vehicle.vehicleData.plate_id;
    else {
      data["construction_year"] =
        orderCreateState.order.vehicle.construction_year;
      data["fuel_type_id"] = orderCreateState.order.vehicle.fuel.id;
      data["delivery_option_id"] = orderCreateState.order.vehicle.fuel.id;
    }
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  };

  /**
   *  submit order handler
   */
  const onSubmitClicked = () => {
    if (verifyData()) {
      // if (verifyDate()) {
      const clientDetails = {
        title,
        name,
        email,
        phone,
        postalCode,
        address,
        houseNo,
        place,
      };
      let dataAssignment = {
        selectedDates: selectedDates,
        times: times,
        payment_method: selectedPaymentOption,
        // date: selectedDate,
        // displayDate: moment(selectedDate).format('DD-MM-YYYY'),
        // time: selectedTime,
        // preferred_date: preferredDates,
        selectedOption: selectedOption,
        deliveryOption: selectedOption,
        delivery_option_id: selectedOption,
        // comments
      };
      if (!props.orderId) {
        dataAssignment["preferred_date"] = preferredDates;
        dataAssignment["comments"] = comments;
      }

      dispatch(setOrderDetail({ clientDetails, dataAssignment }));
      props.handleNext();
      // } else {
      //     setAlert(true);
      //     setAlertMsg('Please Select Valid Date');
      // }
    } else {
      setAlertMsg("Please fill all the required details.");
      setAlert(true);
    }
  };

  // const verifyDate = () => {
  //   const selected = new Date(
  //     new Date(selectedDate).getFullYear(),
  //     new Date(selectedDate).getMonth(),
  //     new Date(selectedDate).getDate()
  //   );
  //   const today = new Date(
  //     new Date().getFullYear(),
  //     new Date().getMonth(),
  //     new Date().getDate()
  //   );
  //   return selected >= today;
  // };

  // const validatePreferredDate = () => {
  //   if (!props.orderId) {
  //     const notValid = preferredDates.some(
  //       ({ date, time }) => date === null || time === null || time === ""
  //     );
  //     return !notValid;
  //   } else {
  //     return true;
  //   }
  // };

  useEffect(() => {
    if (
      !verifyData() &&
      orderCreateState.supportCodeData &&
      !orderCreateState.orderDetails
    ) {
      const { supportCodeData } = orderCreateState;
      if (supportCodeData.salutation) {
        setTitle(supportCodeData.salutation.toLowerCase().startsWith("mrs") || supportCodeData.salutation.toLowerCase().startsWith("ms") ? "mrs." : supportCodeData.salutation.toLowerCase().startsWith("mr. mr") ? "mr. mrs." : "mr.");
      }
      setName(supportCodeData.name && supportCodeData.name);
      setEmail(supportCodeData.email && supportCodeData.email);
      setPhone(supportCodeData.phone && supportCodeData.phone);
      setPostalCode(supportCodeData.postalCode && supportCodeData.postalCode);
      setAddress(supportCodeData.address && supportCodeData.address);
      setHouseNo(supportCodeData.houseNumber && supportCodeData.houseNumber);
      setPlace(supportCodeData.place && supportCodeData.place);
      // setSelectedDate(supportCodeData.startDate && supportCodeData.startDate);
      // setSelectedTime(supportCodeData.time && supportCodeData.time);
      setSelectedOption(
        supportCodeData.pickupOption && supportCodeData.pickupOption
      );
      setComments(
        supportCodeData.additionComments && supportCodeData.additionComments
      );
      if (
        supportCodeData.preferred_date &&
        supportCodeData.preferred_date.length
      ) {
        let selectedServicesData =
          (orderCreateState &&
            orderCreateState.selectedServices &&
            orderCreateState.selectedServices.map((item) => ({
              id: item.id,
              price:
                (item.service_price && item.service_price.price) ||
                item.price ||
                0,
            }))) ||
          [];

        let dates = {};
        const datesData = supportCodeData.preferred_date.map(
          (dateData: any, i: number) => {
            return new Promise<any>((resolve, reject) => {
              let now = "";
              let endOfMonth = "";
              let current = moment(dateData.date, "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              );
              let key = i;

              setIsFetchingDates(true);
              endOfMonth = moment(current)
                .endOf("month")
                .format("YYYY-MM-DD");
              now = moment(current)
                .startOf("month")
                .format("YYYY-MM-DD");

              let payload = {
                from: now,
                to: endOfMonth,
                selected_services: selectedServicesData,
              };

              let data = btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              );
              dispatch(
                getAvaiableDates(data, (status: string, response: any) => {
                  if (status === "success") {
                    dates = { ...dates, [key]: response.data };
                    resolve(dates);
                    setSelectedDates((selectedDates: any) => ({
                      ...selectedDates,
                      [key]: response.data,
                    }));
                  }
                  setIsFetchingDates(false);
                })
              );
            });
          }
        );

        Promise.all(datesData).then((res) => {
          const selectedDates: any = res[res.length - 1];
          let dateAndTimeRowClone: any = [];
          supportCodeData.preferred_date.map((dateData: any, index: number) => {
            let current = moment(dateData.date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            );
            let newTimes =
              (selectedDates &&
                selectedDates[index] &&
                selectedDates[index][current]) ||
              {};
            setTimes((times: any) => ({
              ...times,
              [index]: newTimes,
            }));
            dateAndTimeRowClone.push({
              date: moment(dateData.date, "DD-MM-YYYY").toISOString(),
              time: dateData.is_entire_day ? "is_entire_day" : dateData.time,
            });
          });
          setPreferredDates(dateAndTimeRowClone);
        });
        setPreferredDates(supportCodeData.preferred_date);
      }
    }
    if (
      !verifyData() &&
      !orderCreateState.orderDetails &&
      orderCreateState.orderPrefillData &&
      !orderCreateState.supportCodeData
    ) {
      const { orderPrefillData } = orderCreateState;
      if (orderPrefillData.salutation) {
        setTitle(orderPrefillData.salutation.toLowerCase().startsWith("mrs") || orderPrefillData.salutation.toLowerCase().startsWith("ms") ? "mrs." : orderPrefillData.salutation.toLowerCase().startsWith("mr. mr") ? "mr. mrs." : "mr.");
      }
      setName(orderPrefillData.name && orderPrefillData.name);
      setEmail(orderPrefillData.email && orderPrefillData.email);
      setPhone(orderPrefillData.phone && orderPrefillData.phone);
      if (orderPrefillData.additional_data?.payment_method) {
        setSelectedPaymentOption(orderPrefillData.additional_data?.payment_method.id)
      }
      setPostalCode(
        orderPrefillData.address.zip_code && orderPrefillData.address.zip_code
      );
      setAddress(
        orderPrefillData.address.street && orderPrefillData.address.street
      );
      setHouseNo(
        orderPrefillData.address.street_number &&
        orderPrefillData.address.street_number
      );
      setPlace(orderPrefillData.address.city && orderPrefillData.address.city);
    }
    if (!verifyData() && orderCreateState.orderDetails) {
      const { orderDetails } = orderCreateState;
      setTitle(orderDetails.clientDetails.title);
      if (orderDetails.additional_data?.payment_method) {
        setSelectedPaymentOption(orderDetails.additional_data?.payment_method.id)
      }
      setName(orderDetails.clientDetails.name);
      setEmail(orderDetails.clientDetails.email);
      setPhone(orderDetails.clientDetails.phone);
      setPostalCode(orderDetails.clientDetails.postalCode);
      setAddress(orderDetails.clientDetails.address);
      setHouseNo(orderDetails.clientDetails.houseNo);
      setPlace(orderDetails.clientDetails.place);
      // setSelectedDate(orderDetails.dataAssignment.date);
      // setSelectedTime(orderDetails.dataAssignment.time);
      setSelectedOption(orderDetails.dataAssignment.deliveryOption);
      setComments(orderDetails.dataAssignment.comments);
      setSelectedDates(orderDetails.dataAssignment.selectedDates);
      setTimes(orderDetails.dataAssignment.times);
      setPreferredDates(orderDetails.dataAssignment.preferred_date);
    } else if (!verifyData() && orderCreateState.orderPrefillData) {
      setSelectedOption(
        orderCreateState.orderPrefillData.additional_data.delivery_option_id.id
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   *  verify that all data are available
   */
  const verifyData = () => {
    return (
      Boolean(name) && Boolean(email) && Boolean(phone)
      // Boolean(postalCode) &&
      // Boolean(houseNo) &&
      // Boolean(address) &&
      // Boolean(place) &&
      // validatePreferredDate() &&
      // Boolean(selectedDate) &&
      // Boolean(selectedTime) &&
      // Boolean(selectedOption) &&
      // Boolean(typeof selectedOption === 'number')
    );
  };

  const addDateRow = () => {
    if (preferredDates.length < 3)
      setPreferredDates([...preferredDates, initialDateAndTime]);
  };

  const deletePreferredDate = (index) => {
    const preferredDatesClone = preferredDates.slice();
    const timesClone = { ...times };
    preferredDatesClone.splice(index, 1);
    delete timesClone[index];
    setTimes(Object.keys(timesClone).map((key) => timesClone[key]));
    setPreferredDates(preferredDatesClone);
  };

  const onDateChange = (date: any, index: any) => {
    let current = moment(date).format("YYYY-MM-DD");
    let newTimes =
      (selectedDates &&
        selectedDates[index] &&
        selectedDates[index][current]) ||
      {};
    const foundSimilarDate = preferredDates.find(
      (data) => moment(data.date).format("YYYY-MM-DD") === current
    );
    if (Object.keys(newTimes).length && foundSimilarDate) {
      delete newTimes["is_entire_day"];
    }
    setTimes({
      ...times,
      [index]: newTimes,
    });
    const dateAndTimeRowClone = preferredDates.map((dateData, i) => {
      if (i === index) {
        return {
          date: date.toISOString(),
          time: foundSimilarDate ? null : "is_entire_day",
        };
      }
      return dateData;
    });
    setPreferredDates(dateAndTimeRowClone);
  };

  const onTimeChange = (time: any, index: number) => {
    const dateAndTimeRowClone = preferredDates.map((dateData, i) => {
      if (i === index) {
        return { date: dateData.date, time: time };
      }
      return dateData;
    });

    setPreferredDates(dateAndTimeRowClone);
  };

  /**
   * handle selection date state
   */
  const [selectedDates, setSelectedDates] = useState<any>({});
  const [times, setTimes] = useState<any>({});
  const [dateError, setDateError] = useState<string>("");
  const [isFetchingDates, setIsFetchingDates] = useState<Boolean>(false);

  const fetchDates = (value?: string, index?: number) => {
    setDateError("");
    let services =
      (orderCreateState &&
        orderCreateState.selectedServices &&
        orderCreateState.selectedServices.map((item) => ({
          id: item.id,
          price:
            (item.service_price && item.service_price.price) || item.price || 0,
        }))) ||
      [];
    let now = "";
    let endOfMonth = "";
    let current = moment(value).format("YYYY-MM-DD");
    let key = index || 0;
    /* check whether api is calling first time */
    if (value && selectedDates) {
      /* if dates were already fetched then select it from there */
      if (selectedDates[key] && selectedDates[key][current]) {
        setSelectedDates({ ...selectedDates, [key]: selectedDates[key] });
      } else {
        setIsFetchingDates(true);
        endOfMonth = moment(current)
          .endOf("month")
          .format("YYYY-MM-DD");
        now = moment(current)
          .startOf("month")
          .format("YYYY-MM-DD");

        let payload = {
          from: now,
          to: endOfMonth,
          selected_services: services,
        };
        let data = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        dispatch(
          getAvaiableDates(data, (status: string, response: any) => {
            if (status === "success") {
              setSelectedDates({ ...selectedDates, [key]: response.data });
            } else {
              setDateError(response);
            }
            setIsFetchingDates(false);
          })
        );
      }
    } else {
      /* fetching dates for first time */
      setIsFetchingDates(true);

      endOfMonth = moment()
        .endOf("month")
        .format("YYYY-MM-DD");
      now = moment()
        .startOf("month")
        .format("YYYY-MM-DD");
      let payload = {
        from: now,
        to: endOfMonth,
        selected_services: services,
      };
      let data = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      dispatch(
        getAvaiableDates(data, (status: string, response: any) => {
          if (status === "success") {
            setSelectedDates({ ...selectedDates, [key]: response.data });
          } else {
            setDateError(response);
          }
          setIsFetchingDates(false);
        })
      );
    }
  };

  useEffect(() => {
    return () => {
      const clientDetails = {
        title,
        name,
        email,
        phone,
        postalCode,
        address,
        houseNo,
        place,
      };
      let dataAssignment = {
        selectedDates: selectedDates,
        times: times,
        selectedOption: selectedOption,
        deliveryOption: selectedOption,
        delivery_option_id: selectedOption,
        payment_method: selectedPaymentOption,
      };
      if (!props.orderId) {
        dataAssignment["preferred_date"] = preferredDates;
        dataAssignment["comments"] = comments;
      }

      dispatch(setOrderDetail({ clientDetails, dataAssignment }));
    };
  }, [
    title,
    name,
    email,
    phone,
    postalCode,
    address,
    houseNo,
    place,
    selectedDates,
    times,
    selectedOption,
    preferredDates,
    comments,
    selectedPaymentOption,
  ]);

  const onClickBack = () => {
    const clientDetails = {
      title,
      name,
      email,
      phone,
      postalCode,
      address,
      houseNo,
      place,
    };
    let dataAssignment = {
      selectedDates: selectedDates,
      // displayDate: moment(selectedDate).format('DD-MM-YYYY'),
      times: times,
      // preferred_date: preferredDates,
      selectedOption: selectedOption,
      deliveryOption: selectedOption,
      delivery_option_id: selectedOption,
      payment_method: selectedPaymentOption,
      // comments
    };
    if (!props.orderId) {
      dataAssignment["preferred_date"] = preferredDates;
      dataAssignment["comments"] = comments;
    }

    dispatch(setOrderDetail({ clientDetails, dataAssignment }));
    props.handleBack();
  };

  const [timer, setTimer] = useState<any>(null);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);


  const handleEmailChange = (e: any, value: any) => {
    
    setTitle(value?.salutation ? value?.salutation : '');
    setEmail(value?.email ? value?.email : '');
    setName(value?.first_name ? `${value?.first_name} ${value.last_name != null ? value.last_name : ''}` : '');
    setPhone(value?.phone ? value?.phone : '');
    setPostalCode(value?.zip_code ? value?.zip_code : '');
    setAddress(value?.street ? value?.street : '');
    setHouseNo(value?.street_number ? value?.street_number : '');
    setPlace(value?.city ? value?.city : '');
  };

  const fetchCustomerByEmail = async (email: any) => {
    try {
      const response = await axios.get(`/customers?email=${email}`);
      setEmailIDList(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setEmailLoading(false);
    }
  }

  const handleEmailInputChange = async (e: any, value: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (Boolean(e.target.value) && e.target.value.length > 1) {
      setEmailLoading(true);
      // Clears running timer and starts a new one each time the user types
      clearTimeout(timer);
      setTimer(setTimeout(() => {
        fetchCustomerByEmail(value);
      }, 1000))
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <AlertPopUp
        show={alert}
        warning
        title={alertMsg}
        onConfirm={() => setAlert(false)}
      />

      <Autocomplete
        className="w-25 mb-2 email-search-list"
        id="email-list"
        options={emailIDList}
        loading={emailLoading}
        getOptionLabel={(option: { email: string }) => `${option.email}`}
        style={{ width: 300, zIndex: 10000 }}
        renderInput={params => (<TextField {...params}
          label={<IntlMessages id={"clientInformation.EmailAddress"} />}
          variant="outlined" />
        )}
        onInputChange={(event, value) => handleEmailInputChange(event, value)}
        onChange={(event, value) => handleEmailChange(event, value)}
      />


      <div className="row ">
        <Card className="shadow border-0 col-12 mt-3">
          <CardBody className="row">
            <div className="col-6">
              <CardSubtitle>
                <IntlMessages id={"clientInformationLabel"} />
              </CardSubtitle>
              <ClientDetails
                title={title}
                address={address}
                place={place}
                name={name}
                email={email}
                phone={phone}
                postalCode={postalCode}
                houseNo={houseNo}
                onChangeTitle={setTitle}
                onChangeName={setName}
                onChangeEmail={setEmail}
                onChangePhone={setPhone}
                onChangePostalCode={setPostalCode}
                onChangeHouseNo={setHouseNo}
                onChangeAddress={setAddress}
                onChangePlace={setPlace}
                autoCompleteData={autoCompleteAddressState}
              />
            </div>
            <div className="col-6">
              <CardSubtitle>
                <IntlMessages
                  id={"dataAssignmentLabel"}
                  defaultMessage={"Data Assignment"}
                />
              </CardSubtitle>
              {dateError && <Alert severity="error">{dateError}</Alert>}
              <DataAssignment
                selectedDates={selectedDates}
                times={times}
                orderId={props.orderId}
                addDateRow={addDateRow}
                preferredDates={preferredDates}
                selectedOption={selectedOption}
                optionList={optionList}
                paymentOptionList={paymentList}
                comments={comments}
                deletePreferredDate={deletePreferredDate}
                onChangeSelectedDate={onDateChange}
                onChangeSelectedTime={onTimeChange}
                onChangeSelectedOption={setSelectedOption}
                onChangeSelectedPaymentOption={setSelectedPaymentOption}
                onChangeComments={setComments}
                deliveryOption={selectedOption}
                delivery_option_id={selectedOption}
                selectedPaymentOption={selectedPaymentOption}
                onDateClick={fetchDates}
                isLoading={isFetchingDates}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-2">
        <div>
          <Button
            disabled={props.activeStep === 0}
            onClick={onClickBack}
            className="jr-btn"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmitClicked}
            className="jr-btn"
          >
            {props.activeStep === props.steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehiclesStep3;
