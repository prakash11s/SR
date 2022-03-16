import React, { Component, Dispatch } from "react";
import moment from "moment";
import { Badge } from "reactstrap";
import { Alert } from "reactstrap";
import queryString from "query-string";
import ContainerHeader from "../ContainerHeader";
import { Card, CardBody, CardText, Button } from "reactstrap";
import { connect } from "react-redux";
import IntlMessages from "../../util/IntlMessages";
import { createStructuredSelector } from "reselect";
import Loader from "../../containers/Loader/Loader";
import axios from "../../util/Api";
import UserHasPermission from "../../util/Permission";
import {
  setCallQueueListStartAsync,
  onHandleApprove,
  onHandleReject,
  onHandleRejectConnectApi,
  onHandleDelete,
  onHandleUnsubscribe,
  onHandleUnsubscribeConnectApi,
  onHandleReschedule,
  toggleAlertPrompt,
  onHandleRescheduleConnectApi,
  makeIndividualCallFromQueue,
  resumeCallQueue,
  setCallQueueStatus,
  goToNextCallImmediate,
  goToNextCallInQueue,
} from "actions/Actions/callQueueListActions";
import {
  selectCallQueueListData,
  selectLoader,
  selectShow,
  selectSpinnerValue,
  selectCallQueueStatus,
  selectCallQueueTimer,
  selectActiveCaller,
  selectNoActionTaken,
  selectPromptShow,
} from "../../selectors/callQueueListSelectors";
import ReschedulePrompt from "./../../common/ReschedulePrompt";
import CallQueueActionPrompt from "./../../common/callQueueActionPrompt";
import { TIME_SCHEDULES } from "../../constants/common.constants";
import "./CallQueueList.scss";
import AlertPopUp from "../../common/AlertPopUp";
import CommentPopUp from "../CallQueueCommentPopup";
import { injectIntl } from "react-intl";
import CountDownTimer from "./CountDownTimer";
import DOMPurify from "dompurify";
import { ICallQueueListState } from "./Interface/IndexInterface";
import { selectCall } from "../../selectors/softPhone.selectors";
import { readableDate } from "../../util/helper";

class CallQueueList extends Component<any, ICallQueueListState> {
  history;
  constructor(props: any) {
    super(props);
    this.state = {
      loader: false,
      unsubscribeId: "",
      rejectId: "",
      deleteId: "",
      rescheduleId: "",
      scheduleType: null,
      time: null,
      popUp: false,
      onConfirmValue: null,
      alertType: "",
      popUpDisplayMessage: "",
      showCallQueueAlert: false,
      callQueueOptionDropdownList: [],
      callQueueActionId: "",
      actionToPerform: "",
      actionPopUpTitle: "",
      options: null,
      actionError: false,
      error: false,
      showCommentPopUp: false,
      commentsToShow: [],
      commentsLength: null,
      commentId: "",
      callAlert: false,
      callUser: null,
      other: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    const id = this.props.match.params.id;
    this.history = this.props.history;
    this.props.setCallQueueListStartAsync(this.history, id);
    let params = queryString.parse(this.props.location.search);
    if (params && params.start) {
      this.props.setCallQueueStatus(true);
      this.props.goToNextCallInQueue(true);
    }

    axios
      .get(`/call-queues/status-codes`)
      .then((response) => {
        this.setState({ callQueueOptionDropdownList: response.data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidUpdate(nextProps) {
    const { noActionTaken } = this.props;
    if (nextProps.noActionTaken !== noActionTaken && noActionTaken) {
      this.setState({
        showCallQueueAlert: true,
      });
      this.props.setCallQueueStatus(false);
    }
  }

  popUpHandler = (actionToPerform, id) => {
    if (actionToPerform === "UNSUBSCRIBE") {
      this.setState({ popUp: true });
      this.setState({
        onConfirmValue: () => this.handleUnsubscribe(id),
        alertType: "warning",
        actionToPerform: actionToPerform,
        actionPopUpTitle: "sweetAlerts.Unsubscribe",
        popUpDisplayMessage: "sweetAlerts.unsubscribeActionMessage",
      });
    } else if (actionToPerform === "RESCHEDULE") {
      this.setState({ popUp: true });
      this.setState({
        onConfirmValue: () => this.handleReschedule(id),
        alertType: "warning",
        actionToPerform: actionToPerform,
        actionPopUpTitle: "sweetAlerts.Reschedule",
        popUpDisplayMessage: "sweetAlerts.rescheduleActionMessage",
      });
    } else if (actionToPerform === "EDIT") {
      this.setState({ popUp: true });
      this.setState({
        onConfirmValue: this.onCancelPopUp,
        alertType: "warning",
        actionToPerform: actionToPerform,
        actionPopUpTitle: "sweetAlerts.Edit",
        popUpDisplayMessage: "sweetAlerts.editActionMessage",
      });
    } else if (actionToPerform === "APPROVED") {
      this.setState({ popUp: true });
      this.setState({
        onConfirmValue: () => this.handleApprove(id),
        alertType: "warning",
        actionToPerform: actionToPerform,
        actionPopUpTitle: "sweetAlerts.Approved",
        popUpDisplayMessage: "sweetAlerts.approvedActionMessage",
      });
    } else if (actionToPerform === "REJECTED") {
      this.setState({ popUp: true });
      this.setState({
        onConfirmValue: () => this.handleReject(id),
        alertType: "warning",
        actionToPerform: actionToPerform,
        actionPopUpTitle: "sweetAlerts.Reject",
        popUpDisplayMessage: "sweetAlerts.rejectedActionMessage",
      });
    } else if (actionToPerform === "DELETE") {
      this.setState({ popUp: true });
      this.setState({
        onConfirmValue: () => this.handleDelete(id),
        alertType: "warning",
        actionToPerform: actionToPerform,
        actionPopUpTitle: "sweetAlerts.Delete",
        popUpDisplayMessage: "sweetAlerts.deleteWarningMessage",
      });
    }
  };

  checkCallQueueAction = (actionToPerform) => {
    const options = this.state.options;
    if (actionToPerform === "UNSUBSCRIBE" && options !== null) {
      this.handleUnsubscribeApi();
    } else if (actionToPerform === "REJECTED" && options !== null) {
      this.handleRejectApi();
    } else if (actionToPerform === "DELETE" && options !== null) {
      //Commenting it for future use
      //this.handleDeleteApi();
    } else {
      this.setState({ actionError: true });
    }
    this.setState({ options: null });
  };

  onCancelPopUp = () => {
    this.setState({ popUp: false });
  };

  handleDelete = (id) => {
    this.props.onHandleDelete(id, this.history);
    this.setState({ popUp: false });
  };

  handleApprove = (id) => {
    this.props.onHandleApprove(id, this.history);
    this.setState({ popUp: false });
  };

  handleReject = (id) => {
    this.setState({ rejectId: id });
    this.props.onHandleReject();
    this.setState({ popUp: false });
  };

  handleUnsubscribe = (id) => {
    this.setState({ unsubscribeId: id });
    this.props.onHandleUnsubscribe();
    this.setState({ popUp: false });
  };

  handleReschedule = (id) => {
    this.setState({ rescheduleId: id });
    this.props.onHandleReschedule();
    this.setState({ popUp: false });
  };

  handleRescheduleApi = () => {
    const onChangeHandlerId = this.state.callQueueActionId;
    const id = this.state.rescheduleId;
    const time = this.state.time;
    const options = this.state.options;
    if (time && options !== null && onChangeHandlerId) {
      this.props.onHandleRescheduleConnectApi({ id, time, onChangeHandlerId });
      this.setState({ scheduleType: null, options: null, other: false });
    } else {
      this.setState({ error: true });
    }
  };

  setTimestamp = (scheduleType) => {
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
    } else if (scheduleType === TIME_SCHEDULES.TWO_WEEKS) {
      time = moment()
        .add(14, "days")
        .format();
    } else if (scheduleType === TIME_SCHEDULES.MONTH) {
      time = moment()
        .add(1, "months")
        .format();
    } else if (scheduleType === TIME_SCHEDULES.YEAR) {
      time = moment()
        .add(1, "years")
        .format();
    } else if (scheduleType === TIME_SCHEDULES.OTHER) {
      time = moment().format();
    }

    // set time in timestamp
    const convertedTime = new Date(time).toISOString();
    this.setState({ time: convertedTime, scheduleType });
  };

  setTimestampForOther = (scheduleType, dateValue) => {
    let time = moment(dateValue).format();

    // set time in timestamp
    const convertedTime = new Date(time).toISOString();
    this.setState({ time: convertedTime, scheduleType });
  };

  setOther = () => {
    this.setState({ other: true });
  };

  handleCancel = () => {
    this.props.toggleAlertPrompt();
    this.setState({
      time: null,
      scheduleType: null,
      error: false,
      options: null,
      other: false,
    });
  };

  handleCancelPrompt = () => {
    this.props.onHandleUnsubscribe();
    this.setState({
      options: null,
      actionError: false,
    });
  };

  makeCall = (user) => {
    if (!this.props.callState.showOngoingCallPad) {
      this.setState({
        ...this.state,
        callUser: user,
        callAlert: true,
      });
    }
  };

  callCancel = () => {
    this.setState({
      ...this.state,
      callAlert: false,
      callUser: null,
    });
  };

  startCall = () => {
    this.setState({
      ...this.state,
      callAlert: false,
    });
    !this.props.callQueueStatus &&
      this.props.makeIndividualCallFromQueue(this.state.callUser);
  };

  setCallQueueStatus = () => {
    this.props.setCallQueueStatus(false);
  };

  hideCallQueueAlert = () => {
    this.setState({
      showCallQueueAlert: false,
    });
  };

  handleUnsubscribeApi = () => {
    const id = this.state.unsubscribeId;
    const onChangeHandlerId = this.state.callQueueActionId;
    this.props.onHandleUnsubscribeConnectApi(
      id,
      this.history,
      onChangeHandlerId
    );
  };

  handleRejectApi = () => {
    const id = this.state.rejectId;
    const onChangeHandlerId = this.state.callQueueActionId;
    this.props.onHandleRejectConnectApi(id, this.history, onChangeHandlerId);
  };
  onChangeHandlerId = (id) => {
    this.setState({ callQueueActionId: id, options: id });
  };
  showCommentPopUp = (id, comments) => {
    this.setState({
      showCommentPopUp: true,
      commentsToShow: comments,
      entryId: id,
    });
  };

  hideCommentPopUp = (id, commentsLength) => {
    this.setState({
      showCommentPopUp: false,
      commentsLength: commentsLength,
      commentId: id,
    });
  };

  render() {
    const {
      callQueueData,
      promptShow,
      loader,
      show,
      spinnerToggle,
      resumeCallQueue,
      callQueueStatus,
      callQueueTimer,
      activeCaller,
      goToNextCallImmediate,
      noActionTaken,
    } = this.props;
    let loaderComponent;
    const { actionToPerform, actionPopUpTitle } = this.state;

    const title =
      (callQueueData &&
        callQueueData.meta &&
        callQueueData.meta.call_queue &&
        callQueueData.meta.call_queue.name) ||
      "";
    if (spinnerToggle || loader) {
      loaderComponent = <Loader />;
    }

    const playPauseButton = (
      <div className="d-flex align-items-center">
        {" "}
        <span>{title}</span>
        {callQueueStatus && !noActionTaken && (
          <div
            className="btn-round d-flex align-items-center justify-content-center ml-3 CallQueueList-pause-btn"
            onClick={this.setCallQueueStatus}
          >
            <svg
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
        {!callQueueStatus && !noActionTaken && (
          <div
            className="btn-round d-flex align-items-center justify-content-center ml-3 mr-3 CallQueueList-play-btn"
            onClick={this.props.resumeCallQueue}
          >
            <svg
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
      <div className="mr-5 font-size-20">
        <CountDownTimer />
        <Badge className="mb-0" color="primary" onClick={goToNextCallImmediate}>
          <IntlMessages id="appModule.next" />
        </Badge>
      </div>
    );

    return (
      <div className="CallQueueList">
        {loaderComponent}

        <ReschedulePrompt
          time={this.state.scheduleType}
          show={show}
          options={this.state.options}
          error={this.state.error}
          other={this.state.other}
          setOther={this.setOther}
          callQueueOptionDropdownList={this.state.callQueueOptionDropdownList}
          onChangeHandlerId={this.onChangeHandlerId}
          setTimestamp={this.setTimestamp}
          setTimestampForOther={this.setTimestampForOther}
          onConfirm={this.handleRescheduleApi}
          onCancel={this.handleCancel}
          confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
          cancelBtnText={<IntlMessages id="sweetAlerts.cancelButton" />}
        />

        <CallQueueActionPrompt
          actionError={this.state.actionError}
          show={promptShow}
          title={actionPopUpTitle}
          options={this.state.options}
          callQueueOptionDropdownList={this.state.callQueueOptionDropdownList}
          onChangeHandlerId={this.onChangeHandlerId}
          onConfirm={() => this.checkCallQueueAction(actionToPerform)}
          onCancel={() => this.handleCancelPrompt()}
          confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
          cancelBtnText={<IntlMessages id="sweetAlerts.cancelButton" />}
        />

        <div className="fixed-element">
          <ContainerHeader title={playPauseButton} match={this.props.match}>
            {timer}
          </ContainerHeader>
        </div>

        {callQueueData.data.length > 0 && (
          <Alert
            className="bg-success text-white shadow-lg"
            isOpen={callQueueData.data.length === 0 ? true : false}
            color="success"
          >
            <div>
              <h1>
                <IntlMessages id="callQueueList.alerts.empty-list.title" />
              </h1>
            </div>
            <div>
              <IntlMessages
                id="callQueueList.alerts.empty-list.message"
                values={{ name: title }}
              />{" "}
            </div>
          </Alert>
        )}

        <AlertPopUp
          show={this.state.showCallQueueAlert}
          message={<IntlMessages id={`callQueueList.noActionTaken`} />}
          title={<IntlMessages id="sweetAlerts.warning" />}
          warning={true}
          showOk
          confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
          onConfirm={this.hideCallQueueAlert}
        />
        <CommentPopUp
          show={this.state.showCommentPopUp}
          onConfirm={this.hideCommentPopUp}
          id={this.state.entryId}
          confirmBtnBsStyle="default"
          commentsList={this.state.commentsToShow}
          key="comment-popup"
        />
        {callQueueData.data.length ? (
          <div>
            {!spinnerToggle &&
              callQueueData &&
              callQueueData.data.map((data) => (
                <Card
                  key={data.id}
                  className={
                    activeCaller && activeCaller.id === data.id
                      ? "shadow active-border"
                      : data.noActionTaken
                      ? "no-action-border"
                      : ""
                  }
                >
                  <CardBody>
                    <CardText>
                      <div className="jr-card-body">
                        <div className="manage-margin d-flex justify-content-between">
                          <div>
                            <h4>
                              <b>
                                <IntlMessages id="callQueueList.name" />
                                :&nbsp;
                              </b>
                              {data.name}
                            </h4>
                            <h4>
                              <b>
                                <IntlMessages id="callQueueList.email" />
                                :&nbsp;
                              </b>
                              {data.email}
                            </h4>
                            <h4>
                              <b>
                                <IntlMessages id="callQueueList.status" />
                                :&nbsp;
                              </b>
                              {data.status}
                            </h4>
                            <h4>
                              <b>
                                <IntlMessages id="callQueueList.phone" />
                                :&nbsp;
                              </b>
                              <span
                                className={`CallQueueList-phone  text-muted ${
                                  callQueueStatus ? "cursor-not-allowed" : ""
                                }`}
                                onClick={this.makeCall.bind(this, data)}
                                title={this.props.intl.formatMessage({
                                  id: "callQueueList.makeCall",
                                })}
                              >
                                {data.phone}
                              </span>
                            </h4>
                          </div>
                          <div>
                            <h4>
                              <b>
                                <IntlMessages id="callQueueList.availableAfter" />
                                :&nbsp;
                              </b>
                              {data.available_after
                                ? data.available_after
                                : " -"}
                            </h4>
                            <h4>
                              <b>
                                <IntlMessages id="callQueueList.createdAt" />
                                :&nbsp;
                              </b>
                              &nbsp;
                              {data.created_at
                                ? readableDate(data.created_at)
                                : "-"}
                            </h4>
                            <h4>
                              <b>
                                <IntlMessages id="callQueueList.updatedAt" />
                                :&nbsp;
                              </b>
                              &nbsp;
                              {data.updated_at
                                ? readableDate(data.updated_at)
                                : "-"}
                            </h4>
                          </div>
                          <div className="CallQueueList-description">
                            <h4>
                              <b>
                                <IntlMessages id="callQueueList.description" />
                                :&nbsp;
                              </b>
                            </h4>
                            <h4>
                              <p
                                className="content"
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(data.description),
                                }}
                              ></p>
                            </h4>
                          </div>
                        </div>
                        <div>
                          <UserHasPermission permission="call-queue-entries-unsubscribe">
                            <Button
                              data-toggle="tooltip"
                              outline
                              color="warning"
                              onClick={this.popUpHandler.bind(
                                this,
                                "UNSUBSCRIBE",
                                data.id
                              )}
                            >
                              {" "}
                              <IntlMessages id="callQueueListActionButton.unsubscribe" />
                            </Button>
                          </UserHasPermission>
                          <UserHasPermission permission="call-queue-entries-reschedule">
                            <Button
                              data-toggle="tooltip"
                              outline
                              color="primary"
                              onClick={this.popUpHandler.bind(
                                this,
                                "RESCHEDULE",
                                data.id
                              )}
                            >
                              <IntlMessages id="callQueueListActionButton.reschedule" />
                            </Button>
                          </UserHasPermission>
                          <UserHasPermission permission="call-queue-entries-entry-edit">
                            <Button
                              data-toggle="tooltip"
                              outline
                              color="info"
                              onClick={this.popUpHandler.bind(
                                this,
                                "EDIT",
                                data.id
                              )}
                            >
                              <IntlMessages id="callQueueListActionButton.edit" />
                            </Button>
                          </UserHasPermission>
                          <UserHasPermission permission="call-queue-entries-approve">
                            <Button
                              data-toggle="tooltip"
                              outline
                              color="success"
                              onClick={this.popUpHandler.bind(
                                this,
                                "APPROVED",
                                data.id
                              )}
                            >
                              <IntlMessages id="callQueueListActionButton.approve" />
                            </Button>
                          </UserHasPermission>
                          <UserHasPermission permission="call-queue-entries-reject">
                            <Button
                              data-toggle="tooltip"
                              outline
                              color="danger"
                              onClick={this.popUpHandler.bind(
                                this,
                                "REJECTED",
                                data.id
                              )}
                            >
                              <IntlMessages id="callQueueListActionButton.reject" />
                            </Button>
                          </UserHasPermission>
                          <UserHasPermission permission="call-queue-entries-entry-delete">
                            <Button
                              data-toggle="tooltip"
                              outline
                              color="danger"
                              onClick={this.popUpHandler.bind(
                                this,
                                "DELETE",
                                data.id
                              )}
                            >
                              <IntlMessages id="callQueueListActionButton.delete" />
                            </Button>
                          </UserHasPermission>
                          <UserHasPermission permission="call-queue-entries-create-comment">
                            <Button
                              data-toggle="tooltip"
                              outline
                              color="info"
                              onClick={this.showCommentPopUp.bind(
                                this,
                                data.id,
                                data.comments
                              )}
                            >
                              <IntlMessages id="callQueueListActionButton.comments" />
                              ({data.comments.length})
                            </Button>
                          </UserHasPermission>
                        </div>
                      </div>
                    </CardText>
                  </CardBody>

                  <AlertPopUp
                    show={this.state.callAlert}
                    title={<IntlMessages id={"sipCallMakeCall"} />}
                    warning={true}
                    showCancel={true}
                    onCancel={this.callCancel}
                    onConfirm={this.startCall}
                  />

                  <AlertPopUp
                    key="alertPopUp"
                    show={this.state.popUp}
                    message={
                      <IntlMessages id={this.state.popUpDisplayMessage} />
                    }
                    title={<IntlMessages id="sweetAlerts.deleteWarningTitle" />}
                    showCancel
                    confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
                    cancelBtnText={
                      <IntlMessages id="sweetAlerts.cancelButton" />
                    }
                    confirmBtnBsStyle={this.state.popUpButtonStyle}
                    {...{ [this.state.alertType]: true }}
                    onConfirm={this.state.onConfirmValue}
                    onCancel={this.onCancelPopUp.bind(this)}
                  />
                </Card>
              ))}
          </div>
        ) : (
          <h1 className="text-center text-grey mt-5">
            <IntlMessages id="callQueueList.NoDataMessage" />
          </h1>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setCallQueueListStartAsync: (history, id) =>
      dispatch(setCallQueueListStartAsync(history, id)),
    onHandleDelete: (id, history) => dispatch(onHandleDelete(id, history)),
    onHandleReschedule: () => dispatch(onHandleReschedule()),
    toggleAlertPrompt: () => dispatch(toggleAlertPrompt()),
    onHandleRescheduleConnectApi: ({ id, time, history, onChangeHandlerId }) =>
      dispatch(
        onHandleRescheduleConnectApi({ id, time, history, onChangeHandlerId })
      ),
    onHandleApprove: (id, history) => dispatch(onHandleApprove(id, history)),
    onHandleReject: () => dispatch(onHandleReject()),
    onHandleRejectConnectApi: (id, history, onChangeHandlerId) =>
      dispatch(onHandleRejectConnectApi(id, history, onChangeHandlerId)),
    onHandleUnsubscribe: () => dispatch(onHandleUnsubscribe()),
    onHandleUnsubscribeConnectApi: (id, history, onChangeHandlerId) =>
      dispatch(onHandleUnsubscribeConnectApi(id, history, onChangeHandlerId)),
    makeIndividualCallFromQueue: (user) =>
      dispatch(makeIndividualCallFromQueue(user)),
    resumeCallQueue: () => dispatch(resumeCallQueue()),
    setCallQueueStatus: (value) => dispatch(setCallQueueStatus(value)),
    goToNextCallImmediate: () => dispatch(goToNextCallImmediate()),
    goToNextCallInQueue: (value = false) =>
      dispatch(goToNextCallInQueue(value)),
  };
};
const mapStateToProps = createStructuredSelector({
  callQueueData: selectCallQueueListData,
  loader: selectLoader,
  show: selectShow,
  spinnerToggle: selectSpinnerValue,
  callQueueStatus: selectCallQueueStatus,
  callQueueTimer: selectCallQueueTimer,
  activeCaller: selectActiveCaller,
  noActionTaken: selectNoActionTaken,
  promptShow: selectPromptShow,
  callState: selectCall,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CallQueueList));
