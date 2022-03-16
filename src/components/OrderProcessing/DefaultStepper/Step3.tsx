import React, { Fragment, useEffect, useState } from "react";
import { Button, ListItem, ListItemText, List } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardFooter, CardImg, CardSubtitle } from "reactstrap";
import CustomScrollbars from "../../../util/CustomScrollbars";
import {
  submitOrderAction,
  updateOrderAction,
} from "../../../actions/Actions/OrderActions";
import AlertPopUp from "../../../common/AlertPopUp";
import InjectMassage from "../../../util/IntlMessages";
import {
  IVehiclesStep4Props,
  IRootStep4State,
  IService,
  ISelectedServiceItem,
} from "./../VehiclesStepper/Interface/Step4Interface";
import IntlMessages from "../../../util/IntlMessages";
import moment from "moment";
import queryString from "query-string";


const DefaultStep3 = (props: IVehiclesStep4Props) => {
  /**
   *  dispatch
   */
  const dispatch = useDispatch();

  /**
   *  service reducer state
   */
  const serviceState = useSelector(
    (state: IRootStep4State) => state.orderState.orderCreate.services
  );

  /**
   *  order prefill reducer state
   */
  const orderPrefillState = useSelector(
    (state: IRootStep4State) => state.orderState.orderCreate.orderPrefillData
  );

  /**
   *  order details reduce state
   */
  const orderDetails = useSelector(
    (state: IRootStep4State) => state.orderState.orderCreate.orderDetails
  );
  /**
   *  order details reduce state
   */
   const orderState = useSelector(
    (state: IRootStep4State) => state.orderState.orderCreate.order
  );
  /**
   *  selected service reduce state
   */
  const servicesState = useSelector(
    (state: IRootStep4State) => state.orderState.orderCreate.selectedServices
  );

  /**
   *  selected service state
   */
  const selectedService = serviceState.filter(
    (service: IService) => service.checked === true
  );

  /**
   *  check if order can be finished
   */
  const [isFinishable, setIsFinishable] = useState<boolean>(true);

  /**
   *  alert pop up state handler
   */
  const [error, setError] = useState<boolean>(false);

  /**
   *  error msg state handler
   */
  const [errorMsg, setErrorMsg] = useState<string>("");

  /**
   *  prepare data to submit order
   */
  // const selected = useSelector((state: any) => state.orderState.orderCreate.selectedServices);
  const prepareData = (fieldName: string) => {
    const selectedServices: any = (servicesState || []).map((service: any) => {
      const serviceObj: any = {
        id: service.id,
        price:
          (service.service_price && service.service_price.price) ||
          service.price ||
          0,
      };

      if (service.custom_description) {
        serviceObj.custom_description = service.custom_description;
      }

      if (orderPrefillState && orderPrefillState.id) {
        serviceObj.price_per_unit =
          (service.service_price && service.service_price.price) ||
          service.price ||
          0;
      } else {
        serviceObj.price_per_unit = 0;
      }
      return serviceObj;
    });

    let payload:any = {
      salutation: orderDetails.clientDetails.title,
      name: orderDetails.clientDetails.name,
      email: orderDetails.clientDetails.email,
      phone: orderDetails.clientDetails.phone,
      country: "NL",
      zip_code: orderDetails.clientDetails.postalCode,
      street_number: orderDetails.clientDetails.houseNo,
      street: orderDetails.clientDetails.address,
      city: orderDetails.clientDetails.place,
      // preferred_date: [{date: orderDetails.dataAssignment.date, time: orderDetails.dataAssignment.time}],
      // preferred_date: orderDetails.dataAssignment.preferred_date,
      services: selectedServices,
      comment:
        orderPrefillState && orderPrefillState.comments
          ? orderPrefillState.comments
          : orderDetails.dataAssignment.comments,
    };
		if (orderDetails.dataAssignment.payment_method) payload.payment_method = { id: orderDetails.dataAssignment.payment_method };

    if (fieldName) {
      payload[fieldName] = true;
    }

    if (
      !(orderPrefillState && orderPrefillState.id) &&
      orderDetails.dataAssignment.preferred_date[0] &&
      orderDetails.dataAssignment.preferred_date[0].date &&
      orderDetails.dataAssignment.preferred_date[0].time
    ) {
      payload[
        "preferred_date"
      ] = orderDetails.dataAssignment.preferred_date.map((data) => {
        if (data.time === "is_entire_day") {
          return { date: data.date, is_entire_day: true };
        }
        return data;
      });
    }
    let queryParams = queryString.parse(window.location.search);
    if(queryParams) {
      payload  = { ...queryParams, ...payload}
    }
    return payload;
  };

  /**
   * Handle Error state
   */
  useEffect(() => {
    setErrorMsg("");
  }, []);

  useEffect(() => {
    const { clientDetails, dataAssignment } = orderDetails;
    if (
      clientDetails &&
      clientDetails.houseNo &&
      clientDetails.postalCode &&
      clientDetails.address &&
      clientDetails.place &&
      ((orderPrefillState && orderPrefillState.id) ||
        (dataAssignment &&
          dataAssignment.preferred_date &&
          dataAssignment.preferred_date[0] &&
          dataAssignment.preferred_date[0].date &&
          dataAssignment.preferred_date[0].time))
    ) {
      setIsFinishable(false);
    }
  }, [orderDetails]);

  /**
   *  submit order handler
   */
  const onSubmitHandler = (e: any, fieldName: string) => {
    servicesState &&
    servicesState.length &&
    orderPrefillState &&
    orderPrefillState.id
      ? dispatch(
          updateOrderAction(
            orderPrefillState && orderPrefillState.id,
            prepareData(fieldName)
          )
        )
      : dispatch(submitOrderAction(prepareData(fieldName)));
  };

  useEffect(() => {
    if (orderDetails.orderSubmitResposne) {
      if (orderDetails.orderSubmitResposne.id) {
        props.handleNext();
      } else if (orderDetails.orderSubmitResposne.status_code !== 200) {
        setError(true);
        setErrorMsg(
          orderDetails.orderSubmitResposne.message ? (
            orderDetails.orderSubmitResposne.message
          ) : (
            <InjectMassage id={"orderSubmitError"} />
          )
        );
      }
    }
  }, [orderDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   *  to get total price of selected services
   */
  const selectedServiceTotal = () => {
    let total = 0;
    serviceState.forEach((service: IService) => {
      if (service.checked) {
        total += +service.service_price.price || 0;
      }
    });
    return total;
  };

  /**
   * Render form errors
   */
  const renderError = () => {
    const formErrors =
      (orderDetails.orderSubmitResposne &&
        orderDetails.orderSubmitResposne.errors) ||
      {};
    return (
      <div className="col-4 mb-2">
        <Alert severity="error">
          <AlertTitle>{errorMsg}</AlertTitle>
          <div>
            {Object.keys(formErrors).map((item, index) => {
              return (
                <>
                  {formErrors[item].map((error) => {
                    return <div key={error}>{error}</div>;
                  })}
                  <br />
                </>
              );
            })}
          </div>
        </Alert>
      </div>
    );
  };

  const paymentOption = (orderState.paymentOption &&
    orderState.paymentOption.filter(
      (option: any) => option.id == orderDetails.dataAssignment.payment_method
    )[0]) || [{}];

  return (
    <div>
      <div className="row ">
        <Card className="shadow border-0 col-12">
          {orderDetails && (
            <CardBody>
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-6">
                      <CardSubtitle>
                        <IntlMessages
                          id={"selectedServices"}
                          defaultMessage={"Selected Services"}
                        />
                      </CardSubtitle>
                      <Card className="shadow border-0">
                        <List className="pinned-list" subheader={<div />}>
                          <CustomScrollbars
                            className="scrollbar"
                            style={{ height: "100%" }}
                          >
                            {selectedService.map(
                              (item: ISelectedServiceItem) => (
                                <ListItem>
                                  <ListItemText
                                    primary={item.name}
                                    secondary={item.custom_description}
                                    className="col-9"
                                  />
                                  <ListItemText
                                    primary={
                                      item.service_price
                                        ? (
                                            item.service_price.price / 100
                                          ).toFixed(2)
                                        : "00"
                                    }
                                    className="col-3"
                                  />
                                </ListItem>
                              )
                            )}
                          </CustomScrollbars>
                        </List>
                        <CardFooter>
                          <div className="clearfix">
                            <div className="float-left">
                              <IntlMessages id={"searchServiceTotalPrice"} /> :
                            </div>
                            <div className="float-right">
                              {serviceState &&
                                (selectedServiceTotal() / 100).toFixed(2)}
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                    <div className="col-6">
                      <CardSubtitle>
                        <IntlMessages
                          id={"vehicleStep3Title"}
                          defaultMessage={"Order Information"}
                        />
                      </CardSubtitle>
                      <CustomScrollbars
                        className="scrollbar"
                        style={{ height: "100%" }}
                      >
                        <h1>
                          <IntlMessages
                            id={"clientInformationLabel"}
                            defaultMessage={"Client Information"}
                          />{" "}
                          :
                        </h1>
                        <div className="row">
                          <div className="col-3">
                            <h4>
                              <IntlMessages id="orderOverview.Name" /> :
                            </h4>
                          </div>
                          <div className="col-9">
                            <h4>
                              {orderDetails.clientDetails.title}{" "}
                              {orderDetails.clientDetails.name}
                            </h4>
                          </div>
                          <div className="col-3">
                            <h4>
                              <IntlMessages id="orderOverview.Email" /> :
                            </h4>
                          </div>
                          <div className="col-9">
                            <h4>{orderDetails.clientDetails.email}</h4>
                          </div>
                          <div className="col-3">
                            <h4>
                              <IntlMessages id="orderOverview.Phone" /> :
                            </h4>
                          </div>
                          <div className="col-9">
                            <h4>{orderDetails.clientDetails.phone}</h4>
                          </div>
                          <div className="col-3">
                            <h4>
                              <IntlMessages id="orderOverview.Address" /> :
                            </h4>
                          </div>
                          <div className="col-9">
                            <h4>{orderDetails.clientDetails.address}</h4>
                          </div>
                          <div className="col-3">
                            <h4>
                              <IntlMessages id="orderOverview.HouseNo" /> :{" "}
                            </h4>
                          </div>
                          <div className="col-9">
                            <h4>{orderDetails.clientDetails.houseNo}</h4>
                          </div>
                          <div className="col-3">
                            <h4>
                              <IntlMessages id="orderOverview.Pincode" /> :
                            </h4>
                          </div>
                          <div className="col-9">
                            <h4>{orderDetails.clientDetails.postalCode}</h4>
                          </div>
                          <div className="col-3">
                            <h4>
                              <IntlMessages id="orderOverview.Place" /> :{" "}
                            </h4>
                          </div>
                          <div className="col-9">
                            <h4>{orderDetails.clientDetails.place}</h4>
                          </div>
                        </div>

                        <h1>
                          <IntlMessages
                            id={"dataAssignmentLabel"}
                            defaultMessage={"Data Assignment"}
                          />{" "}
                          :
                        </h1>
                        <div className="row">
                          {orderDetails.dataAssignment.preferred_date &&
                            orderDetails.dataAssignment.preferred_date.length &&
                            orderDetails.dataAssignment.preferred_date.map(
                              ({ date, time }, i) => (
                                <Fragment key={i}>
                                  <div className="col-3">
                                    <h4>
                                      <IntlMessages id="orderOverview.Date" /> :
                                    </h4>
                                  </div>
                                  <div className="col-9">
                                    <h4>{moment(date).format("YYYY-MM-DD")}</h4>
                                  </div>
                                  <div className="col-3">
                                    <h4>
                                      <IntlMessages id="orderOverview.Time" /> :
                                    </h4>
                                  </div>
                                  <div className="col-9">
                                    <h4>
                                      {time === "is_entire_day"
                                        ? "Hele dag beschikbaar"
                                        : time}
                                    </h4>
                                  </div>
                                </Fragment>
                              )
                            )}

                          {!(orderPrefillState && orderPrefillState.id) && (
                            <div className="col-4">
                              <h4>
                                <IntlMessages id="orderOverview.Comments" /> :
                              </h4>
                            </div>
                          )}
                          {!(orderPrefillState && orderPrefillState.id) && (
                            <div className="col-8">
                              <h4>
                                {(orderDetails.dataAssignment &&
                                  orderDetails.dataAssignment.comments) ||
                                  ""}
                              </h4>
                            </div>
                          )}
                          <div className="col-4">
                            <h4>
                              <IntlMessages id="orderOverview.paymentMethod" /> :
                            </h4>
                          </div>
                          <div className="col-8">
                            <h4>
                              {(paymentOption && paymentOption.name) || ""}
                            </h4>
                          </div>
                        </div>
                      </CustomScrollbars>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          )}
        </Card>
        {errorMsg && renderError()}
        <AlertPopUp
          show={error}
          title={errorMsg}
          confirmBtnBsStyle="danger"
          type={"danger"}
          onConfirm={() => setError(false)}
        />
      </div>

      <div className="mt-2">
        <div>
          <Button
            disabled={props.activeStep === 0}
            onClick={props.handleBack}
            className="jr-btn"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => onSubmitHandler(e, "")}
            className="jr-btn"
            disabled={isFinishable}
          >
            {props.activeStep === props.steps.length - 1 ? (
              <IntlMessages id="appModule.finish" />
            ) : (
              <IntlMessages id="appModule.next" />
            )}
          </Button>
          {orderPrefillState &&
            orderPrefillState.quote_request &&
            orderPrefillState.status &&
            orderPrefillState.status.name === "awaiting_confirmation" && (
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => onSubmitHandler(e, "accept_quote")}
                className="jr-btn"
              >
                <IntlMessages id="appModule.acceptQuotation" />
              </Button>
            )}
          {orderPrefillState && orderPrefillState.id ? null : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => onSubmitHandler(e, "is_draft")}
                className="jr-btn"
              >
                <IntlMessages id="appModule.saveAsDraft" />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => onSubmitHandler(e, "quote_request")}
                className="jr-btn"
              >
                <IntlMessages id="appModule.sendQuote" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultStep3;
