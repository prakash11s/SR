import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../util/Api";
import {
  readableDate,
  readableDateTimeLocale,
} from "../../util/helper";
import { IIndexInterface } from "./Interface/IndexInterface";
import IntlMessages from "../../util/IntlMessages";
import { useParams } from "react-router";
import { useIntl } from 'react-intl'
import { Card, CardBody, CardText, Spinner } from "reactstrap";
import { Badge, Col, Row } from "reactstrap";
import { Grid, Button } from "@material-ui/core";
import CallQueueOverviewTable from "components/Customers/callRecordings";
import EmailsList from "components/Customers/emailList";
import FeedBackList from "components/Customers/feedbacks";
import OrderList from "components/Customers/OrderList";
import LoginList from "./loginList";
import PermissionsList from "./permissionsList";
import SweetAlert from "react-bootstrap-sweetalert";
import OrderTable from "components/OrderTable/index";
import Loader from "../../containers/Loader/Loader";
import AlertPopUp from "../../common/AlertPopUp";
import SipCallService from "../../components/Phone/SipCallService";
import Error404 from "../../components/Error404";
import Error403 from "components/Error403";

const CustomerDetail: React.FC<IIndexInterface> = (props) => {
 
  let { uuid } = useParams<any>();
  
  const intl = useIntl();

  const callState = useSelector((state: any) => state.softPhone.Call);

  const [customerDetail, setCustomerDetail] = React.useState<any>(undefined);
  const [orders, setOrders] = React.useState<any>([]);
  const [callName, setCallName] = React.useState<string>("");
  const [callNumber, setCallNumber] = React.useState<string>("");
  const [callAlert, setCallAlert] = React.useState<boolean>(false);
  const [callImage, setCallImage] = React.useState<any>(null);



  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errMessage, setErrMessage] = React.useState<any>(undefined);
  const [banConfirm, setBanConfirm] = React.useState<boolean>(false);
  const [successPopup, setSuccessPopup] = React.useState<boolean>(false);
  const [errorPopup, setErrorPopup] = React.useState<boolean>(false);

  const localDateTimeFormat = intl.formatMessage({
    id: "localeDateTime",
    defaultMessage: "DD-MM-YYYY hh:mm:ss",
  });


  const onInit = async (custId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/customers/${custId}`);
  
      const responseOrders = await axios.get(`customers/${custId}/orders`);
      const orderList = responseOrders.data.data.map(el => { return {...el, orderId: el.id} });
      setOrders(orderList)
      setCustomerDetail(response.data);
    } catch (error) {   
      setErrMessage(error.response.status);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onInit(uuid);
  }, []);

  const callPhone = () => {
    setCallAlert(false);
    SipCallService.startCall(callNumber, callName, callImage);
  };

  const customerCall = () => {
    if (!callState.showOngoingCallPad) {
      setCallName(customerDetail.name);
      setCallNumber(customerDetail.phone);
      setCallAlert(true);
    }
  };

  const handleBanCustomer = async (customerId) => {
    try {
      await axios.delete(`/customers/${customerId}`);
      setBanConfirm(false);
      setSuccessPopup(true);
    } catch (error) {
      setBanConfirm(false);
      setErrorPopup(true);
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader/>
  }

  if (errMessage) {
    return  errMessage == 404 ? <Error404/> : <Error403/>
  }

  return (
    <>
      <div className="app-wrapper">
        <div className="jr-card p-0">
          <div className="jr-card-1header card-img-top mb-0 p-4 bg-#3f51b5 lighten-4 d-flex justify-content-between">
            <h3 className="card-heading">
              <b><IntlMessages id="partnerEmployee.name"/> :{" "}</b>
              {customerDetail?.first_name} {customerDetail?.last_name}
            </h3>
          </div>

          <div className="card-body">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h5>
                  <b> <IntlMessages id="callQueueListEdit.id"/> :{" "}</b>
                  <span>
                    {customerDetail?.id}
                  </span>
                </h5>
                <h5>
                  <b> <IntlMessages id="sender.phone"/> :{" "}</b>
                  <span onClick={customerCall} className="underlineElement">
                    {customerDetail?.phone}
                  </span>
                </h5>
                <h5>
                  <b> <IntlMessages id="partnerSettings.email"/> :{" "} </b> {customerDetail?.email}
                </h5>
                <h5>
                  <b><IntlMessages id="employeeAccountOverview.salutation"/> :{" "}</b> {customerDetail?.salutation || 'NA'}
                </h5>
                <h5>
                  <b><IntlMessages id="customer.gender"/> :{" "} </b> {customerDetail?.gender || 'NA'}
                </h5>
                <h5>
                  <b> <IntlMessages id="companiesTable.address"/> :{" "}</b>
                  {customerDetail &&
                    `${customerDetail?.street || ''} ${customerDetail?.street_number || ''} ${customerDetail?.zip_code || ''} ${customerDetail?.city || ''}`}
                </h5>
                <h5>
                  <b>
                    <IntlMessages id="sender.street_number"/> :{" "}
                  </b>{" "}
                  {customerDetail?.street_number}
                </h5>
                <Row xs="2">
                  <Col>
                    <h5>
                      <b>
                        <IntlMessages id="order.created-at"/>:
                      </b>
                      {customerDetail?.created_at
                        ? readableDateTimeLocale(
                          customerDetail?.created_at,
                          localDateTimeFormat
                        )
                        : "-"}
                    </h5>
                  </Col>
                  <Col>
                    <h5>
                      <b>
                        <IntlMessages id="order.updated-at"/>:
                      </b>
                      {customerDetail?.updated_at
                        ? readableDateTimeLocale(
                          customerDetail?.updated_at,
                          localDateTimeFormat
                        )
                        : "-"}
                    </h5>
                  </Col>
                  {customerDetail?.deleted_at && (
                    <Col>
                      <h5>
                        <b>Delete date:</b>
                        {customerDetail?.deleted_at
                          ? readableDateTimeLocale(
                            customerDetail?.deleted_at,
                            localDateTimeFormat
                          )
                          : "-"}
                      </h5>
                    </Col>
                  )}
                </Row>
                <Button
                  variant="contained"
                  color="primary"
                  className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
                  onClick={() => setBanConfirm(true)}
                >
                  <IntlMessages id="customer.ban"/>
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>

        {/* Login list */}

        {(customerDetail && customerDetail?.logins) && <LoginList list={customerDetail?.logins}/>}
        {/* Login list */}

        {/* Permission List */}
        {(customerDetail && customerDetail?.permissions) && <PermissionsList list={customerDetail?.permissions}/>}
        {/* Permission List */}

        {/* Order List  */}
        <div className="d-flex justify-content-between">
          <h3 className="mt-2">
            <IntlMessages id="breadCrumbBar.ordersList"/>
          </h3>
        </div>
        <Card className={`shadow border-0 `} id="order-table">
          <CardBody>
            <CardText>
              <OrderTable
                dataList={orders}
                openSearchServiceModal={true}
                menuState={true}
                handleRequestClose={(id) => console.log(id)}
                deleteOrder={(id) => console.log(id)}
                className="tableFixHead"
              />
            </CardText>
          </CardBody>
        </Card>

        {/*  Order List  */}

        {/* Email list */}
        {uuid && <EmailsList id={uuid}/>}
        {/* Email list */}

        {/* Call recording  */}
        {uuid && <CallQueueOverviewTable id={uuid}/>}
        {/* Call recording  */}

        {/* FeedBack List  */}
        {uuid && <FeedBackList id={uuid} />}
        {/*  FeedBack List  */}

        {banConfirm && (
          <SweetAlert
            show={banConfirm}
            warning
            showCancel
            confirmBtnText="Yes"
            cancelBtnText="cancel"
            cancelBtnBsStyle="default"
            confirmBtnBsStyle="danger"
            onConfirm={() => handleBanCustomer(uuid)}
            onCancel={() => setBanConfirm(false)}
            title="Proceed ban"
          >
            Do you want to ban this customer ?
          </SweetAlert>
        )}
        {errorPopup && (
          <SweetAlert
            show={errorPopup}
            warning
            confirmBtnBsStyle="danger"
            confirmBtnText="Okay"
            onConfirm={() => setErrorPopup(false)}
            title="Error"
          >
            Something went wrong !
          </SweetAlert>
        )}

        {successPopup && (
          <SweetAlert
            show={successPopup}
            success
            confirmBtnText="Great"
            onConfirm={() => setSuccessPopup(false)}
            title="Success"
          >
            Customer has been banned
          </SweetAlert>
        )}

        <AlertPopUp
          show={callAlert}
          title={<IntlMessages id={"sipCallMakeCall"} />}
          warning={true}
          showCancel={true}
          onCancel={() => setCallAlert(false)}
          onConfirm={callPhone}
        />
      </div>
    </>
  );
};

export default CustomerDetail;
