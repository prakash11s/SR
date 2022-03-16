import React, { useEffect, useState } from "react";
import {
  getPartnerEmployees,
  createPartnerEmployeeAction,
  deletePartnerEmployeeAction,
  notificationSettingPartnerEmployeeAction,
} from "../../actions/Actions/PartnerEmployeeActions";
import { useDispatch, useSelector } from "react-redux";
import EmployeeTable from "../Companies/EmployeeTable";
import SweetAlert from "react-bootstrap-sweetalert";
import EmployeeDetailsModal from "../Companies/EmployeeDetailsModal";
import IntlMessages from "util/IntlMessages";
import CloseIcon from "@material-ui/icons/Close";
import { Button, Modal, ModalHeader } from "reactstrap";
import { IconButton, TextField } from "@material-ui/core";
import AlertPopUp from "common/AlertPopUp";

/**
 * Component for EmployeeList
 * @returns {*}
 * @constructor
 */
const PartnerEmployees = (props: any) => {
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

  const [popUpType, setPopUpType] = useState<string>("");
  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [popUpMsg, setPopUpMsg] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const serviceId = localStorage.getItem("servicepoint");
  /**
   * Created dispatch for to dispatch actions
   */
  const dispatch = useDispatch();

  /**
   * get employee list state from redux
   * */
  const employee = useSelector((state: any) => state.employeeState.employee);

  /**
   * get meta state from redux
   * */
  const meta = useSelector((state: any) => state.employeeState.meta);

  /**
   * handle for employee list
   */
  useEffect(() => {
    if (serviceId) {
      dispatch(getPartnerEmployees(limit, page));
    }
  }, [sweetAlert, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = ({ page, limit }) => {
    dispatch(getPartnerEmployees(limit, page + 1));
  };

  /**
   * handle row click
   * @param employeeId
   */
  const onRowClick = (employeeId: number) => {
    setSelectedEmployee(
      employee.find((employee: any) => employee.id === employeeId)
    );
    setEmployeeModal(true);
  };

  /**
   * handle employee detail modal
   */
  const onToggleModal = () => {
    setEmployeeModal(false);
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

  /**
   * delete employee based on employeeId
   * @param employeeId
   */
  const deleteEmployee = (employeeId: number) => {
    if (serviceId) {
      dispatch(
        deletePartnerEmployeeAction(employeeId, (status, res) => {
          if (status) {
            setDeleteError("");
            dispatch(getPartnerEmployees(limit, page));
          } else {
            setDeleteError(res);
          }
          setSweetAlertDelete(false);
          setSweetAlert(true);
        })
      );

      if (employeeModal) {
        onToggleModal();
      }
    }
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
      notificationSettingPartnerEmployeeAction(
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

  const toggleShowCreateModal = () => setShowCreateModal(!showCreateModal);

  const createEmployee = () => {
    if (!email) return;
    dispatch(
      createPartnerEmployeeAction({ email }, (status, res) => {
        if (status) {
          setCreateError("");
          dispatch(getPartnerEmployees(limit, page));
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

  const emptyFunction = () => {};

  const handleOnConfirmButton = () => {
    if (popUpType === "success") {
      setShowPopUpValue(false);
      setPopUpMsg("");
      setPopUpType("");
      dispatch(getPartnerEmployees(limit, page));
    } else {
      setShowPopUpValue(false);
    }
  };

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

  return (
    <React.Fragment>
      <div className="margin20">
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
          callPhone={emptyFunction}
        />
        {employee && (
          <EmployeeTable
            meta={meta}
            onRowClick={onRowClick}
            dataList={employee}
            deleteEmployee={deleteEmployeeConfirm}
            notificationAction={handleNotificationSetting}
            callPhone={emptyFunction}
            onChange={fetchData}
            toggleCreateModal={toggleShowCreateModal}
          />
        )}
      </div>
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

export default PartnerEmployees;
