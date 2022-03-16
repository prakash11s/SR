import React, { useEffect, useState } from "react";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import {
  getEmployeeList,
  createEmployeeAction,
  deleteEmployeeAction,
  employeeNotificationSettingsAction,
} from "../../actions/Actions/EmployeeAction";
import EmployeeTable from "./EmployeeTable";
import { useParams, useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import CloseIcon from "@material-ui/icons/Close";
import softPhoneService from "../Phone/softPhone.service";
import SipCallService from "../Phone/SipCallService";
import IntlMessages from "util/IntlMessages";
import { Button, Modal, ModalHeader } from "reactstrap";
import { IconButton, TextField } from "@material-ui/core";
import AlertPopUp from "common/AlertPopUp";

/**
 * Component for EmployeeList
 * @returns {*}
 * @constructor
 */
const EmployeeList = (props: any) => {
  /**
   * handle State for EmployeeList
   */
  const [limit, setLimit] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const [employeeModal, setEmployeeModal] = useState<boolean>(false);
  const [sweetAlertDelete, setSweetAlertDelete] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [createError, setCreateError] = useState<string>("");
  const [sweetAlert, setSweetAlert] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [popUpType, setPopUpType] = useState<string>("");
  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [popUpMsg, setPopUpMsg] = useState<string>("");

  /**
   * get employee id from params
   * */
  const { activeTabId, activeTab }: any = useParams();

  /**
   * Created dispatch for to dispatch actions
   */
  const dispatch = useDispatch();

  /**
   * get employee list state from redux
   * */
  const employeePayload = useSelector((state: any) => state.employeeState);
  const employee = employeePayload.employee;
  const meta = employeePayload.meta;

  /**
   * Created history for handle routes
   */
  const history = useHistory();

  /**
   * handle for employee list
   */
  useEffect(() => {
    dispatch(getEmployeeList(props.match.params.id, limit, page));
  }, [sweetAlert, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * handle selected employee
   */
  useEffect(() => {
    if (activeTabId && employee && employee.length) {
      selectEmployee(parseInt(activeTabId));
    }
  }, [activeTabId, employee]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = ({ page, limit }) => {
    dispatch(getEmployeeList(props.match.params.id, limit, page + 1));
  };

  /**
   * handle row click
   * @param employeeId
   */
  const onRowClick = (employeeId: number) => {
    history.push(`${activeTab}/${employeeId}`);
  };

  /**
   * handle employee detail modal
   */
  const onToggleModal = () => {
    setEmployeeModal(false);
    history.goBack();
  };

  /**
   * select employee info based on employeeId
   * @param employeeId
   */
  const selectEmployee = (employeeId: number) => {
    const employeeSelected = employee.find(
      (employee: any) => employee.id === employeeId
    );
    setSelectedEmployee(employeeSelected);
    setEmployeeModal(true);
  };

  /**
   *
   * @param SweetAlert delete event handler
   * @param employeeId
   */
  const deleteEmployeeConfirm = (
    e: React.MouseEvent<HTMLElement>,
    employeeId: number
  ) => {
    e.stopPropagation();
    setEmployeeId(employeeId);
    setSweetAlertDelete(true);
  };

  const handleNotificationSetting = (
    e: React.MouseEvent<HTMLElement>,
    userId: number,
    status: boolean
  ) => {
    e.stopPropagation();
    setShowPopUpValue(true);
    setPopUpType("loading");
    dispatch(
      employeeNotificationSettingsAction(
        props.match.params.id,
        userId,
        status,
        (status, msg) => {
          if (status) {
            setPopUpType("success");
          } else {
            setPopUpType("danger");
            setPopUpMsg(msg);
          }
        }
      )
    );
  };

  /**
   * delete employee based on employeeId
   * @param employeeId
   */
  const deleteEmployee = (employeeId: number) => {
    dispatch(
      deleteEmployeeAction(props.match.params.id, employeeId, (status, res) => {
        if (status) {
          setDeleteError("");
          dispatch(getEmployeeList(props.match.params.id, limit, page));
        } else {
          setDeleteError(res);
        }
        setIsCreate(false);
        setSweetAlertDelete(false);
        setSweetAlert(true);
      })
    );
    if (employeeModal) {
      onToggleModal();
    }
  };

  const createEmployee = () => {
    if (!email) return;
    dispatch(
      createEmployeeAction(props.match.params.id, { email }, (status, res) => {
        if (status) {
          setCreateError("");
          dispatch(getEmployeeList(props.match.params.id, limit, page));
        } else {
          setCreateError(res);
        }
        setEmail("");
        setIsCreate(true);
        setSweetAlert(true);
        toggleShowCreateModal();
      })
    );
  };

  const getPhoneCallData = (id: number, phone: string) => ({
    id,
    phoneNumber: phone,
    type: "call-company-employee",
  });

  const callPhone = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: number,
    phone: string
  ) => {
    e.stopPropagation();
    SipCallService.startCall(getPhoneCallData(id, phone));
    //softPhoneService.connectCall(getPhoneCallData(id, phone));
  };

  const toggleShowCreateModal = () => setShowCreateModal(!showCreateModal);

  const handleOnCancelButton = () => {
    setShowPopUpValue(false);
    setPopUpType("");
    setPopUpMsg("");
  };

  const handleTitle = () => {
    if (popUpType === "success") {
      return <IntlMessages id="sweetAlerts.notificationSuccess" />;
    } else if (popUpType === "danger") {
      return <IntlMessages id="sweetAlerts.notificationFail" />;
    } else {
      return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
    }
  };

  const handleOnConfirmButton = () => {
    if (popUpType === "success") {
      setShowPopUpValue(false);
      setPopUpMsg("");
      setPopUpType("");
      dispatch(getEmployeeList(props.match.params.id, limit, page));
    } else {
      setShowPopUpValue(false);
    }
  };

  return (
    <React.Fragment>
      <SweetAlert
        show={sweetAlertDelete}
        warning
        showCancel
        confirmBtnText="Delete"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Delete !"
        onConfirm={() => deleteEmployee(employeeId)}
        onCancel={() => setSweetAlertDelete(false)}
      >
        <IntlMessages id="sweetAlerts.deleteEmployee" />
      </SweetAlert>
      <AlertPopUp
        title={handleTitle()}
        show={showPopUpValue}
        message={popUpMsg && popUpMsg}
        success={popUpType === "success"}
        danger={popUpType === "danger"}
        disabled={popUpType === "loading"}
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={handleOnConfirmButton}
        onCancel={handleOnCancelButton}
      />
      <SweetAlert
        show={sweetAlert}
        success={isCreate ? !createError : !deleteError}
        error={isCreate ? createError : deleteError}
        title={isCreate ? createError : deleteError ? "Fail" : "Success"}
        confirmBtnText="Okay"
        onConfirm={() => {
          setSweetAlert(false);
          setCreateError("");
          setDeleteError("");
        }}
      >
        {isCreate ? (
          createError ? (
            <IntlMessages id="sweetAlerts.createEmployeeFailed" />
          ) : (
            <IntlMessages id="sweetAlerts.createEmployeeSuccess" />
          )
        ) : deleteError ? (
          <IntlMessages id="sweetAlerts.deleteEmployeeFail" />
        ) : (
          <IntlMessages id="sweetAlerts.deleteEmployeeSuccess" />
        )}
      </SweetAlert>

      <EmployeeDetailsModal
        employeeData={selectedEmployee as any}
        deleteClick={deleteEmployeeConfirm}
        isOpen={employeeModal}
        toggle={onToggleModal}
        callPhone={callPhone}
      />
      {employee && (
        <EmployeeTable
          meta={meta}
          onRowClick={onRowClick}
          dataList={employee}
          deleteEmployee={deleteEmployeeConfirm}
          notificationAction={handleNotificationSetting}
          callPhone={callPhone}
          onChange={fetchData}
          toggleCreateModal={toggleShowCreateModal}
        />
      )}
      <Modal
        isOpen={showCreateModal}
        toggle={toggleShowCreateModal}
        style={{ maxWidth: "500px" }}
      >
        <ModalHeader className="modal-box-header bg-primary text-white">
          <IntlMessages id="employeeTables.createEmployee" />
          <IconButton className="text-white">
            <CloseIcon onClick={toggleShowCreateModal} />
          </IconButton>
        </ModalHeader>
        <div className="pl-4 pr-4 pb-3 pt-3">
          <TextField
            className="mt-0 mb-4"
            label="Email Address"
            margin="normal"
            fullWidth
            type="text"
            name="ability_name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="d-flex justify-content-end">
            <Button
              size="small"
              onClick={toggleShowCreateModal}
              className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
              color="primary"
            >
              <IntlMessages id="sweetAlerts.cancelButton" />
            </Button>
            <Button
              size="small"
              className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-info text-white"
              color="primary"
              onClick={createEmployee}
            >
              <IntlMessages id="orderDetailViewTable.create" />
            </Button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default EmployeeList;
