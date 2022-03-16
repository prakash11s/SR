import React, { useCallback, useEffect, useState } from "react";

import IntlMessages from "./../../util/IntlMessages";
import { Col, Container, Row, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getServicePointDetailAction,
  getServicePointListAction,
} from "../../actions/Actions/AssignServicePointAction";
import UserHasPermission from "../../util/Permission";
import ClearIcon from "@material-ui/icons/Clear";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AlertPopUp from "../../common/AlertPopUp";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import CloseIcon from "@material-ui/icons/Close";
import { getEmployeeList } from "actions/Actions/EmployeeAction";
import { createNewRejection } from "actions/Actions/OrderActions";
import { debounce } from "lodash";

const useStyles = makeStyles(() => ({
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
}));

const RejectionPrompt: React.FC<any> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { show } = props;

  const [servicePointId, setServicePointId] = useState<any>(
    props.servicePointId
  );
  const [servicePointLoading, setServicePointLoading] = useState<boolean>(true);
  const [comment, setComment] = useState<string>("");
  const [servicePointErrorMsg, setServicePointErrorMsg] = useState<string>("");
  const [servicePointDetail, setServicePointDetails] = useState<any>({});
  const [servicePointVisible, setServicePointVisible] = useState<boolean>(
    Boolean(servicePointId)
  );
  const [servicePointList, setServicePointList] = useState<any>([]);
  const [servicePointSearchLoading, setServicePointSearchLoading] = useState<
    boolean
  >(false);

  const [selectedEmployee, setSelectedEmployee] = useState<any>("");
  const [employeeList, setEmployeeList] = useState<any>([]);
  const [employeeSearchLoading, setEmployeeSearchLoading] = useState<boolean>(
    false
  );


  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [popUpType, setPopUpType] = useState<string>("warning");
  const [popUpMsg, setPopUpMsg] = useState<string>("");

  const [errorValidation, setErrorValidation] = useState({
    servicePointId: false,
    comment: false
  });

  const department = useSelector(
    (state: any) => state.department.selectedDepartment
  );

  const fetchServicePoint = (id: string) => {
    fetchEmployeeList(id);
    setServicePointDetails({});
    setServicePointLoading(true);
    dispatch(
      getServicePointDetailAction(id, (result: string, response: any) => {
        if (result === "success") {
          setServicePointDetails(response);
          setServicePointErrorMsg("");
          setServicePointVisible(true);
        } else {
          setServicePointErrorMsg(response);
          setServicePointDetails({});
        }
        setServicePointLoading(false);
      })
    );
  };

  useEffect(() => {
    if (props.servicePointId) {
      setServicePointId(props.servicePointId);
      setServicePointVisible(true);
      fetchServicePoint(props.servicePointId);
    } else {
      setServicePointId("");
      setServicePointVisible(false);
    }
    setServicePointList([]);
    setEmployeeList([]);

    return () => {
      setComment('');
    }
  }, [props.servicePointId]);

  const toggleServicePointVisible = () => {
    setServicePointVisible(!servicePointVisible);
  };

  const getOptions = (event: any) => {
    if (Boolean(event.target.value) && event.target.value.length > 1) {
      setServicePointSearchLoading(true);
      dispatch(
        getServicePointListAction(
          event.target.value,
          (result: string, response: any) => {
            setServicePointList(result === "success" ? response : []);
            setServicePointSearchLoading(false);
          }
        )
      );
    }
  };

  const debouncedChangeHandler = useCallback(debounce(getOptions, 1000), []);

  const fetchEmployeeList = (servicePointId) => {
    setEmployeeSearchLoading(true);
    dispatch(
      getEmployeeList(
        servicePointId,
        25,
        1,
        (status: Boolean, response: any) => {
          setEmployeeList(status ? response : []);
          setEmployeeSearchLoading(false);
        }
      )
    );
  };

  const getSelectedOption = (value: any) => {


    fetchEmployeeList(value.id);
    setErrorValidation({
      ...errorValidation,
      servicePointId: value ? false : true
    });
    setServicePointId(value.id);
    setServicePointDetails(value);
    setServicePointVisible(true);
    setErrorValidation({
      ...errorValidation,
      servicePointId: true,
      comment: true
    });
  };

  const checkValidation = () => {
    setErrorValidation({
      ...errorValidation,
      servicePointId: servicePointId ? false : true,
      comment: comment ? false : true,
    });
  }

  const createRejection = () => {

    Promise.resolve()
      .then(() => { checkValidation() })
      .then(() => {
        if (comment && servicePointId) {
          setShowPopUpValue(true);
          setPopUpType("warning");
          setPopUpMsg("");
        }
      })
  };

  const clearServiceId = () => {
    return (
      setServicePointId(''),
      setErrorValidation({
        ...errorValidation,
        servicePointId: false
      })
    )
  }

  const renderServicePoint = () => {
    return servicePointVisible ? (
      servicePointLoading &&
        !servicePointErrorMsg &&
        !Boolean(servicePointDetail.id) ? (
        <Spinner color="primary" />
      ) : !servicePointLoading &&
        servicePointErrorMsg &&
        !Boolean(servicePointDetail.id) ? (
        <h2>{servicePointErrorMsg}</h2>
      ) : (
        <Card className="mb-3">
          <CardHeader
            action={
              <IconButton
                color="primary"
                aria-label="add to shopping cart"
                onClick={toggleServicePointVisible}
              >
                <ClearIcon onClick={clearServiceId} />
              </IconButton>
            }
            title={servicePointDetail.name}
          />
          <CardMedia
            style={{
              height: 140,
            }}
            image={
              servicePointDetail.avatar
                ? servicePointDetail.avatar
                : department && department.image && department.image.small
            }
            title={servicePointDetail.name}
          />
          <CardContent>
            <h4>
              <IntlMessages id={"orderDetailViewTable.id"} /> :{" "}
              {servicePointDetail.id}
            </h4>
            <h4>
              <IntlMessages id={"partnerSettings.street"} /> :{" "}
              {servicePointDetail.street}
            </h4>
            <h4>
              <IntlMessages id={"partnerSettings.city"} /> :{" "}
              {servicePointDetail.city}
            </h4>
            <h4>
              <IntlMessages id={"partnerSettings.zipcode"} /> :{" "}
              {servicePointDetail.zip_code}
            </h4>
          </CardContent>
        </Card>
      )
    ) : (
      !servicePointVisible && (
        <>
          <Autocomplete
            className="w-100 h-75"
            options={servicePointList}
            getOptionLabel={(option: { name: string }) => option.name}
            style={{ width: 300, zIndex: 10000 }}
            loading={servicePointSearchLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<IntlMessages id="orderOptions.search-service-point" />}
                variant="outlined"
                error={errorValidation.servicePointId}
              />
            )}
            onInputChange={(event) => {
              event.persist();
              debouncedChangeHandler(event);
            }}
            onChange={(event, value) => getSelectedOption(value)}
          />
          <div className="text-danger">
            {errorValidation.servicePointId ? <IntlMessages id="rejectionPrompt.service" /> : ''}
          </div>

        </>
      )
    );
  };

  const renderEmployees = () => {
    return (
      <FormControl fullWidth>
        <Select
          label={<IntlMessages id="employee.select" />}
          value={selectedEmployee}
          disabled={!employeeList.length}
          variant="outlined"
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          {employeeList.map((employee) => (
            <MenuItem value={employee.user_id}>{employee.first_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const handleTitle = () => {
    if (popUpType === "warning") {
      return <IntlMessages id="sweetAlerts.createNewRejectionWarning" />;
    } else if (popUpType === "success") {
      return <IntlMessages id="sweetAlerts.createNewRejectionSuccess" />;
    } else if (popUpType === "danger") {
      return <IntlMessages id="sweetAlerts.createNewRejectionError" />;
    } else {
      return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
    }
  };

  const handleOnConfirmButton = () => {
    if (popUpType === "warning") {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        createNewRejection(
          props.orderId,
          {
            service_point_id: servicePointId,
            comment,
            user_id: selectedEmployee ? selectedEmployee : undefined,
          },
          (response: string, msg: string) => {
            setPopUpType(response);
            setPopUpMsg(msg);
            setShowPopUpValue(true);
          }
        )
      );
    } else if (popUpType === "success") {
      setShowPopUpValue(false);
      setPopUpType("");
      setServicePointDetails({});
      setSelectedEmployee("");
      setServicePointVisible(false);
      setComment("");
      props.onSuccess();
      props.onCancel(true);
    } else {
      setShowPopUpValue(false);
    }
  };

  const handleOnCancelButton = () => {
    return (
      setServicePointId(''),
      setErrorValidation({
        ...errorValidation,
        servicePointId: false
      }),
      setShowPopUpValue(false),
      setPopUpType(""),
      setPopUpMsg("")
    )
  };

  const onCloseAssignService = () => {
    props.onCancel(false);
  };

  return (
    <Dialog open={show} fullWidth={true} maxWidth={"md"}>
      <DialogTitle
        id="customized-dialog-title"
        style={{ borderBottom: "1px solid #bdbdbd" }}
      >
        <IntlMessages id="newRejection" />
        <IconButton
          className={classes.closeBtn}
          onClick={onCloseAssignService}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Container>
          <Row>
            <div className="col-sm-6 mb-4">
              {renderServicePoint()}
            </div>
            <div className="col-sm-6">
              {renderEmployees()}
            </div>
          </Row>
          <Row>
            <Col sm="12">
              <TextField
                error={errorValidation.comment}
                fullWidth
                label={<IntlMessages id="orderOptions.reason" />}
                variant="outlined"
                value={comment}
                onChange={(e) => {
                  setErrorValidation({
                    ...errorValidation,
                    comment: e.currentTarget.value ? false : true
                  }); setComment(e.currentTarget.value)
                }}
                rows={4}
                multiline
              />
              <div className="text-danger">
                {errorValidation.comment ? <IntlMessages id="rejectionPrompt.reason" /> : ''}
              </div>
            </Col>
          </Row>
        </Container>
        <AlertPopUp
          title={handleTitle()}
          show={showPopUpValue}
          message={popUpMsg && popUpMsg}
          success={popUpType === "success"}
          warning={popUpType === "warning"}
          danger={popUpType === "danger"}
          disabled={popUpType === "loading"}
          showCancel={popUpType === "warning"}
          confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
          onConfirm={handleOnConfirmButton}
          onCancel={handleOnCancelButton}
        />
      </DialogContent>
      <DialogActions style={{ borderTop: "1px solid #bdbdbd" }}>
        <UserHasPermission permission="booking-service-assign-order-to-service-point">
          <Button
            autoFocus
            variant="outlined"
            onClick={createRejection}
            color="primary"
          >
            <IntlMessages id="subscription.create" />
          </Button>
        </UserHasPermission>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionPrompt;
