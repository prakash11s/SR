import React, { Component } from 'react';
import { Card, CardBody, Col, Modal, ModalHeader, Row, Spinner } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import SaveIcon from "@material-ui/icons/Save";


import ContainerHeader from '../ContainerHeader';
import IntlMessages from 'util/IntlMessages';
import {
  getPartnerSettingDetails,
  updatePartnerDetails,
  setPhone,
  setEmail,
  setPhoneTwo,
  setWebsite,
  setDescription,
  updatePartnerAvatar,
  setCoc, resetLoadingError
} from "../../actions/Actions/PartnerSettingActions";
import { IPartnerSettingsOverviewProps, IPartnerSettingsOverviewState, IRootPartnerSettingState } from './Interface/IndexInterface';
import OperatingHoursTable from '../Companies/OperatingHoursTable';
import CloseIcon from '@material-ui/icons/Close';
import { Fab } from '@material-ui/core';
import AlertPopUp from 'common/AlertPopUp';

import axios from '../../util/Api';
import { AxiosRequestConfig } from "axios";

class PartnerSettingsOverview extends Component<IPartnerSettingsOverviewProps, IPartnerSettingsOverviewState> {
  state: IPartnerSettingsOverviewState = {
    checked: [0],
    Image: "",
    imageLoading: false,
    imageAlert: false,
    imageAlertMsg: "",
    imageAlertType: "",
    isStripeBtnShow: false,   
    isStripeSuccess: false
  };

  componentDidMount() {
    const id = localStorage.getItem("servicepoint");
    this.props.getPartnerSettingDetails(this.props.history);

    const search = window.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const retryStripeQuery = params.get('retry-stripe-integration');
    const stripeQuery = params.get('stripe-integration');
    if (retryStripeQuery) {
      this.connectToStripe();
    }

    if (stripeQuery) {
      this.setState({
        isStripeSuccess: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.partner?.connections !== prevProps.partner?.connections) {
     this.checkConnection(this.props.partner);
    }
  }

  handleToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, value: number) => {
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
      partner.description
    ) {
      const payload: any = {};
      payload.phone = partner.phone ? partner.phone : "";
      payload.phone_2 = partner.phone_2 ? partner.phone_2 : "";
      payload.email = partner.email ? partner.email : "";
      payload.coc = partner.coc ? partner.coc : "";
      payload.description = partner.description ? partner.description : "";
      payload.website = partner.website ? partner.website : "";
      this.props.updatePartnerDetails(partner.id, payload, true);
    }
  };

  renderModal = () => {
    return (
      <Modal isOpen={this.props.partnerLoading}>
        <ModalHeader>
          <Col sm={{ size: 11 }}>
            {!this.props.partnerError && <h2>Updating..</h2>}
            {this.props.partnerError && <h2>{this.props.partnerError}</h2>}
          </Col>
          <Col sm={{ size: 1 }}>
            {this.props.partnerError &&
              <IconButton onClick={this.props.resetLoadingError}>
                <CloseIcon />
              </IconButton>}
          </Col>
        </ModalHeader>
      </Modal>
    )
  };

  handleChange = (event) => {
    const uploadImage = URL.createObjectURL(event.target.files[0]);
    this.props.uploadImage(
      this.props.partner.id,
      event.target.files[0],
      true,
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

  checkConnection = (partnerObj) => {
    const checkVal = partnerObj?.connections?.find(el =>  el.activated === true ) == undefined;
    this.setState({
      isStripeBtnShow: checkVal,
    });
  }

  connectToStripe = () => {
    const payload = {
      return_url: `${window.location.href}?stripe-integration=true`,
      refresh_url: `${window.location.href}?retry-stripe-integration=true`
    }
    axios.put('settings/stripe/issue-on-boarding-link', payload)
      .then((response) => {

        if (response && response?.data && response?.data?.data) {
          const redirectStripeURL = response?.data?.data.url;
          window.location.replace(redirectStripeURL);
        }

      }).catch(function (error) {
        console.log('error', error);
      });
  }

  render() {


    const { partner, selectedDepartment } = this.props;
    const { Image, imageLoading, isStripeBtnShow, isStripeSuccess } = this.state;

    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title={<IntlMessages id="partner.settings" />} />
        {this.props.partnerLoading && this.renderModal()}
        <Card className="shadow border-0">
          <h1 className="text-center mt-4"><IntlMessages id="partnerSettings.title" /></h1>
          <h5 className="text-center"><IntlMessages id="partnerSettings.SubTitle" /></h5>
          <CardBody className="d-flex">
            <Card className="shadow border-0 w-15 h-100 mt-5">
              {!imageLoading &&
                selectedDepartment &&
                selectedDepartment.image &&
                selectedDepartment.image.small ? (
                <img
                  alt="Avatar"
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
                <Button
                  variant="contained"
                  className="bg-primary text-white w-100"
                  component="span"
                >
                  <IntlMessages id="partnerSettings.chooseNewImage" />
                </Button>
              </label>
              {/* <Button variant="contained" className="bg-primary text-white w-100"><IntlMessages id="partnerSettings.chooseNewImage" /></Button> */}
            </Card>

            <div className="w-75 ml-5">

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.name" />: &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;</label>
                  <Input
                    value={partner.name}
                    className="w-50 mb-3 ml-4"
                    disabled
                    inputProps={{
                      'aria-label': 'name',
                    }}
                  />
                </div>

                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.coc" />: &emsp;&emsp;&emsp;&emsp;&ensp;</label>
                  {partner.coc === null ?

                    <Input
                      value={partner.coc}
                      className="w-50 mb-3 ml-4"
                      inputProps={{
                        'aria-label': 'coc',
                      }}
                      onChange={(event) => this.props.setCoc(event.target.value)}
                    /> :
                    <Input
                      value={partner.coc}
                      className="w-50 mb-3 ml-4"
                      disabled
                      inputProps={{
                        'aria-label': 'coc',
                      }}
                    />
                  }
                </div>
              </div>

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.street" />: &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;</label>
                  <Input
                    value={partner.street}
                    className="w-50 mb-3 ml-4"
                    disabled
                    inputProps={{
                      'aria-label': 'street',
                    }}
                  />
                </div>

                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.streetNumber" />:</label>
                  <Input
                    value={partner.street_number}
                    className="w-50 mb-3 ml-4"
                    disabled
                    inputProps={{
                      'aria-label': 'streetNumber',
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.city" />: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;</label>
                  <Input
                    value={partner.city}
                    className="w-50 mb-3 ml-4"
                    disabled
                    inputProps={{
                      'aria-label': 'city',
                    }}
                  />
                </div>

                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.zipcode" />: &emsp;&emsp;&ensp;</label>
                  <Input
                    value={partner.zip_code}
                    className="w-50 mb-3 ml-4"
                    disabled
                    inputProps={{
                      'aria-label': 'zipcode',
                    }}
                  />
                </div>
              </div>

              <div className="row">
                {/* Hiding the below field for future use */}
                {/* <div className="d-flex col-md-6 col-12">
                  <label className="mt-2">Deleted At:&emsp;&ensp;&nbsp;</label>
                  <Input
                    value={partner.deleted_at && FormatedDate(partner.deleted_at)}
                    className="w-50 mb-3 ml-4"
                    disabled
                    inputProps={{
                      'aria-label': 'deletedAt',
                    }}
                  />
                </div> */}

                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.website" />:&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;</label>
                  <Input
                    placeholder=""
                    className="w-50 mb-3 ml-4"
                    value={partner.website && partner.website}
                    onChange={(event) => this.props.setWebsite(event.target.value)}
                  />
                </div>
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.email" />:&emsp;&emsp;&emsp;&emsp;</label>
                  <Input
                    placeholder="email"
                    className="w-50 mb-3 ml-4"
                    value={partner.email}
                    onChange={(event) => this.props.setEmail(event.target.value)}
                  />
                </div>

              </div>

              <div className="row">
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.phone" />: &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;</label>
                  <Input
                    placeholder="Phone"
                    className="w-50 mb-3 ml-4"
                    value={partner.phone}
                    onChange={(event) => this.props.setPhone(event.target.value)}
                  />
                </div>
                <div className="d-flex col-md-6 col-12">
                  <label className="mt-2"><IntlMessages id="partnerSettings.phoneTwo" />:&emsp;&emsp;&ensp;&nbsp;</label>
                  <Input
                    placeholder="PhoneTwo"
                    className="w-50 mb-3 ml-4"
                    value={partner.phone_2}
                    onChange={(event) => this.props.setPhoneTwo(event.target.value)}
                  />
                </div>
              </div>



              {(partner?.connections?.length == 0 || isStripeBtnShow) && (
                <div className="row">

                  <div className="d-flex col-md-12 col-12 justify-content-end mt-5">
                    <button className="btn btn-primary pull-right" onClick={this.connectToStripe}>
                      <IntlMessages id="connectStripe" />
                    </button>
                  </div>
                </div>
              )}


            </div>
          </CardBody>
          <hr></hr>

          <div className="row mb-3 mt-4">

            <div className='col-md-6'>
              <CardBody className="d-flex">
                <div className="w-100 ml-4">
                  <h3><IntlMessages id="partnerSettings.companyDescription" /></h3>

                  <div className="col-12 border">
                    <TextField
                      id="multiline-flexible"
                      multiline
                      rows="5"
                      value={partner.description}
                      onChange={(event) => this.props.setDescription(event.target.value)}
                      margin="normal"
                      fullWidth
                    />
                  </div>
                </div>
              </CardBody>
            </div>

            <CardBody className='col-md-6'>
              {partner.opening_hours ? (<OperatingHoursTable id={this.props.partner.id} openingHours={partner.opening_hours} isPartners />) : ''}
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
        <AlertPopUp
          show={this.state.imageAlert}
          warning={this.state.imageAlertType === "warning"}
          success={this.state.imageAlertType === "success"}
          title={this.state.imageAlertMsg}
          onConfirm={() => this.setState({ ...this.state, imageAlert: false })}
        />
        <AlertPopUp
          show={isStripeSuccess}
          success
          title={<IntlMessages id="stripeSUccessMssg" />}
          onConfirm={() => this.setState({ ...this.state, isStripeSuccess: false })}
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getPartnerSettingDetails: (history) => dispatch(getPartnerSettingDetails(history)),
    updatePartnerDetails: (id: string, payload: object, isPartners: boolean) =>
      dispatch(updatePartnerDetails(id, payload, isPartners)),
    resetLoadingError: () => dispatch(resetLoadingError()),
    uploadImage: (
      id: string,
      uploadImage: File,
      isPartners: boolean,
      callBack: (type: string, response: string) => void
    ) => dispatch(updatePartnerAvatar(id, uploadImage, isPartners, callBack)),
    setPhone: (phone: string) => dispatch(setPhone(phone)),
    setPhoneTwo: (phoneNumberTwo: string) => dispatch(setPhoneTwo(phoneNumberTwo)),
    setEmail: (email: string) => dispatch(setEmail(email)),
    setWebsite: (website: string) => dispatch(setWebsite(website)),
    setDescription: (description: string) => dispatch(setDescription(description)),
    setCoc: (coc: string) => dispatch(setCoc(coc))
  }
};

const mapStateToProps = (state: IRootPartnerSettingState) => {
  return {
    partner: state.partnerSettingState.servicePointDetails,
    partnerLoading: state.partnerSettingState.loading,
    partnerError: state.partnerSettingState.error,
    lineOne: state.partnerSettingState.addressLineOne,
    lineThree: state.partnerSettingState.addressLineThree,
    selectedDepartment: state.department.selectedDepartment,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PartnerSettingsOverview);
