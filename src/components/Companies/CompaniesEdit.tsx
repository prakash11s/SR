import React, { Component } from "react";
import {
  Card,
  CardBody,
  Spinner,
  Modal,
  ModalBody,
  Col,
  Row,
  ModalHeader,
} from "reactstrap";
import {
  Button,
  Input,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Fab,
  Switch,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { connect } from "react-redux";
import moment from "moment";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import RBACContext from "../../rbac/rbac.context";
import ContainerHeader from "../ContainerHeader";
import IntlMessages from "util/IntlMessages";
import UserHasPermission from "util/Permission";
import {
  getPartnerSettingDetails,
  setPhone,
  setEmail,
  setPhoneTwo,
  setWebsite,
  setDescription,
  setCoc,
  updatePartnerDetails,
  resetLoadingError,
  setVisibility,
  setServicePointTypeId,
  updatePartnerAvatar,
  setName,
  setStreet,
  setCity,
  setStreetNumber,
  setContact,
  setZipcode,
} from "../../actions/Actions/PartnerSettingActions";
import { fetchPoints } from "../../actions/Actions/MapActions";
import {
  ICompaniesEditProps,
  ICompaniesEditState,
  IRootPartnerSettingState,
} from "./Interface/CompaniesEditInterface";
import OperatingHoursTable from "../Companies/OperatingHoursTable";
import {
  createRecognition,
  updateRecognition,
  deleteRecognition,
} from "../../actions/Actions/ComapaniesActions";
import AlertPopUp from "../../common/AlertPopUp";
import Avatar from "@material-ui/core/Avatar";
import { injectIntl } from "react-intl";
import { readableDateTimeLocale } from "../../util/helper";
import { getServiceCategories } from "actions/Actions/ServicesActions";
import { DatePicker } from "material-ui-pickers";

class CompaniesEdit extends Component<
  ICompaniesEditProps & any,
  ICompaniesEditState
> {
  static contextType = RBACContext;
  constructor(props) {
    super(props);
  }

  state: ICompaniesEditState = {
    checked: [0],
    passwordChange: false,
    Image: "",
    uploadImage: "",
    imageLoading: false,
    isCocEmpty: false,
    imageAlert: false,
    imageAlertMsg: "",
    imageAlertType: "",
    showPopUpValue: false,
    popUpType: "warning",
    popUpMsg: "",
    points: [],
    expiryDate: null,
    showRecognitionPopup: false,
    showExpiryDate: false,
    recognitionId: 9999,
    editRecognitionId: null,
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({ isCocEmpty: !this.props.partner.coc })
    // this.props.getPartnerSettingDetails(id, this.props.history);
    if (
      !this.context.userCan(
        this.context.abilities,
        "update-servicepoint-information"
      )
    ) {
      this.props.history.push("/support/companies/error/403");
    } else {
      this.props.getPartnerSettingDetails(this.props.history, id);
      this.props.getServiceCategories();
    }
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.setState({ expiryDate: tomorrow });
    this.props.fetchPoints((status: string, response: any) => {
      if (status === "success")
        this.setState({
          ...this.state,
          points: response,
        });
    });
  }

  handleToggle = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: number
  ) => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  updateCompanyDetails = () => {
    const { partner } = this.props;
    if (
      partner.phone ||
      partner.phone_2 ||
      partner.email ||
      partner.website ||
      partner.coc ||
      partner.description ||
      partner.name ||
      partner.city ||
      partner.street ||
      partner.street_number ||
      partner.service_point_type_id ||
      partner.zipcode
    ) {
      const payload: any = {};
      payload.phone = partner.phone ? partner.phone : "";
      payload.phone_2 = partner.phone_2 ? partner.phone_2 : "";
      payload.email = partner.email ? partner.email : "";
      payload.coc = partner.coc ? partner.coc : "";
      payload.description = partner.description ? partner.description : "";
      payload.website = partner.website ? partner.website : "";
      payload.public_visibility = partner.public_visibility;
      payload.name = partner.name ? partner.name : "";
      payload.city = partner.city ? partner.city : "";
      payload.street = partner.street ? partner.street : "";
      payload.contact_person = partner.contact ? partner.contact : "";
      payload.service_point_type_id = partner.service_point_type_id
        ? partner.service_point_type_id
        : "";
      payload.street_number = partner.street_number
        ? partner.street_number
        : "";
      payload.zip_code = partner.zip_code ? partner.zip_code : "";
      this.props.updatePartnerDetails(partner.id, payload, false);
    }
  };

  renderModal = () => {
    const error = this.props.partnerError;
    const errors = (error && error.errors) || [];
    return (
      <Modal isOpen={this.props.partnerLoading}>
        <ModalBody>
          <Row>
            <Col sm={{ size: 11 }}>
              <h1>
                <b>{error === null ? "Updating..." : error.message}</b>
              </h1>
              {errors && (
                <p>
                  {Object.keys(errors).map((item) => {
                    return (
                      <>
                        {errors[item].map((text) => {
                          return <div key={text}>{text}</div>;
                        })}
                      </>
                    );
                  })}
                </p>
              )}
            </Col>
            <Col sm={{ size: 1 }}>
              {error !== null && (
                <IconButton onClick={this.props.resetLoadingError}>
                  <CancelIcon />
                </IconButton>
              )}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  };

  handleChange = (event) => {
    const uploadImage = URL.createObjectURL(event.target.files[0]);
    this.props.uploadImage(
      this.props.match.params.id,
      event.target.files[0],
      false,
      (type: string, response: string) => {
        this.setState({
          ...this.state,
          imageLoading: type === "loading",
          Image: type === "response" ? uploadImage : "",
          imageAlert: type === "response" || type === "fail",
          imageAlertMsg: response,
          imageAlertType: type === "response" ? "success" : "warning",
        });
      }
    );
  };

  handleOnConfirmButton = () => {
    if (this.state.popUpType === "warning") {
      this.setState({
        ...this.state,
        popUpType: "loading",
        showPopUpValue: true,
      });
      this.props.deleteRecognition(
        this.props.partner.id,
        this.state.recognitionId,
        (response: string, msg: string) => {
          this.setState({
            ...this.state,
            popUpType: response,
            recognitionId: 9999,
            popUpMsg: "delete",
            showPopUpValue: true,
          });
        }
      );
    } else if (this.state.popUpType === "success") {
      this.setState({ ...this.state, popUpType: "", showPopUpValue: false });
      this.props.getPartnerSettingDetails(
        this.props.history,
        this.props.match.params.id,
      );
    } else {
      this.setState({ ...this.state, showPopUpValue: false });
      // props.onCancel(false)
    }
  };

  openCreateRecognitionModal = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.setState({
      showRecognitionPopup: true,
      showExpiryDate: false,
      expiryDate: tomorrow,
      popUpMsg: "create",
      recognitionId: 9999,
    });
  };

  createRecognition = () => {
    if (this.state.recognitionId && this.state.recognitionId !== 9999) {
      this.setState({
        ...this.state,
        popUpType: "loading",
        showRecognitionPopup: false,
        showPopUpValue: true,
      });
      const isUpdate = this.state.popUpMsg === "update";
      const recognitionAction = isUpdate
        ? this.props.updateRecognition
        : this.props.createRecognition;
      recognitionAction(
        this.props.partner.id,
        isUpdate ? this.state.editRecognitionId : this.state.recognitionId,
        this.state.showExpiryDate
          ? {
              valid_until: this.state.expiryDate,
            }
          : {},
        (popUpType: string, response: any) => {
          this.setState({
            ...this.state,
            popUpType,
          });
        }
      );
    }
  };

  handleOnCancelButton = () => {
    this.setState({
      ...this.state,
      popUpType: "",
      popUpMsg: "",
      showPopUpValue: false,
      recognitionId: 9999,
    });
  };
  setRecognitions = (recognitionId: number) => {
    this.setState({
      ...this.state,
      recognitionId,
      showPopUpValue: true,
      popUpType: "warning",
      popUpMsg: "delete",
    });
  };
  editRecognitions = (recognition) => {
    if (recognition.pivot.valid_until) {
      this.setState({
        ...this.state,
        showExpiryDate: true,
        expiryDate: recognition.pivot.valid_until,
        recognitionId: recognition.id,
        editRecognitionId: recognition.pivot.id,
        showRecognitionPopup: true,
        popUpMsg: "update",
      });
    } else {
      this.setState({
        ...this.state,
        recognitionId: recognition.id,
        editRecognitionId: recognition.pivot.id,
        showRecognitionPopup: true,
        popUpMsg: "update",
      });
    }
  };
  handleTitle = () => {
    if (this.state.popUpMsg === "create") {
      if (this.state.popUpType === "success") {
        return <IntlMessages id="sweetAlerts.createRecognitionSuccess" />;
      } else if (this.state.popUpType === "danger") {
        return <IntlMessages id="sweetAlerts.createRecognitionFail" />;
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    } else if (this.state.popUpMsg === "update") {
      if (this.state.popUpType === "success") {
        return <IntlMessages id="sweetAlerts.updateRecognitionSuccess" />;
      } else if (this.state.popUpType === "danger") {
        return <IntlMessages id="sweetAlerts.updateRecognitionFail" />;
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    } else {
      if (this.state.popUpType === "warning") {
        return <IntlMessages id="sweetAlerts.deleteRecognition" />;
      } else if (this.state.popUpType === "success") {
        return <IntlMessages id="sweetAlerts.deleteRecognitionSuccess" />;
      } else if (this.state.popUpType === "danger") {
        return <IntlMessages id="sweetAlerts.deleteRecognitionFail" />;
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    }
  };

  render() {
    const { partner, selectedDepartment, categories } = this.props;
    const { Image, imageLoading, showPopUpValue, popUpType } = this.state;
    const tomorrow = new Date(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    //const FormatedDate = isodate => moment(isodate).format('DD-MM-YYYY, HH:MM:SS')
    const localDateTimeFormat = this.props.intl.formatMessage({
      id: "localeDateTime",
      defaultMessage: "DD-MM-YYYY hh:mm:ss",
    });

    return (
      <>
        <ContainerHeader
          match={this.props.match}
          title={<IntlMessages id="partner.settings" />}
        />
        {this.props.partnerLoading && this.renderModal()}
        <Card className="shadow border-0">
          <h1 className="text-center mt-4">
            <IntlMessages id="partnerSettings.title" /> {partner.name}
          </h1>
          <h5 className="text-center">
            <IntlMessages id="partnerSettings.SubTitle" />
          </h5>
          <CardBody className="d-flex">
            <Card className="shadow border-0 w-15 h-100 mt-5">
              {!imageLoading &&
              selectedDepartment &&
              selectedDepartment.image &&
              selectedDepartment.image.small ? (
                <img
                  src={
                    Image
                      ? Image
                      : partner.avatar
                      ? partner.avatar
                      : selectedDepartment.image.small
                  }
                  height={200}
                  width={200}
                />
              ) : (
                <Row>
                  <Col sm={{ size: 2, offset: 4 }}>
                    <Spinner
                      color="primary"
                      style={{ width: "3rem", height: "3rem" }}
                    />
                  </Col>
                </Row>
              )}
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                onChange={(event) => this.handleChange(event)}
              />
              <label htmlFor="image-upload">
                <UserHasPermission permission="update-servicepoint-information">
                  <Button
                    variant="contained"
                    className="bg-primary text-white w-100"
                    component="span"
                  >
                    <IntlMessages id="partnerSettings.chooseNewImage" />
                  </Button>
                </UserHasPermission>
              </label>
            </Card>

            <div className="w-75 ml-5">
              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.name" />:
                    &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;
                  </label>
                  <Input
                    value={partner.name}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "name",
                    }}
                    onChange={(event) => this.props.setName(event.target.value)}
                  />
                </div>

                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.coc" />:
                    &emsp;&emsp;&emsp;&emsp;&ensp;
                  </label>
                  {partner.coc === null && !this.state.isCocEmpty ? (
                    <Input
                      value={partner.coc}
                      className="w-50 mb-3 ml-4"
                      inputProps={{
                        "aria-label": "coc",
                      }}
                      onChange={(event) =>
                        this.props.setCoc(event.target.value)
                      }
                    />
                  ) : (
                    <Input
                      value={partner.coc}
                      className="w-50 mb-3 ml-4"
                      inputProps={{
                        "aria-label": "coc",
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.street" />:
                    &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;
                  </label>
                  <Input
                    value={partner.street}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "street",
                    }}
                    onChange={(event) =>
                      this.props.setStreet(event.target.value)
                    }
                  />
                </div>

                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.streetNumber" />:
                  </label>
                  <Input
                    value={partner.street_number}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "streetNumber",
                    }}
                    onChange={(event) =>
                      this.props.setStreetNumber(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.city" />:
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;
                  </label>
                  <Input
                    value={partner.city}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "city",
                    }}
                    onChange={(event) => this.props.setCity(event.target.value)}
                  />
                </div>

                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.zipcode" />:
                    &emsp;&emsp;&ensp;
                  </label>
                  <Input
                    value={partner.zip_code}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "zipcode",
                    }}
                    onChange={(event) =>
                      this.props.setZipcode(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="row">
                {partner.old_service_point_id && (
                  <div className="d-flex col-md-6 col-12">
                    <label className="mt-2">
                      <IntlMessages id="partnerSettings.oldServicePointId" />:
                    </label>
                    <Input
                      value={partner.old_service_point_id}
                      className="w-50 mb-3 ml-4"
                      disabled
                      inputProps={{
                        "aria-label": "oldServicePointId",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.website" />
                    :&emsp;&emsp;&emsp;&emsp;&emsp;
                  </label>
                  <Input
                    placeholder=""
                    className="w-50 mb-3 ml-4"
                    value={partner.website && partner.website}
                    onChange={(event) =>
                      this.props.setWebsite(event.target.value)
                    }
                  />
                </div>
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.contactname" />:
                  </label>
                  <Input
                    value={partner.contact_person && partner.contact_person}
                    className="w-50 mb-3 ml-4"
                    inputProps={{
                      "aria-label": "contactname",
                    }}
                    onChange={(event) =>
                      this.props.setContact(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.phone" />:
                    &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
                  </label>
                  <Input
                    placeholder="Phone"
                    className="w-50 mb-3 ml-4"
                    value={partner.phone}
                    onChange={(event) =>
                      this.props.setPhone(event.target.value)
                    }
                  />
                </div>
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.phoneTwo" />
                    :&emsp;&emsp;&ensp;&nbsp;
                  </label>
                  <Input
                    placeholder="PhoneTwo"
                    className="w-50 mb-3 ml-4"
                    value={partner.phone_2}
                    onChange={(event) =>
                      this.props.setPhoneTwo(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="partnerSettings.email" />
                    :&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                  </label>
                  <Input
                    placeholder="email"
                    className="w-50 mb-3 ml-4"
                    value={partner.email}
                    onChange={(event) =>
                      this.props.setEmail(event.target.value)
                    }
                  />
                </div>
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">
                    <IntlMessages id="company.availableOnWeb" />:
                  </label>
                  <Switch
                    classes={{
                      checked: "text-secondary",
                    }}
                    onChange={() =>
                      this.props.setVisibility(
                        partner.public_visibility === 0 ? 1 : 0
                      )
                    }
                    checked={Boolean(partner.public_visibility)}
                  />
                </div>
              </div>
            </div>
          </CardBody>
          <hr />
          {this.props.partner.recognitions && (
            <>
              {" "}
              <Card
                className="border shadow p-3 mb-5 bg-white rounded col-md-11"
                style={{ marginLeft: "65px" }}
              >
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 font-weight-bold">
                      <IntlMessages id="marker.recognitions" />
                    </h4>
                    <UserHasPermission permission="service-point-create-recognition">
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={this.openCreateRecognitionModal}
                      >
                        <IntlMessages id="companiesTable.newRecognition" />
                      </Button>
                    </UserHasPermission>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <IntlMessages id="sweetAlerts.imageRecognition" />
                        </TableCell>
                        <TableCell>
                          <IntlMessages id="sweetAlerts.nameRecognition" />
                        </TableCell>
                        <TableCell>
                          <IntlMessages id="sweetAlerts.validUntilRecognition" />
                        </TableCell>
                        <TableCell>
                          <IntlMessages id="sweetAlerts.createdAt" />
                        </TableCell>
                        <TableCell>
                          <IntlMessages id="sweetAlerts.action" />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.partner.recognitions.map(
                        (recognition: any) => {
                          return (
                            <TableRow>
                              <TableCell>
                                <Avatar
                                  alt={recognition.name}
                                  src={recognition.image && recognition.image}
                                  className="user-avatar"
                                >
                                  {recognition.name.charAt(0)}
                                </Avatar>
                              </TableCell>
                              <TableCell>{recognition.name}</TableCell>
                              <TableCell>
                                {recognition.pivot?.valid_until
                                  ? readableDateTimeLocale(
                                      recognition.pivot.valid_until,
                                      localDateTimeFormat
                                    )
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {recognition.created_at
                                  ? readableDateTimeLocale(
                                      recognition.created_at,
                                      localDateTimeFormat
                                    )
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <UserHasPermission permission="service-point-delete-recognition">
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() =>
                                      this.setRecognitions(recognition.pivot.id)
                                    }
                                  >
                                    <IntlMessages id="callQueueListEdit.delete" />
                                  </Button>
                                </UserHasPermission>{" "}
                                <UserHasPermission permission="service-point-update-recognition">
                                  <Button
                                    onClick={() =>
                                      this.editRecognitions(recognition)
                                    }
                                    variant="outlined"
                                    color="primary"
                                  >
                                    <IntlMessages id="callQueueListEdit.edit" />
                                  </Button>
                                </UserHasPermission>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </>
          )}
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
                      value={partner.description}
                      onChange={(event) =>
                        this.props.setDescription(event.target.value)
                      }
                      margin="normal"
                      fullWidth
                    />
                  </div>
                </div>
              </CardBody>

              <div className="w-100 ml-4">
                {/* <h3>
                    <IntlMessages id="partnerSettings.commandsToAccept" />
                  </h3>

                  <div className="col-12">
                    <List>
                      {lists.map((item) => (
                        <ListItem
                          button
                          key={item.id}
                          onClick={(event) => this.handleToggle(event, item.id)}
                        >
                          <Checkbox
                            color="primary"
                            checked={this.state.checked.indexOf(item.id) !== -1}
                            tabIndex={`-1` as any}
                          />

                          <ListItemText primary={item.name} />
                          <ListItemSecondaryAction>
                            <IconButton>
                              <i
                                className={`zmdi zmdi-${item.icon} text-${item.color}`}
                              />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </div> */}
                <div className="col-12 pt-3 pb-3 ml-5">
                  <form className="row" autoComplete="off">
                    <FormControl className="w-75 mb-2">
                      <InputLabel>Select Company type</InputLabel>
                      <Select
                        value={`${partner.service_point_type_id}`}
                        onChange={(event) =>
                          this.props.setServicePointTypeId(event.target.value)
                        }
                        // input={<Input id="ageSimple1"/>}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {categories.map((type) => {
                          if (
                            selectedDepartment &&
                            type.department === selectedDepartment.slug
                          )
                            return (
                              <MenuItem value={type.id}>{type.name}</MenuItem>
                            );
                        })}
                      </Select>
                    </FormControl>
                  
                  </form>
                </div>

                <div className="col-12 pt-3 pb-3 ml-5">
                  <form className="row" autoComplete="off">
                    <FormControl className="w-75 mb-2">
                      <InputLabel>Select Radius</InputLabel>
                      <Select
                      // value={this.state.age}
                      // onChange={this.handleChange('age')}
                      // input={<Input id="ageSimple1"/>}
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
            </div>

            <CardBody className="col-md-6">
              {partner && partner.opening_hours && this.props.partner.id ? (
                <UserHasPermission permission="update-servicepoint-hours">
                  <OperatingHoursTable
                    id={this.props.partner.id}
                    openingHours={partner.opening_hours}
                  />
                </UserHasPermission>
              ) : (
                ""
              )}
            </CardBody>
          </div>
          <div className="clearfix paddingTen">
            <Fab
              className="float-right"
              color="primary"
              aria-label="add"
              onClick={this.updateCompanyDetails}
            >
              <SaveIcon />
            </Fab>
          </div>
        </Card>

        <Modal
          style={{ maxWidth: "500px" }}
          isOpen={this.state.showRecognitionPopup}
        >
          <ModalHeader>
            <Col sm={{ size: 11 }}>
              <IntlMessages id="companiesTable.createA" />
              <IntlMessages id="companiesTable.newRecognition" />
            </Col>
            <Col sm={{ size: 1 }}>
              <IconButton
                onClick={() =>
                  this.setState({ ...this.state, showRecognitionPopup: false })
                }
              >
                <CancelIcon />
              </IconButton>
            </Col>
          </ModalHeader>
          <ModalBody>
            <FormControl className="w-100">
              <InputLabel>
                <IntlMessages id="companiesTable.selectRecognition" />
              </InputLabel>
              <Select
                disabled={this.state.popUpMsg === "update"}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.recognitionId}
                onChange={(e: any) =>
                  this.setState({ recognitionId: e.target.value })
                }
              >
                <MenuItem value={9999}>None</MenuItem>
                {this.state.points.map((data) => (
                  <MenuItem value={data.id}>{data.name}</MenuItem>
                ))}
              </Select>
              {this.state.showExpiryDate && (
                <DatePicker
                  className="mt-3"
                  format="YYYY-MM-DD"
                  value={this.state.expiryDate}
                  minDate={tomorrow}
                  label={<IntlMessages id="subscription.PeriodEnd" />}
                  animateYearScrolling={false}
                  leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                  rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
                  onChange={(date: any) =>
                    this.setState({ expiryDate: date._d })
                  }
                />
              )}
              <FormControlLabel
                className="justify-content-end ml-0 mt-5"
                control={
                  <Switch
                    color="primary"
                    onChange={() => {
                      this.setState({
                        showExpiryDate: !this.state.showExpiryDate,
                      });
                    }}
                    checked={this.state.showExpiryDate}
                  />
                }
                label="Add Expiry"
                labelPlacement="start"
              />
              <div className="mt-2">
                <Button
                  variant="outlined"
                  className="mr-3"
                  onClick={() =>
                    this.setState({
                      ...this.state,
                      showRecognitionPopup: false,
                      recognitionId: 9999,
                      showExpiryDate: false,
                    })
                  }
                >
                  <IntlMessages id="partnerOrderSweetAlerts.cancelButton" />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.recognitionId === 9999}
                  onClick={this.createRecognition}
                >
                  {this.state.popUpMsg === "update" ? (
                    <IntlMessages id="orderDetailViewTable.update" />
                  ) : (
                    <IntlMessages id="subscription.create" />
                  )}
                </Button>
              </div>
            </FormControl>
          </ModalBody>
        </Modal>

        <AlertPopUp
          show={this.state.imageAlert}
          warning={this.state.imageAlertType === "warning"}
          success={this.state.imageAlertType === "success"}
          title={this.state.imageAlertMsg}
          onConfirm={() => this.setState({ ...this.state, imageAlert: false })}
        />

        <AlertPopUp
          show={showPopUpValue}
          // message={popUpMsg}
          title={this.handleTitle()}
          success={popUpType === "success"}
          warning={popUpType === "warning"}
          danger={popUpType === "danger"}
          disabled={popUpType === "loading"}
          showCancel={popUpType === "warning"}
          confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
          onConfirm={this.handleOnConfirmButton}
          onCancel={this.handleOnCancelButton}
        />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getPartnerSettingDetails: (history, id: string | null) =>
      dispatch(getPartnerSettingDetails(history, id)),
    uploadImage: (
      id: string,
      uploadImage: File,
      isPartners: boolean,
      callBack: (type: string, response: string) => void
    ) => dispatch(updatePartnerAvatar(id, uploadImage, isPartners, callBack)),
    updatePartnerDetails: (id: string, payload: object, isPartners: boolean) =>
      dispatch(updatePartnerDetails(id, payload, isPartners)),
    resetLoadingError: () => dispatch(resetLoadingError()),
    setPhone: (phone: string) => dispatch(setPhone(phone)),
    setPhoneTwo: (phoneNumberTwo: string) =>
      dispatch(setPhoneTwo(phoneNumberTwo)),
    setEmail: (email: string) => dispatch(setEmail(email)),
    setWebsite: (website: string) => dispatch(setWebsite(website)),
    setDescription: (description: string) =>
      dispatch(setDescription(description)),
    setCoc: (coc: string) => dispatch(setCoc(coc)),
    setVisibility: (visibility: number) => dispatch(setVisibility(visibility)),
    setServicePointTypeId: (id: number) => dispatch(setServicePointTypeId(id)),
    deleteRecognition: (
      servicePoint: string,
      recognitionId: number,
      callBack: (response: string, msg: string) => void
    ) => dispatch(deleteRecognition(servicePoint, recognitionId, callBack)),
    setName: (name: string) => dispatch(setName(name)),
    setStreet: (street: string) => dispatch(setStreet(street)),
    setCity: (city: string) => dispatch(setCity(city)),
    setStreetNumber: (streetNumber: string) =>
      dispatch(setStreetNumber(streetNumber)),
    setContact: (contactNumber: string) => dispatch(setContact(contactNumber)),
    setZipcode: (zipcode: string) => dispatch(setZipcode(zipcode)),
    getServiceCategories: () => dispatch(getServiceCategories()),
    updateRecognition: (
      servicePointId: string,
      recognitionId: number,
      data: { valid_until: string },
      callBack: (response: string, msg: string) => void
    ) =>
      dispatch(
        updateRecognition(servicePointId, recognitionId, data, callBack)
      ),
    createRecognition: (
      servicePointId: string,
      recognitionId: number,
      data: { valid_until: string },
      callBack: (response: string, msg: string) => void
    ) =>
      dispatch(
        createRecognition(servicePointId, recognitionId, data, callBack)
      ),
    fetchPoints: (callBack: (response: string, msg: string) => void) =>
      dispatch(fetchPoints(callBack)),
  };
};

const mapStateToProps = (state: IRootPartnerSettingState) => {
  return {
    partner: state.partnerSettingState.servicePointDetails,
    partnerLoading: state.partnerSettingState.loading,
    partnerError: state.partnerSettingState.error,
    categories: state.servicesState.categories,
    lineOne: state.partnerSettingState.addressLineOne,
    lineThree: state.partnerSettingState.addressLineThree,
    selectedDepartment: state.department.selectedDepartment,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CompaniesEdit));
