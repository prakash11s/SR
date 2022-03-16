import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import {
  deleteServicePoint,
  sendBacklikedServicePoint,
  getCompanyDetails,
  setSalesNotes,
  recoverServicePoint,
} from "../../actions/Actions/ComapaniesActions";
import IntlMessages from "../../util/IntlMessages";
import OperatingHoursDisplayTable from "./OperatingHoursDisplayTable";
import { initCompany } from "../../reducers/Reducers/CompaniesReducer";
import SipCallService from "../Phone/SipCallService";
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import UserHasPermission from "../../util/Permission";
import CancelIcon from "@material-ui/icons/Cancel";
import { readableDateTimeLocale } from "../../util/helper";
import { Button, IconButton } from "@material-ui/core";
import RBACContext from "../../rbac/rbac.context";
import AlertPopUp from "common/AlertPopUp";
import { injectIntl } from "react-intl";
import { GET_COMPANY_DETAILS } from "constants/ActionTypes";

/**
 *
 * @returns {Component}
 * @constructor
 */
const CompaniesSharedInfo = (props) => {
  /**
   * Created dispatch for to dispatch actions
   */
  const dispatch = useDispatch();

  /**
   * get company id from params
   * */
  const { id } = useParams<any>();
  const localDateTimeFormat = props.intl.formatMessage({
    id: "localeDateTime",
    defaultMessage: "DD-MM-YYYY hh:mm:ss",
  });

  /**
   * get company state from redux
   * */
  const companyState = useSelector((state: any) => state.companyState.company);
  const selectedDepartment = useSelector(
    (state: any) => state.department.selectedDepartment
  );
  const callState = useSelector((state: any) => state.softPhone.Call);
  const { userCan, abilities } = useContext<any>(RBACContext);
  const [company, setCompany] = useState<any>(initCompany);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [isSendBackLink, setIsSendBackLink] = useState<boolean>(false);
  const [isRecover, setIsRecover] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [popUpMsg, setPopUpMsg] = useState<string>("");
  const [popUpType, setPopUpType] = useState<string>("warning");
  const [showSalesNotesPopup, setShowSalesNotesPopup] = useState<boolean>(
    false
  );
  const [description, setDescription] = useState<string>("");
  const [savingStatus, setSavingStatus] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    dispatch(
      getCompanyDetails(id, history, (msg: string) => {
        setIsLoading(false);
        setErrorMsg(msg);
      })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (companyState.id) {
      setCompany(companyState);
      setDescription(companyState.sales_notes);
      setIsLoading(false);
    }
  }, [companyState]); // eslint-disable-line react-hooks/exhaustive-deps

  const callPhone = (phoneNumber: string) => {
    if (!callState.showOngoingCallPad) {
      SipCallService.startCall(phoneNumber);
    }
  };

  const handleCompanyEditButton = () => {
    if (Boolean(company.id))
      history.push(`/support/companies/${company.id}/edit`);
  };

  const handleOnCancelButton = () => {
    setPopUpType("warning");
    setShowPopUpValue(false);
    setIsSendBackLink(false);
    setIsRecover(false);
    setPopUpMsg("");
  };

  const handleOnConfirmButton = () => {
    if (popUpType === "warning" && !isSendBackLink && !isRecover) {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        deleteServicePoint(id, (type: string, msg: string) => {
          setIsLoading(false);
          setShowPopUpValue(true);
          setPopUpType(type);
          setPopUpMsg(msg);
        })
      );
    } else if (popUpType === "warning" && isSendBackLink && !isRecover) {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        sendBacklikedServicePoint(id, (type: string, msg: string) => {
          setIsLoading(false);
          setShowPopUpValue(true);
          setPopUpType(type);
          setPopUpMsg(msg);
        })
      );
    } else if (popUpType === "warning" && isRecover) {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        recoverServicePoint(id, (type: string, msg: string) => {
          setIsLoading(false);
          setShowPopUpValue(true);
          setPopUpType(type);
          setPopUpMsg("");
        })
      );
    } else if (popUpType === "success" && !isSendBackLink && isRecover) {
      setPopUpType("");
      setShowPopUpValue(false);
      setIsRecover(false);
      dispatch({
        type: GET_COMPANY_DETAILS,
        payload: { ...companyState, deleted_at: null },
      });
    } else if (popUpType === "success" && !isSendBackLink && !isRecover) {
      setPopUpType("");
      setShowPopUpValue(false);
      history.push(`/support/companies`);
    } else {
      setShowPopUpValue(false);
    }
  };

  const handleTitle = (type: string) => {
    if (popUpType === "warning") {
      return <IntlMessages id={`sweetAlerts.${type}`} />;
    } else if (popUpType === "success") {
      return <IntlMessages id={`sweetAlerts.${type}Success`} />;
    } else if (popUpType === "danger") {
      return <IntlMessages id={`sweetAlerts.${type}Fail`} />;
    }
  };

  const handleSalesNotesSave = () => {
    setSavingStatus(true);
    dispatch(
      setSalesNotes(
        companyState.id,
        { sales_notes: description },
        (status: boolean, data: any) => {
          setSavingStatus(false);
          setShowSalesNotesPopup(!showSalesNotesPopup);
          if (!status) {
            setPopUpMsg("Something went wrong");
            setPopUpType("Warning");
            setShowPopUpValue(true);
          }
        }
      )
    );
  };

  return (
    <React.Fragment>
      {!isLoading && !errorMsg && Boolean(company.id) ? (
        <div className="jr-card">
          {/* <Link
            to={`/support/companies/${company.id}/edit`}
            style={{
              textDecoration: "unset",
            }}
          > */}
          <div className="row mb-3">
            <div className="col-md-6 row">
              <div className="col-md-6">
                <h2>
                  <b>
                    <IntlMessages id="company.company-name" /> :
                  </b>
                </h2>
                {company.name && <h2>{company.name}</h2>}
                {company.legal_form && <h3>{company.legal_form}</h3>}
                {selectedDepartment &&
                  selectedDepartment.image &&
                  selectedDepartment.image.small && (
                    <img
                      src={
                        company.avatar
                          ? company.avatar
                          : selectedDepartment.image.small
                      }
                      height={150}
                      width={150}
                    />
                  )}
              </div>
              <div className="col-md-6">
                <div className="col-md-12">
                  <h4>
                    <span>
                      <b>
                        <IntlMessages id="company.company-coc" />{" "}
                      </b>
                      : {company.coc ? company.coc : "-"}
                    </span>
                  </h4>
                </div>
                <div className="col-md-12">
                  {company.email && (
                    <h4>
                      <span>
                        <b>
                          <IntlMessages id="company.company-email" />{" "}
                        </b>
                        : {company.email}{" "}
                      </span>
                    </h4>
                  )}
                </div>
                <div className="col-md-12">
                  {company.phone && (
                    <h4>
                      <span onClick={() => callPhone(company.phone)}>
                        <b>
                          <IntlMessages id="company.company-phone" />{" "}
                        </b>
                        : {company.phone}{" "}
                      </span>
                    </h4>
                  )}
                </div>
                <div className="col-md-12">
                  {company.phone_2 && (
                    <h4>
                      <span onClick={() => callPhone(company.phone_2)}>
                        <b>
                          <IntlMessages id="company.company-secondary-phone" />{" "}
                        </b>
                        : {company.phone_2}{" "}
                      </span>
                    </h4>
                  )}
                </div>
                <div className="col-md-12">
                  {company.website && (
                    <h4>
                      <span>
                        <b>
                          <IntlMessages id="company.company-website" />{" "}
                        </b>
                        :{" "}
                        <a href={company.website} target="_blank">
                          {company.website}
                        </a>{" "}
                      </span>
                    </h4>
                  )}
                </div>
                <div className="col-md-12">
                  {company.street && (
                    <h4>
                      <span>
                        <b>
                          <IntlMessages id="company.company-address" />{" "}
                        </b>
                        :{" "}
                        {`${company.street} ${
                          company.street_number ? company.street_number : ""
                        } ${company.city ? company.city : ""} ${
                          company.zip_code ? company.zip_code : ""
                        }`}{" "}
                      </span>
                    </h4>
                  )}
                </div>
                <div className="col-md-12">
                  {company.country && (
                    <h4>
                      <span>
                        <b>
                          <IntlMessages id="company.company-country" />{" "}
                        </b>
                        : {company.country}{" "}
                      </span>
                    </h4>
                  )}
                </div>
                <div className="col-md-12">
                  <h4>
                    <span>
                      <b>
                        <IntlMessages id="company.availableOnWeb" />{" "}
                      </b>
                      :{" "}
                      {Boolean(company.public_visibility) ? (
                        <IntlMessages id="button.yes" />
                      ) : (
                        <IntlMessages id="button.no" />
                      )}{" "}
                    </span>
                  </h4>
                </div>
                <div className="col-md-12">
                  {company.description && (
                    <h4>
                      <span>
                        <b>
                          <IntlMessages id="company.company-description" />{" "}
                        </b>
                        : {company.description}{" "}
                      </span>
                    </h4>
                  )}
                </div>
                <div className="col-md-12">
                  {company.created_at && (
                    <h4>
                      <span>
                        <b>
                          <IntlMessages id="company.created-at" />{" "}
                        </b>
                        :{" "}
                        {company.created_at
                          ? readableDateTimeLocale(
                              company.created_at,
                              localDateTimeFormat
                            )
                          : "-"}{" "}
                      </span>
                    </h4>
                  )}
                </div>
                {/* <div className="col-md-12">
                  {company.updated_at && (
                    <h4>
                      <span>
                        <b>
                          <IntlMessages id="company.updated-at" />{" "}
                        </b>
                        : {readableDate(company.updated_at)}{" "}
                      </span>
                    </h4>
                  )}
                </div> */}

                {/*		{company.created_at && <DisplayCard title={<IntlMessages id="company.created-at"/>}*/}
                {/*                                        value={moment(company.created_at).format('MM-DD-YYYY HH:mm:ss')}/>}*/}
                {/*		{company.updated_at && <DisplayCard title={<IntlMessages id="company.updated-at"/>}*/}
                {/*                                        value={moment(company.updated_at).format('MM-DD-YYYY HH:mm:ss')}/>}*/}

                {/*	</li>*/}
                {/*</ul>*/}
              </div>
            </div>
            <div className="col-md-6">
              {company.opening_hours && (
                <div className="table-responsive-material">
                  <OperatingHoursDisplayTable
                    openingHours={company.opening_hours}
                  />
                </div>
              )}
            </div>
          </div>
          {company.deleted_at && (
            <div className="w-100 d-flex">
              <Button
                onClick={() => {
                  setPopUpType("warning");
                  setPopUpMsg("");
                  setShowPopUpValue(true);
                  setIsRecover(true);
                  setIsSendBackLink(false);
                }}
                variant="contained"
                className="jr-btn bg-blue-grey text-white"
              >
                <IntlMessages id="feedbackTable.Recover" />
              </Button>
              <div className="d-inline-block">
                <h4>
                  <span>
                    <b>
                      <IntlMessages id="company.deleted-at" />{" "}
                    </b>
                    :{" "}
                    {company.deleted_at
                      ? readableDateTimeLocale(
                          company.deleted_at,
                          localDateTimeFormat
                        )
                      : "-"}{" "}
                  </span>
                </h4>
              </div>
            </div>
          )}
          {!company.deleted_at && (
            <div className="w-100 d-flex">
              <UserHasPermission permission="service-points-service-delete-service-point">
                <Button
                  onClick={() => {
                    setPopUpType("warning");
                    setPopUpMsg("");
                    setShowPopUpValue(true);
                    setIsSendBackLink(false);
                  }}
                  variant="contained"
                  className="jr-btn bg-red text-white"
                >
                  <IntlMessages id="comments.table.delete" />
                </Button>
              </UserHasPermission>
              <UserHasPermission permission="update-servicepoint-information">
                <Button
                  className="jr-btn bg-warning text-white"
                  onClick={handleCompanyEditButton}
                >
                  <IntlMessages id="comments.table.edit" />
                </Button>
              </UserHasPermission>
              <UserHasPermission permission="service-points-service-send-recognition-backlink">
                <Button
                  className="jr-btn bg-blue-grey text-white"
                  onClick={() => {
                    setPopUpType("warning");
                    setPopUpMsg("");
                    setShowPopUpValue(true);
                    setIsSendBackLink(true);
                  }}
                >
                  <IntlMessages id="comments.table.sendBacklink" />
                </Button>
              </UserHasPermission>
              <div className="d-inline-block">
                {company.updated_at && (
                  <h4>
                    <span>
                      <b>
                        <IntlMessages id="company.updated-at" />{" "}
                      </b>
                      :{" "}
                      {company.updated_at
                        ? readableDateTimeLocale(
                            company.updated_at,
                            localDateTimeFormat
                          )
                        : "-"}{" "}
                    </span>
                  </h4>
                )}
              </div>
              <UserHasPermission permission="update-servicepoint-sales-notes">
                <Button
                  className="jr-btn bg-success text-white ml-auto"
                  onClick={() => {
                    setShowSalesNotesPopup(!showSalesNotesPopup);
                  }}
                >
                  <IntlMessages id="comments.table.salesNotes" />
                </Button>
              </UserHasPermission>
            </div>
          )}
          {/* <AlertPopUp
            show={showDeleteConfirmation}
            title={<IntlMessages id={"company.delete.alert.msg"} />}
            warning={true}
            showCancel={true}
            onCancel={() => setShowDeleteConfirmation(false)}
            onConfirm={onDeleteConfirm}
          /> */}
          <AlertPopUp
            show={showPopUpValue}
            message={popUpMsg && popUpMsg}
            title={handleTitle(
              isRecover
                ? "recoverServicePoint"
                : isSendBackLink
                ? "sendBacklink"
                : "deleteServicePoint"
            )}
            success={popUpType === "success"}
            warning={popUpType === "warning"}
            danger={popUpType === "danger"}
            disabled={popUpType === "loading"}
            showCancel={popUpType === "warning"}
            confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
            onConfirm={handleOnConfirmButton}
            onCancel={handleOnCancelButton}
          />
          <Modal isOpen={showSalesNotesPopup}>
            <ModalHeader>
              <Col sm={{ size: 11 }}>
                <IntlMessages id="comments.table.salesNotes" />
              </Col>
              <Col sm={{ size: 1 }}>
                <IconButton
                  onClick={() => {
                    setShowSalesNotesPopup(false);
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Col>
            </ModalHeader>
            <ModalBody>
              <TextField
                id="multiline-flexible"
                multiline
                rows="10"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                margin="normal"
                fullWidth
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSalesNotesSave()}
              >
                <IntlMessages id="callQueueListEdit.save" />
                {savingStatus && <Spinner color={"info"} size="sm" />}
              </Button>
            </ModalFooter>
          </Modal>
          {/* </Link> */}
        </div>
      ) : isLoading && !errorMsg ? (
        <Spinner color={"primary"} />
      ) : (
        <h2>Company {errorMsg}</h2>
      )}
    </React.Fragment>
  );
};

export default injectIntl(CompaniesSharedInfo);
