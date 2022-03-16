import React, { useEffect, useState } from "react";

import { useHistory } from "react-router";
import {
  Button,
  Input,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Fab,
  Switch,
  Typography,
  CardContent,
} from "@material-ui/core";
import ContainerHeader from "../ContainerHeader";
import IntlMessages from "util/IntlMessages";
import { Card, CardBody, FormFeedback } from "reactstrap";
import OperatingHoursTable from "../Companies/OperatingHoursTable";
import SaveIcon from "@material-ui/icons/Save";
import SweetAlert from "react-bootstrap-sweetalert";
import AlertPopUp from "../../common/AlertPopUp";
import axios from "../../util/Api";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "actions/Actions/MapActions";
import { useIntl } from "react-intl";

const opening_hours = {
  fri: { open_status: true, open: "09:00", close: "18:00" },
  mon: { open_status: true, open: "09:00", close: "18:00" },
  sat: { open_status: true, open: "09:00", close: "18:00" },
  sun: { open_status: true, open: "09:00", close: "18:00" },
  thu: { open_status: true, open: "09:00", close: "18:00" },
  tue: { open_status: true, open: "09:00", close: "18:00" },
  wed: { open_status: true, open: "09:00", close: "18:00" },
};

const Companies: React.FC<any> = (props: any) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const selectedDepartment = useSelector(
    (state: any) => state.department.selectedDepartment
  );

  /**
   * state of tabindex and using setTabIndex is callback function we can set tab index using setTabIndex
   * */
  const [name, setName] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [streetNumber, setStreetNumber] = useState<string>("");
  const [coc, setCoc] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipcode, setZipCode] = useState<string>("");
  const [oldServicePointId, setOldServicePointId] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phone_2, setPhoneTwo] = useState<string>("");
  const [contactPerson, setContactPerson] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [public_visibility, setPublicVisibility] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [recoverId, setRecoverId] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [servicePointTypeId, setServicePointTypeId] = useState<
    number | string | unknown
  >("");
  const [errorMessages, setError] = useState<any>({});
  const [categories, setCategories] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [cocError, setCocError] = useState<string>("");

  const [showPopUpValue, setPopupValue] = useState<boolean>(false);
  const [sweetAlertSuccess, setSweetAlertSuccess] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(
      fetchCategories((status: string, response: any) => {
        if (status === "success") {
          const filteredCats = response.filter(
            (cat) => cat.department == selectedDepartment.slug
          );
          setCategories(filteredCats);
        }
      })
    );
  }, []);

  const createCompanyDetails = () => {
    setPopupValue(true);
  };

  const fetchInfoFromCoc = () => {
    axios
      .get(`/service-points/chamber-of-commerce/${coc}`)
      .then((res) => {
        const data = res.data.data;
        if (data) {
          data.name && setName(data.name);
          data.street && setStreet(data.name);
          data.street_number && setStreetNumber(data.street_number);
          data.city && setCity(data.city);
        }
      })
      .catch((error) => {
        setCocError(
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };

  const handleOnConfirm = () => {
    setPopupValue(false);
    return (dispatch: any) => {
      axios
        .post("/service-points", {
          name: name,
          coc: coc,
          street: street,
          city: city,
          street_number: streetNumber,
          zip_code: zipcode,
          oldServicePointId: oldServicePointId,
          createdAt: createdAt,
          updatedAt: updatedAt,
          website: website,
          phone: phone,
          phone_2: phone_2,
          contact_person: contactPerson,
          email: email,
          description: description,
          service_point_type_id: servicePointTypeId,
          age: age,
        })
        .then((response) => {
          setSweetAlertSuccess("created");
          // dispatch(successValueTrue());
        })
        .catch((error) => {
          // dispatch(errorMessage(error.response.data.message))
        });
    };
  };

  const handleRecoverCompany = () => {
    setPopupValue(false);
    setLoading(true);
    axios
      .patch(`/service-points/${recoverId}/recover`, {})
      .then((response) => {
        const dat = (response.data && response.data.data) || {};
        setLoading(false);
        if (dat.id) {
          setSweetAlertSuccess("recovered");
          setTimeout(() => {
            history.push(`/support/companies/${dat.id}/edit`);
          }, 2 * 1000);
        }
      })
      .catch((error) => {
        const errorMsg = (error.response && error.response.data.errors) || {};
        setError(errorMsg);
        setLoading(false);
      });
  };

  const handleOnConfirmButton = () => {
    setPopupValue(false);
    setLoading(true);
    axios
      .post(`/service-points`, {
        name: name,
        coc: coc,
        street: street,
        city: city,
        street_number: streetNumber,
        zip_code: zipcode,
        website: website,
        phone: phone,
        phone_2: phone_2,
        contact_person: contactPerson,
        email: email,
        description: description,
        service_point_type_id: servicePointTypeId,
        age: age,
      })
      .then((response) => {
        const dat = (response.data && response.data.data) || {};
        setLoading(false);
        if (dat.id) {
          setSweetAlertSuccess("created");
          setTimeout(() => {
            history.push(`/support/companies/${dat.id}/edit`);
          }, 2 * 1000);
        }
      })
      .catch((error) => {
        const errorMsg = (error.response && error.response.data.errors) || {};
        if (errorMsg.recover) {
          setRecoverId(errorMsg.recover[0].id);
          setPopupValue(true);
        }
        setError(errorMsg);
        setLoading(false);
      });
  };

  const handleOnCancelButton = () => {
    setPopupValue(false);
    setRecoverId("");
  };

  const onClickSuccess = () => {
    setSweetAlertSuccess(null);
    props.history.push(`/support/companies`);
  };

  const getError = (field: string) => {
    return (
      errorMessages &&
      errorMessages[field] && (
        <FormFeedback style={{ display: "block" }}>
          {errorMessages[field][0]}
        </FormFeedback>
      )
    );
  };

  const isCreate =
    (props.history.location && props.history.location.pathname) ===
    "/support/companies/create";

  return (
    <>
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="partner.settings" />}
      />
      <Card className="shadow border-0">
        <h1 className="text-center mt-4">
          <IntlMessages id="partnerSettings.title" />
          {/* {name} */}
        </h1>
        <h5 className="text-center">
          <IntlMessages id="partnerSettings.SubTitle" />
        </h5>
        <CardBody className="d-flex">
          {!isCreate && (
            <Card className="shadow border-0 w-15 h-100 mt-5">
              <img
                src="https://cdn.serviceright-autos.nl/wp-content/uploads/2019/10/SRA-autos-klein-4.svg"
                height={200}
                width={200}
              />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                // onChange={(event) => this.handleChange(event)}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  className="bg-primary text-white w-100"
                  component="span"
                >
                  <IntlMessages id="partnerSettings.chooseNewImage" />
                </Button>
              </label>
            </Card>
          )}
          <div className="w-75 ml-5">
            <div className="row">
              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.name" />:
                  &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <Input
                    value={name}
                    error={errorMessages && !!errorMessages.name}
                    inputProps={{
                      "aria-label": "name",
                    }}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                  {getError("name")}
                </div>
              </div>

              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.coc" />:
                  &emsp;&emsp;&emsp;&emsp;&ensp;
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <div className="d-flex">
                    <Input
                      value={coc}
                      error={errorMessages && !!errorMessages.coc}
                      className="w-50"
                      inputProps={{
                        "aria-label": "coc",
                      }}
                      onChange={(event) => {
                        setCoc(event.target.value);
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={coc.length !== 8}
                      onClick={fetchInfoFromCoc}
                      className="jr-btn ml-2"
                    >
                      <IntlMessages id="partnerSettings.fetchCocInfo" />
                    </Button>
                  </div>
                  {getError("coc")}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.street" />:
                  &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <Input
                    value={street}
                    error={errorMessages && !!errorMessages.street}
                    inputProps={{
                      "aria-label": "street",
                    }}
                    onChange={(event) => {
                      setStreet(event.target.value);
                    }}
                  />
                  {getError("street")}
                </div>
              </div>

              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.streetNumber" />:
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <Input
                    value={streetNumber}
                    error={errorMessages && !!errorMessages.street_number}
                    inputProps={{
                      "aria-label": "streetNumber",
                    }}
                    onChange={(event) => {
                      setStreetNumber(event.target.value);
                    }}
                  />
                  {getError("street_number")}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.city" />:
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <Input
                    value={city}
                    error={errorMessages && !!errorMessages.city}
                    inputProps={{
                      "aria-label": "city",
                    }}
                    onChange={(event) => {
                      setCity(event.target.value);
                    }}
                  />
                  {getError("city")}
                </div>
              </div>

              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.zipcode" />:
                  &emsp;&emsp;&ensp;
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <Input
                    value={zipcode}
                    error={errorMessages && !!errorMessages.zip_code}
                    inputProps={{
                      "aria-label": "zipcode",
                    }}
                    onChange={(event) => {
                      setZipCode(event.target.value);
                    }}
                  />
                  {getError("zip_code")}
                </div>
              </div>
            </div>
            {!isCreate && (
              <div className="row">
                <div className="d-flex col-md-8 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.createdAt" />:
                    &emsp;&emsp;&emsp;&ensp;
                  </label>
                  <Input
                    type="datetime-local"
                    defaultValue={new Date()}
                    value={createdAt}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "createdAt",
                    }}
                    onChange={(event) => {
                      setCreatedAt(event.target.value);
                    }}
                  />
                </div>
              </div>
            )}

            {!isCreate && (
              <div className="row">
                <div
                  className="d-flex col-md-8 col-12"
                  style={{ width: "100% !important" }}
                >
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.updatedAt" />:
                    &emsp;&emsp;&emsp;&ensp;
                  </label>
                  <Input
                    type="datetime-local"
                    style={{ width: "100% !important" }}
                    defaultValue={new Date()}
                    value={updatedAt}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "updatedAt",
                    }}
                    onChange={(event) => {
                      setUpdatedAt(event.target.value);
                    }}
                  />
                </div>
              </div>
            )}

            <div className="row">
              {!isCreate ? (
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.oldServicePointId" />:
                  </label>
                  <Input
                    value={oldServicePointId}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "oldServicePointId",
                    }}
                    onChange={(event) => {
                      setOldServicePointId(event.target.value);
                    }}
                  />
                </div>
              ) : (
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.email" />
                    :&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                  </label>
                  <div className="d-flex flex-column mb-3 ml-4">
                    <Input
                      value={email}
                      error={errorMessages && !!errorMessages.email}
                      placeholder={formatMessage({
                        id: "partnerSettings.email",
                      })}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    {getError("email")}
                  </div>
                </div>
              )}

              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.website" />
                  :&emsp;&emsp;&ensp;&nbsp;
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <Input
                    error={errorMessages && !!errorMessages.website}
                    placeholder={formatMessage({
                      id: "partnerSettings.website",
                    })}
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                  {getError("website")}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.phone" />:
                  &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <Input
                    error={errorMessages && !!errorMessages.phone}
                    placeholder={formatMessage({
                      id: "partnerSettings.phone",
                    })}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                  {getError("phone")}
                </div>
              </div>
              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.phoneTwo" />
                  :&emsp;&emsp;&ensp;&nbsp;
                </label>
                <Input
                  placeholder={formatMessage({
                    id: "partnerSettings.phoneTwo",
                  })}
                  className="w-50 mb-3 ml-4"
                  value={phone_2}
                  onChange={(event) => setPhoneTwo(event.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.contactPerson" />
                  :&emsp;&emsp;
                </label>
                <div className="d-flex flex-column mb-3 ml-4">
                  <Input
                    value={contactPerson}
                    error={errorMessages && !!errorMessages.contact_person}
                    placeholder={formatMessage({
                      id: "partnerSettings.contactPerson",
                    })}
                    onChange={(event) => setContactPerson(event.target.value)}
                  />
                  {getError("contact_person")}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="partnerSettings.companyType" />
                  :&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                </label>
                <Select
                  className="w-50 mb-3"
                  onChange={(event) =>
                    setServicePointTypeId(event.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((type) => (
                    <MenuItem value={type.id}>{type.name}</MenuItem>
                  ))}
                </Select>
              </div>

              <div className="d-flex col-md-6 col-12">
                <label className="mt-2">
                  <IntlMessages id="company.availableOnWeb" />:
                </label>
                <Switch
                  classes={{
                    checked: "text-secondary",
                  }}
                  value={public_visibility}
                  checked={public_visibility}
                  onChange={(event) =>
                    setPublicVisibility(event.target.checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardBody>
        <hr />

        {!isCreate && (
          <div className="row mb-3 mt-4">
            <div className="col-md-6">
              <CardBody className="d-flex">
                <div className="w-100 ml-4">
                  <h3>
                    <IntlMessages id="partnerSettings.companyDescription" />
                  </h3>

                  <div className="col-12 border">
                    <TextField
                      id="multiline-flexible"
                      multiline
                      rows="5"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      margin="normal"
                      fullWidth
                    />
                  </div>
                </div>
              </CardBody>

              <CardBody className="d-flex">
                <div className="w-100 ml-4">
                  <h3>
                    <IntlMessages id="partnerSettings.commandsToAccept" />
                  </h3>

                  <div className="col-12 pt-3 pb-3 ml-5">
                    <form className="row" autoComplete="off">
                      <FormControl className="w-75 mb-2">
                        <InputLabel>
                          <IntlMessages id="companiesTable.selectRadius" />
                        </InputLabel>
                        <Select
                          value={age}
                          onChange={(event) =>
                            setAge(event.target.value as string)
                          }
                          input={<Input id="ageSimple1" />}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>
                            <IntlMessages id="partnerSettings.radius5" />
                          </MenuItem>
                          <MenuItem value={20}>
                            <IntlMessages id="partnerSettings.radius10" />
                          </MenuItem>
                          <MenuItem value={30}>
                            <IntlMessages id="partnerSettings.radius15" />
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                  </div>
                </div>
              </CardBody>
            </div>

            <CardBody className="col-md-6">
              <OperatingHoursTable
                id="{props.id}"
                openingHours={opening_hours}
              />
            </CardBody>
          </div>
        )}
        <div className="clearfix paddingTen">
          <Fab
            className="float-right"
            color="primary"
            aria-label="add"
            disabled={isCreate ? isLoading : false}
            onClick={createCompanyDetails}
          >
            <SaveIcon />
          </Fab>
        </div>
      </Card>

      <AlertPopUp
        show={isLoading}
        title={<IntlMessages id="sweetAlerts.sendCallBackLoading" />}
        warning
        disabled
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={() => {}}
      />

      <AlertPopUp
        show={cocError !== ""}
        title={cocError}
        danger
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={() => setCocError("")}
      />

      <AlertPopUp
        show={showPopUpValue}
        message={
          recoverId ? (
            <IntlMessages id="companiesTable.recoverCompany" />
          ) : (
            <IntlMessages id="companiesTable.createNewCompany" />
          )
        }
        title={<IntlMessages id="sweetAlerts.areYouSure" />}
        warning
        showCancel
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={
          isCreate
            ? recoverId
              ? () => handleRecoverCompany()
              : () => handleOnConfirmButton()
            : () => handleOnConfirm()
        }
        onCancel={handleOnCancelButton}
      />

      <SweetAlert
        show={!!sweetAlertSuccess}
        title="Success"
        success
        confirmBtnText="Okay"
        onConfirm={onClickSuccess}
      >
        {sweetAlertSuccess === "created" ? (
          <IntlMessages id="companiesTable.companyCreateSuccess" />
        ) : (
          <IntlMessages id="companiesTable.companyRecoverSuccess" />
        )}
      </SweetAlert>
    </>
  );
};

export default Companies;
