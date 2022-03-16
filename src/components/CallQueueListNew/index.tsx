import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { useParams } from "react-router";
import Loader from "containers/Loader/Loader";
import { formatPrice, readableDate, readableDateTimeLocale } from "util/helper";
import {
  getCallQueueList,
  getStatusCodes,
  callQueueAction,
  resumeCallQueue,
  makeIndividualCallFromQueue,
  setCallQueueStatus,
  goToNextCallInQueue,
} from "actions/Actions/callQueueListActionsNew";
import CardComponent from "components/CardComponent";
import CommentPopUp from "../CallQueueCommentPopup";
import AcceptPopUp from "../CallQueueAcceptPopUp";
import IntlMessages from "util/IntlMessages";
import "./style.scss";
import AlertPopUp from "common/AlertPopUp";
import Moment from "react-moment";
import { TIME_SCHEDULES } from "constants/common.constants";
import moment from "moment";
import { useIntl } from "react-intl";
import CountDownTimer from "components/CallQueueList/CountDownTimer";
import { DatePicker } from "material-ui-pickers";
import UnsubscribeModal from "./UnsubscribeModal";

declare const window: any;
const CallQueueListNew = () => {
  const dispatch = useDispatch();
  const datepickerRef = useRef<any>();
  let { id } = useParams<any>();
  const intl = useIntl();
  const callQueueStatus = useSelector(
    (state: any) => state.callQueueState.callQueueStatus
  );
  const callQueueTimer = useSelector(
    (state: any) => state.callQueueState.showTimer
  );

  const [showCommentPopUp, setShowCommentPopUp] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPopUpValue, setShowPopUpValue] = useState(false);
  const [callQueueUpdated, setCallQueueUpdated] = useState(false);
  const [acceptPopup, setAcceptPopup] = useState(false);
  const [unsubscribePopup, setUnsubscribePopup] = useState(false);
  const [updatedData, setUpdatedData] = useState<any>({});
  const [selectedButton, setSelectedButton] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState("");
  const [popUpType, setPopUpType] = useState("");
  const [price, setPrice] = useState("");
  const [popUpMsg, setPopUpMsg] = useState("");
  const [modalType, setModalType] = useState("");
  const [entryId, setEntryId] = useState("");
  const [buttonsList, setButtonsList] = useState<any>([]);
  const [buttonsListLoading, setButtonsListLoading] = useState<boolean>(true);
  const [callQueueData, setCallQueueData] = useState<any>(null);
  const [time, setTime] = useState<any>(
    new Date(
      moment()
        .add(1, "days")
        .format()
    ).toISOString()
  );
  const [scheduleType, setScheduleType] = useState(TIME_SCHEDULES.TOMORROW);
  const [customTime, setCustomTime] = useState<any>(moment().add(1, "d"));

  const getTotal = (services) => {
    let total = 0;
    services.forEach((previousValue) => (total += previousValue.price));
    return total;
  };

  useEffect(() => {
    if (id) {
      fetchCallQueueList(id);
    }
  }, [id]);

  const dateTimeCell = (datetime) => {
    const localDateTimeFormat = intl.formatMessage({
      id: "localeDate",
      defaultMessage: "DD-MM-YYYY",
    });
    const formattedOrderDate =
      datetime && readableDateTimeLocale(datetime, localDateTimeFormat);
    return formattedOrderDate;
  };

  const expireDate = (expireDate) => {
    const date = moment();

    let days = moment(expireDate).diff(moment(date), "days");

    if (days < 0) {
      return <div className="pl-1">{dateTimeCell(expireDate)}</div>;
    } else {
      return (
        <div className="text-danger pl-1">{`${dateTimeCell(expireDate)} (${
          days == 0
            ? intl.formatMessage({ id: "callQueue.LastDay" })
            : moment
                .duration(days, "days")
                .humanize()
                .split(" ")[0] +
              " " +
              intl.formatMessage({ id: "callQueue.remaining" })
        })`}</div>
      );
    }
  };

  const fetchCallQueueList = (id) => {
    dispatch(
      getCallQueueList(id, (status, res) => {
        if (status) {
          setCallQueueData(res.data.length ? res.data[0] : {});
          if (callQueueStatus) {
            dispatch(goToNextCallInQueue(true));
          }
        } else {
          setError(res);
        }
      })
    );
  };

  useEffect(() => {
    if (callQueueData && callQueueData.id) {
      window.Echo.private(`call-queues.entries.${callQueueData.id}`).listen(
        ".call-queue-service.entry.status.updated",
        (response) => {
          setUpdatedData(response);
          setCallQueueUpdated(true);
        }
      );
    }
  }, [callQueueData]);

  useEffect(() => {
    if (modalType) {
      setButtonsListLoading(true);
      dispatch(
        getStatusCodes(
          { reason: modalType, entryType: callQueueData.type },
          (status, response) => {
            if (status) {
              setButtonsList(response.data);
            }
            setButtonsListLoading(false);
          }
        )
      );
    }
  }, [modalType]);

  const hideCommentPopUp = (id) => {
    setShowCommentPopUp(false);
  };

  const displayCommentPopUp = (id, comments) => {
    setShowCommentPopUp(true);
    setCommentsToShow(comments);
    setEntryId(id);
  };

  const handleOnConfirmButton = () => {
    if (popUpType === "warning") {
      setPopUpType("loading");
      setShowPopUpValue(true);
      let payload: any = {
        action: modalType,
        status_reason_id: selectedButton.id,
      };
      if (modalType === "reschedule") {
        payload.timestamp =
          scheduleType === "custom" ? new Date(customTime).toISOString() : time;
      }
      if (acceptPopup) {
        payload = {
          action: "enter_order_price",
          price: parseInt(price) * 100,
        };
      }
      if (unsubscribePopup && vehicle) {
        payload.license_plate = vehicle.plate;
      }
      dispatch(
        callQueueAction(
          callQueueData.call_queue_id,
          callQueueData.id,
          payload,
          (status, res) => {
            if (status) {
              setPopUpType("success");
            } else {
              setPopUpType("danger");
              setPopUpMsg(res);
            }
          }
        )
      );
    } else {
      setPopUpMsg("");
      setPopUpType("");
      setShowPopUpValue(false);
      setShowModal(false);
      setAcceptPopup(false);
      setUnsubscribePopup(false);
      fetchCallQueueList(id);
    }
  };

  const onClickAction = (buttonData) => {
    setSelectedButton(buttonData);
    setPopUpType("warning");
    setShowPopUpValue(true);
  };

  const handleOnCancelButton = () => {
    setShowPopUpValue(false);
    setSelectedButton(null);
    setPopUpType("");
    setPopUpMsg("");
  };

  const toggleModal = (type = "") => {
    setShowModal(!showModal);
    setModalType(type);
  };

  const handleTitle = () => {
    const title = "moveToOnHold";
    const alertType =
      popUpType === "warning"
        ? "Warning"
        : popUpType === "success"
        ? "Success"
        : popUpType === "danger"
        ? "Fail"
        : "Loading";
    const alertId = "sweetAlerts.".concat(title).concat(alertType);
    return <IntlMessages id={alertId} />;
  };

  const setTimestamp = (scheduleType) => {
    if (scheduleType === "custom") {
      setScheduleType(scheduleType);
      return;
    }
    let time;
    if (scheduleType === TIME_SCHEDULES.TOMORROW) {
      time = moment()
        .add(1, "days")
        .format();
    } else if (scheduleType === TIME_SCHEDULES.TWO_DAYS) {
      time = moment()
        .add(2, "days")
        .format();
    } else if (scheduleType === TIME_SCHEDULES.WEEK) {
      time = moment()
        .add(7, "days")
        .format();
    }

    const convertedTime = new Date(time).toISOString();
    setTime(convertedTime);
    setScheduleType(scheduleType);
  };

  const getClassName = () => {
    const expiryDate = callQueueData.metadata.mandatory_service_expiry_date;
    if (expiryDate) {
      const currentDate = moment().format("YYYY-MM-DD");
      const oneMonthTime = moment(currentDate)
        .add(1, "month")
        .format("YYYY-MM-DD");
      const twoMonthTime = moment(currentDate)
        .add(2, "month")
        .format("YYYY-MM-DD");
      if (moment(expiryDate).isBetween(currentDate, oneMonthTime))
        return "text-danger";
      if (moment(expiryDate).isBetween(currentDate, twoMonthTime))
        return "text-warning";
    }
  };

  const playPauseButton = (
    <div className="d-flex align-items-center">
      {callQueueStatus && (
        <div
          className="btn-round d-flex align-items-center justify-content-center CallQueueList-pause-btn"
          onClick={() => dispatch(setCallQueueStatus(false))}
        >
          <svg
            height="40px"
            width="40px"
            className="MuiSvgIcon-root"
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="presentation"
          >
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
          </svg>
        </div>
      )}
      {!callQueueStatus && (
        <div
          className="btn-round d-flex align-items-center justify-content-center"
          onClick={() => dispatch(resumeCallQueue())}
        >
          <svg
            height="40px"
            width="40px"
            className="MuiSvgIcon-root"
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="presentation"
          >
            <path d="M2 12A10 10 0 0 1 12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12m8 5l5-5l-5-5v10z" />
            <path fill="none" d="M0 0h24v24H0z"></path>
          </svg>
        </div>
      )}
    </div>
  );

  const timer = callQueueTimer && (
    <div className="mr-3 font-size-20">
      <CountDownTimer />
    </div>
  );

  const toggleAcceptPopup = () => {
    setAcceptPopup(!acceptPopup);
  };

  const toggleUnsubscribePopup = () => {
    setUnsubscribePopup(!unsubscribePopup);
  };

  if (callQueueData) {
    if (callQueueData.order || callQueueData.orders) {
      return (
        <>
          <Row>
            <div className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center d-flex w-100">
              {playPauseButton}
              <div className="d-flex align-items-center">
                {timer}
                {callQueueData?.id}
              </div>
            </div>
          </Row>
          <Row>
            <CommentPopUp
              show={showCommentPopUp}
              onConfirm={hideCommentPopUp}
              id={entryId}
              confirmBtnBsStyle="default"
              commentsList={commentsToShow}
              key="comment-popup"
            />
            <AcceptPopUp
              show={acceptPopup}
              toggleAcceptPopup={toggleAcceptPopup}
              price={price}
              setPrice={setPrice}
              onConfirm={onClickAction}
            />
            <UnsubscribeModal
              show={unsubscribePopup}
              toggleAcceptPopup={toggleUnsubscribePopup}
              buttonsList={buttonsList}
              setVehicle={setVehicle}
              vehicle={vehicle}
              selectedButton={selectedButton}
              setSelectedButton={setSelectedButton}
              onConfirm={() => {
                setPopUpType("warning");
                setShowPopUpValue(true);
              }}
            />
            <div className="col-md-6 pl-0 pl-md-0 pr-md-3 pr-0">
              <CardComponent
                header={
                  <>
                    <h3 className="m-0">
                      <IntlMessages id="comments.visibility.customer" />
                    </h3>
                    {callQueueData?.customer?.id && (
                      <a
                        href={`/support/customers/${callQueueData.customer.id}`}
                        target="_blank"
                        className="mr-3"
                      >
                        <Button
                          className="m-0"
                          variant="outlined"
                          color="primary"
                        >
                          <IntlMessages id="companiesTable.openButton" />
                        </Button>
                      </a>
                    )}
                  </>
                }
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <IntlMessages id="order.name" />:{" "}
                    <b>{callQueueData.name}</b> <br />
                    <IntlMessages id="order.email" />:{" "}
                    <b>{callQueueData.email}</b>
                    <br />
                    <IntlMessages id="order.phone" />:{" "}
                    <b
                      onClick={() =>
                        dispatch(makeIndividualCallFromQueue(callQueueData))
                      }
                      className="cursor-pointer"
                    >
                      {callQueueData.phone}
                    </b>
                    {callQueueData.order.execution_date && (
                      <>
                        <br />
                        <IntlMessages id="partnerOrders.executionDate" />:{" "}
                        <b>
                          {readableDate(callQueueData.order.execution_date)}
                        </b>
                      </>
                    )}
                  </div>
                  {callQueueData.customer.avatar && (
                    <img
                      width="70px"
                      height="70px"
                      src={callQueueData.customer.avatar}
                    />
                  )}
                </div>
              </CardComponent>
              {callQueueData.service_point && (
                <CardComponent
                  header={
                    <>
                      <h3 className="m-0">
                        <IntlMessages id="orderDetailViewTable.servicePointName" />
                      </h3>
                      {callQueueData.service_point?.id && (
                        <a
                          href={`/support/companies/${callQueueData.service_point.id}`}
                          target="_blank"
                          className="mr-3"
                        >
                          <Button
                            className="m-0"
                            variant="outlined"
                            color="primary"
                          >
                            <IntlMessages id="companiesTable.openButton" />
                          </Button>
                        </a>
                      )}
                    </>
                  }
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <IntlMessages id="order.name" />:{" "}
                      <b>{callQueueData.service_point.name}</b> <br />
                      <IntlMessages id="cityTitle" />:{" "}
                      <b>{callQueueData.service_point.city}</b> <br />
                      <IntlMessages id="callQueueList.email" />:{" "}
                      <b>{callQueueData.service_point.email}</b>
                    </div>
                    {callQueueData.customer.avatar && (
                      <img
                        width="70px"
                        height="70px"
                        src={callQueueData.customer.avatar}
                      />
                    )}
                  </div>
                </CardComponent>
              )}
              {callQueueData.type === "customer-satisfaction" ? (
                <CardComponent
                  header={
                    <>
                      <h3 className="m-0">
                        <IntlMessages id="vehicle" />
                      </h3>

                      <div>
                        <b>ID: </b>
                        {callQueueData.order.id}
                      </div>
                    </>
                  }
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <b>
                        <IntlMessages id="brand" />
                      </b>
                      : {callQueueData.metadata.brand.name}{" "}
                      {callQueueData.metadata.model.name}
                      <br />
                      <b>
                        <IntlMessages id="vehicle.licencePlate" />
                      </b>
                      : {callQueueData.metadata.formatted_plate}
                      <br />
                      <b>
                        <IntlMessages id="fuel" />
                      </b>
                      : {callQueueData.metadata.fuel.name}
                      <br />
                      {callQueueData.metadata.mandatory_service_expiry_date ? (
                        <>
                          <b>
                            <IntlMessages id="mandatory_service_expiry" />
                          </b>
                          :{" "}
                          <span className={getClassName()}>
                            {dateTimeCell(
                              callQueueData.metadata
                                .mandatory_service_expiry_date
                            )}
                          </span>
                          <br />
                        </>
                      ) : null}
                      <b>
                        <IntlMessages id="vehicleStepperStep1.constructionYear" />
                      </b>
                      : {dateTimeCell(callQueueData.metadata.construction_year)}
                      <br />
                    </div>
                    <img
                      width="100px"
                      height="100px"
                      src={callQueueData.metadata.images["0"].location}
                    />
                  </div>
                </CardComponent>
              ) : null}
              {callQueueData.type === "vehicle-plate-expiry" ? (
                <CardComponent
                  header={
                    <>
                      <h3 className="m-0">
                        <IntlMessages id="vehicle" />
                      </h3>

                      <div>
                        <b>ID: </b>
                        {callQueueData.vehicle.id}
                      </div>
                    </>
                  }
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <b>
                        <IntlMessages id="brand" />
                      </b>
                      : {callQueueData.vehicle.brand}{" "}
                      {callQueueData.vehicle.model}
                      <br />
                      <b>
                        <IntlMessages id="vehicle.licencePlate" />
                      </b>
                      : {callQueueData.vehicle.plate}
                      <br />
                      <b>
                        <IntlMessages id="fuel" />
                      </b>
                      : {callQueueData.vehicle.fuel}
                      <br />
                      {callQueueData.vehicle.mandatory_service_expiry ? (
                        <>
                          <b>
                            <IntlMessages id="mandatory_service_expiry" />
                          </b>
                          :{" "}
                          <span className={getClassName()}>
                            {dateTimeCell(
                              callQueueData.vehicle.mandatory_service_expiry
                            )}
                          </span>
                          <br />
                        </>
                      ) : null}
                      <b>
                        <IntlMessages id="vehicleStepperStep1.constructionYear" />
                      </b>
                      : {dateTimeCell(callQueueData.vehicle.construction_year)}
                      <br />
                    </div>
                    <img
                      width="100px"
                      height="100px"
                      src={callQueueData.vehicle.image}
                    />
                  </div>
                </CardComponent>
              ) : null}
              {callQueueData.type !== "vehicle-plate-expiry" ? (
                <CardComponent
                  header={
                    <h3 className="m-0">
                      <IntlMessages id="servicesTitle" />
                    </h3>
                  }
                  noPadding
                >
                  <Table bordered className="m-0">
                    <thead className="text-center">
                      <tr>
                        <th>
                          <b>
                            <IntlMessages id="servicesTitle" />
                          </b>
                        </th>
                        <th>Aantal / prijs</th>
                        <th>
                          <b>
                            <IntlMessages id="total" />
                          </b>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {callQueueData.order.services &&
                        callQueueData.order.services.map((service, key) => (
                          <tr key={key}>
                            <td>
                              {service.name}{" "}
                              {service.custom_description && (
                                <Tooltip title={service.custom_description}>
                                  <InfoIcon />
                                </Tooltip>
                              )}{" "}
                            </td>
                            <td>
                              {service.amount} x € {formatPrice(service.price)}
                            </td>
                            <td>
                              € {formatPrice(service.amount * service.price)}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td>
                          <b>
                            <IntlMessages id="total" />
                          </b>
                        </td>
                        <td></td>
                        <td>
                          <b>
                            €{" "}
                            {callQueueData.order.services &&
                              formatPrice(
                                getTotal(callQueueData.order.services)
                              )}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardComponent>
              ) : null}
              {callQueueData.type === "quote-request" ? (
                <CardComponent
                  header={
                    <>
                      <h3 className="m-0">
                        <IntlMessages id="callQueueListEdit.order" />
                      </h3>
                      <div>
                        <b>ID: </b>
                        {callQueueData.order.id}
                      </div>
                    </>
                  }
                >
                  <Row>
                    <Col md={6}>
                      <div className="d-flex inline">
                        <b>
                          <IntlMessages id="callQueue.quoteExpiration" />
                        </b>
                        : {expireDate(callQueueData?.order?.quote_expiration)}
                      </div>
                      <br />
                      <div className="d-flex inline">
                        <b>
                          <IntlMessages id="callQueue.quote_extension_max_date" />
                        </b>
                        :{" "}
                        {expireDate(
                          callQueueData?.order?.quote_extension_max_date
                        )}
                      </div>
                      <br />
                      <b>
                        <IntlMessages id="callQueue.quoteRequested" />
                      </b>
                      : {dateTimeCell(callQueueData.order.quote_requested)}
                      <br />
                    </Col>
                    <Col md={6}>
                      <b>
                        <IntlMessages id="brand" />
                      </b>
                      : {callQueueData.metadata.brand.name}{" "}
                      {callQueueData.metadata.model.name}
                      <br />
                      <b>
                        <IntlMessages id="vehicle.licencePlate" />
                      </b>
                      : {callQueueData.metadata.formatted_plate}
                      <br />
                      <b>
                        <IntlMessages id="fuel" />
                      </b>
                      : {callQueueData.metadata.fuel.name}
                      <br />
                      {callQueueData.metadata.mandatory_service_expiry_date ? (
                        <>
                          <b>
                            <IntlMessages id="mandatory_service_expiry" />
                          </b>
                          :{" "}
                          <span className={getClassName()}>
                            {dateTimeCell(
                              callQueueData.metadata
                                .mandatory_service_expiry_date
                            )}
                          </span>
                          <br />
                        </>
                      ) : null}
                      <b>
                        <IntlMessages id="vehicleStepperStep1.constructionYear" />
                      </b>
                      : {dateTimeCell(callQueueData.metadata.construction_year)}
                      <br />
                    </Col>
                  </Row>
                </CardComponent>
              ) : null}
              {callQueueData.type === "vehicle-plate-expiry" ? (
                <CardComponent
                  header={
                    <h3 className="m-0">
                      <IntlMessages id="callQueueListEdit.order" />
                    </h3>
                  }
                  noPadding
                >
                  <Table bordered className="m-0">
                    <thead className="text-center">
                      <tr>
                        <th>
                          <b>ID</b>
                        </th>
                        <th>
                          <b>
                            <IntlMessages id="itemsTitle" />
                          </b>
                        </th>
                        <th>
                          <b>
                            <IntlMessages id="dateTitle" />
                          </b>
                        </th>
                        <th>
                          <b>
                            <IntlMessages id="orderDetailViewTable.servicePointName" />
                          </b>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {callQueueData.orders &&
                        callQueueData.orders.map((order, key) => (
                          <tr key={key}>
                            <td className="align-middle">{order.id}</td>
                            <td className="p-0 align-middle">
                              {order.services &&
                                order.services.map((service, key) => (
                                  <div key={key} className="d-flex">
                                    <div className="single-serviceWrap">
                                      {service.amount} x {service.name}
                                    </div>
                                    <div className="single-serviceWrap">
                                      € {formatPrice(service.price)}
                                      {/* {service.amount} x € {formatPrice(service.price)} */}
                                    </div>
                                  </div>
                                ))}
                            </td>
                            <td className="align-middle">
                              {readableDate(order.execution_date)}
                            </td>
                            <td className="align-middle">
                              {order.service_point.name}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </CardComponent>
              ) : null}
              {callQueueData.type === "vehicle-plate-expiry" ? (
                <CardComponent
                  header={
                    <h3 className="m-0">
                      <IntlMessages id="sidebar.reviews" />
                    </h3>
                  }
                  noPadding
                >
                  <Table bordered className="m-0">
                    <thead className="text-center">
                      <tr>
                        <th>
                          <b>
                            <IntlMessages id="comments.content" />
                          </b>
                        </th>
                        <th>
                          <b>
                            <IntlMessages id="callQueue.rating" />
                          </b>
                        </th>
                        <th>
                          <b>
                            <IntlMessages id="orderDetailViewTable.servicePointName" />
                          </b>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {callQueueData.reviews &&
                        callQueueData.reviews.map((review, key) => (
                          <tr key={key}>
                            <td className="align-middle">{review.content}</td>
                            <td className="align-middle">{review.rating}</td>
                            <td className="align-middle">{review.name}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </CardComponent>
              ) : null}
              {callQueueData.type !== "vehicle-plate-expiry" &&
              callQueueData.order.comments.length ? (
                <CardComponent
                  header={
                    <h3 className="m-0">
                      <IntlMessages id="callQueueListActionButton.comments" />
                    </h3>
                  }
                >
                  {callQueueData.order.comments.map((comment) => (
                    <div>
                      {comment.description}
                      <div className="mt-2" style={{ color: "#0346c2" }}>
                        <Moment fromNow>{comment.created_at}</Moment>
                      </div>
                      <hr />
                    </div>
                  ))}
                </CardComponent>
              ) : null}
              <div className="d-flex mb-5">
                {callQueueData.type === "customer-satisfaction" ? (
                  <Button outline color="success" onClick={toggleAcceptPopup}>
                    <IntlMessages id="partnerOrders.accept" />
                  </Button>
                ) : (
                  <Button
                    outline
                    color="success"
                    onClick={() => {
                      if (callQueueData.type === "vehicle-plate-expiry") {
                        window.location.href = `/support/orders/create/?source=queues&queue_item_id=${callQueueData.id}`;
                      } else {
                        window.location.href = `/support/orders/${callQueueData.order.id}/edit?accept_quote=true&source=queues&queue_id=${callQueueData.call_queue_id}&queue_item_id=${callQueueData.id}`;
                      }
                    }}
                  >
                    <IntlMessages id="partnerOrders.accept" />
                  </Button>
                )}
                <Button
                  outline
                  color="warning"
                  onClick={() => toggleModal("reschedule")}
                >
                  <IntlMessages id="callQueueListActionButton.reschedule" />
                </Button>
                <Button
                  outline
                  color="danger"
                  onClick={() => {
                    toggleModal("cancel");
                  }}
                >
                  <IntlMessages id="callQueueListActionButton.cancel" />
                </Button>
                <Button
                  outline
                  color="info"
                  onClick={() =>
                    displayCommentPopUp(
                      callQueueData.id,
                      callQueueData.comments
                    )
                  }
                >
                  <IntlMessages id="callQueueListActionButton.comments" />(
                  {callQueueData.comments.length})
                </Button>
                <Button
                  outline
                  color="warning"
                  onClick={() => toggleModal("unreachable")}
                >
                  <IntlMessages id="callQueueListActionButton.unreachable" />
                </Button>
                {callQueueData.type === "vehicle-plate-expiry" && (
                  <Button
                    outline
                    color="danger"
                    onClick={() => {
                      toggleUnsubscribePopup();
                      setModalType("unsubscribe");
                    }}
                  >
                    <IntlMessages id="callQueueListActionButton.unsubscribe" />
                  </Button>
                )}
              </div>
            </div>
            <div className="col-md-6 pr-0 pr-md-0 pl-md-3 pl-0">
              <CardComponent
                header={
                  <h3 className="m-0 w-100 text-center">
                    <IntlMessages id="callQueue.scripts" />
                  </h3>
                }
              >
                <div
                  dangerouslySetInnerHTML={{ __html: callQueueData.script }}
                />
              </CardComponent>
            </div>
            <Modal
              isOpen={showModal}
              toggle={() => setShowModal(!showModal)}
              className="modal-align"
            >
              <ModalHeader toggle={() => setShowModal(!showModal)}>
                <IntlMessages id={`callQueueListActionButton.${modalType}`} />
              </ModalHeader>
              <ModalBody>
                <div className="CallQueueCommentPopUp">
                  {!buttonsListLoading &&
                  buttonsList.length &&
                  modalType !== "reschedule"
                    ? buttonsList.map((button) => (
                        <div className="d-flex">
                          <Button
                            onClick={() => onClickAction(button)}
                            color="primary"
                          >
                            {button.name}
                          </Button>{" "}
                          {button.description}
                        </div>
                      ))
                    : null}
                  {buttonsListLoading && <Spinner color="primary" />}
                  {!buttonsListLoading && modalType === "reschedule" ? (
                    <>
                      {buttonsList.length ? (
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            <IntlMessages id="callQueue.selectReschedule" />
                          </FormLabel>
                          <RadioGroup
                            aria-label="Select Rechedule"
                            name="radio-buttons-group"
                            // defaultValue={buttonsList[0].id.toString()}
                            onChange={(e) => {
                              const btn = buttonsList.find(
                                (bt) => bt.id === parseInt(e.target.value)
                              );
                              setSelectedButton(btn);
                            }}
                          >
                            {buttonsList.map((button) => (
                              <FormControlLabel
                                value={button.id.toString()}
                                control={<Radio />}
                                label={button.name}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      ) : null}
                      <div className="mt-3">
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            <IntlMessages id="callQueue.selectRescheduleOption" />
                          </FormLabel>
                          <RadioGroup
                            aria-label="Rechedule option"
                            defaultValue={scheduleType}
                            name="radio-buttons-group"
                            onChange={(e) => setTimestamp(e.target.value)}
                          >
                            <FormControlLabel
                              value={TIME_SCHEDULES.TOMORROW}
                              control={<Radio />}
                              label={<IntlMessages id="callQueue.tomorrow" />}
                            />
                            <FormControlLabel
                              value={TIME_SCHEDULES.TWO_DAYS}
                              control={<Radio />}
                              label={<IntlMessages id="callQueue.twoDays" />}
                            />
                            <FormControlLabel
                              value={TIME_SCHEDULES.WEEK}
                              control={<Radio />}
                              label={<IntlMessages id="callQueue.nextWeek" />}
                            />
                            <FormControlLabel
                              value="custom"
                              control={<Radio />}
                              label={
                                <>
                                  {`Custom (${customTime.format(
                                    "YYYY-MM-DD"
                                  )}) `}
                                  <span
                                    onClick={() => {
                                      if (datepickerRef.current)
                                        datepickerRef?.current.open();
                                    }}
                                    style={{
                                      textDecoration: "underline",
                                      color: "blue",
                                    }}
                                  >
                                    Edit
                                  </span>
                                </>
                              }
                            />
                            <DatePicker
                              ref={datepickerRef}
                              style={{ display: "none" }}
                              minDate={moment()
                                .add(1, "d")
                                .format("YYYY-MM-DD")}
                              maxDate={
                                callQueueData.order.quote_extension_max_date
                              }
                              leftArrowIcon={
                                <i className="zmdi zmdi-arrow-back" />
                              }
                              rightArrowIcon={
                                <i className="zmdi zmdi-arrow-forward" />
                              }
                              renderInput={(params) => null}
                              onChange={(date) => setCustomTime(date)}
                            />
                          </RadioGroup>
                        </FormControl>
                        <Button
                          disabled={!selectedButton}
                          onClick={() => onClickAction(selectedButton)}
                          className="mt-2 w-100"
                        >
                          <IntlMessages id="partnerOrders.accept" />
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </ModalBody>
            </Modal>
            <Modal isOpen={callQueueUpdated} className="modal-align">
              <ModalBody>
                <p>
                  Entry has been updated from {updatedData.before_status} to{" "}
                  {updatedData.after_status}.
                </p>
                <Button
                  className=""
                  color="primary"
                  onClick={() => {
                    setCallQueueUpdated(false);
                    fetchCallQueueList(id);
                  }}
                >
                  Okey
                </Button>
              </ModalBody>
            </Modal>
            <AlertPopUp
              title={
                modalType === "cancel" && popUpType === "warning" ? (
                  <>
                    <IntlMessages id="sweetAlerts.cancelCallQueueWarning" />{" "}
                    {selectedButton.name}
                  </>
                ) : modalType === "reschedule" && popUpType === "warning" ? (
                  <>
                    <IntlMessages id="sweetAlerts.rescheduleCallQueueWarning" />{" "}
                    {selectedButton.name}
                  </>
                ) : (
                  handleTitle()
                )
              }
              show={showPopUpValue}
              message={popUpMsg && popUpMsg}
              success={popUpType === "success"}
              warning={popUpType === "warning"}
              danger={popUpType === "danger"}
              disabled={popUpType === "loading"}
              showCancel={popUpType === "warning"}
              confirmBtnBsStyle={modalType === "cancel" ? "success" : "primary"}
              cancelBtnBsStyle={modalType === "cancel" ? "danger" : "primary"}
              confirmBtnText={
                modalType === "cancel" && popUpType === "warning" ? (
                  <IntlMessages id="button.yes" />
                ) : (
                  <IntlMessages id="sweetAlerts.continue" />
                )
              }
              cancelBtnText={
                modalType === "cancel" && popUpType === "warning" ? (
                  <IntlMessages id="callQueue.noRecordsMsg" />
                ) : (
                  <IntlMessages id="sweetAlerts.cancelButton" />
                )
              }
              onConfirm={handleOnConfirmButton}
              onCancel={handleOnCancelButton}
            />
          </Row>
        </>
      );
    } else {
      return (
        <Row>
          <div className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center d-flex w-100">
            <Alert className="w-100 m-0" color="warning">
              <IntlMessages id="callQueue.noRecordsMsg" />
            </Alert>
          </div>
        </Row>
      );
    }
  } else {
    if (error) {
      return (
        <Row>
          <div className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center d-flex w-100">
            <Alert className="w-100 m-0" color="danger">
              {error}
            </Alert>
          </div>
        </Row>
      );
    }
    return <Loader />;
  }
};

export default CallQueueListNew;
