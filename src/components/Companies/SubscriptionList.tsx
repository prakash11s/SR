import React, { useEffect, useState } from "react";
import {
  createSubscription,
  getSubscription,
  getSubscriptionPlanDetail,
  cancelSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlans,
  getStatistiscsSubscriptionPlanDetail,
  getStatistiscsAllData,
} from "actions/Actions/ComapaniesActions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Col, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  InputLabel,
  TextField,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import "./Styles/SubscriptionList.scss";
import { makeStyles } from "@material-ui/core/styles";
import IntlMessages from "../../util/IntlMessages";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import UserHasPermission from "../../util/Permission";
import AlertPopUp from "../../common/AlertPopUp";
import PaginationTable from "../../common/PaginationTable";
import { DatePicker } from "material-ui-pickers";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
    marginBottom: "20px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SubscriptionList: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();

  /**
   * get subscription state from redux
   * */
  const subscriptions = useSelector(
    (state: any) => state.companyState.subscriptions
  );
  const subscriptionList = subscriptions.subscriptionList;
  const loading = subscriptions.loading;
  const meta = subscriptions.meta;
  const classes = useStyles();
  const error = subscriptions.error;
  const [modal, setModal] = useState<boolean>(false);
  const [modalLoader, setModalLoader] = useState<boolean>(true);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any>([]);
  const [subscriptionPlanDetail, setSubscriptionPlanDetail] = useState<any>([]);
  const [subscriptionError, setSubscriptionError] = useState<any>("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [currency, setCurrency] = useState<any>("");
  const [discount, setDiscount] = useState<any>(0);
  const [extend, setExtend] = useState<boolean>(false);
  const [cancel, setCancel] = useState<boolean | string>(false);
  const [statics, setStatics] = useState<boolean>(false);
  const [showAllData, setShowAllData] = useState<boolean>(false);
  const [staticsData, setStaticsData] = useState<any>();
  const [popUpType, setPopUpType] = useState<any>("warning");
  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [showCancelPopUpData, setShowCancelPopUpData] = useState<any>(false);
  const [extendError, setExtendError] = useState<any>("");

  const [periodStartDate, setPeriodStartDate] = useState<moment.Moment>(
    moment(
      moment(new Date())
        .add(1, "minute")
        .format("YYYY-MM-DD")
    )
  );
  
  const [minimumDate, setMinimumDate] = useState<{
    start: moment.Moment;
    end: moment.Moment;
  }>({
    start: moment(
      moment(new Date())
        .add(1, "minute")
        .format("YYYY-MM-DD")
    ),
    end: moment(
      moment(new Date())
        .add(1, "y")
        .format("YYYY-MM-DD")
    ),
  });
  const [periodEndDate, setPeriodEndDate] = useState<moment.Moment>(
    moment(
      moment(new Date())
        .add(1, "y")
        .format("YYYY-MM-DD")
    )
  );
  const [extendDetails, setExtendDetails] = useState<any>({});
  const [minimumExtendDate, setMinimumExtendDate] = useState<{
    start: moment.Moment;
    end: moment.Moment;
  }>({
    start: moment(
      moment(new Date())
        .add(1, "minute")
        .format("YYYY-MM-DD")
    ),
    end: moment(
      moment(new Date())
        .add(1, "y")
        .format("YYYY-MM-DD")
    ),
  });

  useEffect(() => {
    fetchData({ page: 0, limit: 10 });
  }, [dispatch]);

  /**
   *
   * @param page
   * @param limit
   */
  const fetchData = ({ page, limit }) => {
    dispatch(getSubscription(props.match.params.id, page + 1, limit));
  };

  const cancelSubscription = () => {
    setPopUpType("loading");
    setShowPopUpValue(true);
    dispatch(
      cancelSubscriptionPlan(
        showCancelPopUpData.model_id,
        showCancelPopUpData.id,
        (response, data) => {
          if (response) {
            fetchData({ page: 0, limit: 10 });
          }
          response ? setPopUpType("success") : setPopUpType("danger");
        }
      )
    );
    setShowCancelPopUpData(false);
  };

  const deleteSubscription = () => {
    setPopUpType("loading");
    setShowPopUpValue(true);
    dispatch(
      deleteSubscriptionPlan(
        showCancelPopUpData.model_id,
        showCancelPopUpData.id,
        (response, data) => {
          if (response) {
            fetchData({ page: 0, limit: 10 });
          }
          response ? setPopUpType("success") : setPopUpType("danger");
        }
      )
    );
    setShowCancelPopUpData(false);
  };

  const onExtendHandle = (data: any) => {
      setExtendDetails({
        planId: data.plan_id,
        period_start: data.extendable_periods.period_start,
        period_end: data.extendable_periods.period_end,
        extension_of: data.id,
      });

    setMinimumExtendDate({
      ...minimumExtendDate,
      end: moment(
        moment(data.active_until)
          .add(
            new Date(data.active_until).getFullYear() -
            new Date(data.active_from).getFullYear(),
            "y"
          )
          .format("YYYY-MM-DD")
      ),
    });
    dispatch(
      getSubscriptionPlans((response, data) => {
        response ? setSubscriptionPlans(data.data) : setSubscriptionError(data);
        setModalLoader(false);
      })
    );
    dispatch(
      getSubscriptionPlanDetail(data.plan_id, (response, data) => {
        response
          ? setSubscriptionPlanDetail(data.data)
          : setSubscriptionError(data);
        setTableLoader(false);
      })
    );
    setModal(true);
    setExtend(true);
    setModalLoader(false);
    setTableLoader(true);
  };

  const getAllData = () => {
    setStaticsData(null);
    setShowAllData(true);
    dispatch(
      getStatistiscsAllData(props.match.params.id, (response, data) => {
        if (response) {
          setStaticsData({ statistics: data.data });
        } else {
          setStaticsData({ error: data });
        }
      })
    );
  };

  const onStaticsHandle = (data: any) => {
    setStaticsData(null);
    setStatics(true);
    dispatch(
      getStatistiscsSubscriptionPlanDetail(
        props.match.params.id,
        data.id,
        (response, data) => {
          if (response) {
            setStaticsData(data.data);
          } else {
            setStaticsData({ error: response });
          }
        }
      )
    );
  };

  const renderOrderAction = (data) => {
    return (
      <>
        {data.active && (
          <UserHasPermission permission="subscription-service-cancel-subscription">
            <Button
              onClick={() => {
                setCancel("cancel");
                setShowCancelPopUpData(data);
              }}
              variant="contained"
              className="jr-btn bg-danger text-white m-1"
            >
              <IntlMessages id="paginationTable.cancelSubscriptions" />
            </Button>
          </UserHasPermission>
        )}
        {!data.is_expired && (
          <UserHasPermission permission="subscription-service-delete-subscription">
            <Button
              onClick={() => {
                setCancel("delete");
                setShowCancelPopUpData(data);
              }}
              variant="contained"
              className="jr-btn bg-danger text-white"
            >
              <IntlMessages id="button.delete" />
            </Button>
          </UserHasPermission>
        )}
        {data.is_extendable && (
          <UserHasPermission permission="subscription-service-create-subscription">
            <Button
              onClick={() => onExtendHandle(data)}
              variant="contained"
              className="jr-btn bg-blue-grey text-white m-1"
            >
              <IntlMessages id="paginationTable.extend" />
            </Button>
          </UserHasPermission>
        )}
        <Button
          onClick={() => onStaticsHandle(data)}
          variant="contained"
          className="jr-btn bg-warning text-white"
        >
          <IntlMessages id="paginationTable.statics" />
        </Button>
      </>
    );
  };

  const renderLoading = <Spinner color="primary" className={"spinner"} />;
  const subscriptionColumns = [
    {
      name: "paginationTable.id",
      key: "id",
    },
    {
      name: "paginationTable.planName",
      key: "plan.name",
    },
    {
      name: "paginationTable.periodStart",
      key: "active_from",
      format: "paginationTable.datetime",
    },
    {
      name: "paginationTable.periodEnd",
      key: "active_until",
      format: "paginationTable.datetime",
    },
    {
      name: "paginationTable.createdAt",
      key: "created_at",
      format: "paginationTable.datetime",
      align: "right",
    },
    {
      name: "paginationTable.action",
      key: "action",
      align: "right",
      render: (data) => renderOrderAction(data),
    },
  ];

  const onToggle = (res) => {
    setModal(res);
    setModalLoader(res);
    setSelectedPlan(null);
    setTableLoader(false);
    setSubscriptionError("");
    setSubscriptionPlans([]);
    setSubscriptionPlanDetail([]);
    setPopUpType("loading");
    setCurrency("");
    setTotalAmount(0);
    setDiscount(0);
  };

  const onHandleCreateSubscription = () => {
    onToggle(true);
    setExtend(false);
    setExtendDetails({});
    dispatch(
      getSubscriptionPlans((response, data) => {
        response ? setSubscriptionPlans(data.data) : setSubscriptionError(data);
        setModalLoader(false);
      })
    );
  };

  const onSubscriptionChange = (plan) => {
    setDefaultPlanID(plan.id)
    setSelectedPlan(plan);
    setTableLoader(true);
    setSubscriptionError("");
    setCurrency("");
    setTotalAmount(0);
    setDiscount(0);
    setSubscriptionPlanDetail([]);
    if (plan.constraints.date) {
      setMinimumDate({
        start: moment(
          moment(plan.constraints.date.min)
            .add(1, "minute")
            .format("YYYY-MM-DD")
        ),
        end: plan.constraints.date.max
          ? moment(
            moment(plan.constraints.date.max)
              // .add(1, "y")
              .format("YYYY-MM-DD")
          )
          : moment(
            moment(plan.constraints.date.min)
              .add(plan.constraints.period_months, "M")
              .format("YYYY-MM-DD")
          ),
      });
      setPeriodEndDate(
        moment(
          moment(
            plan.constraints.date.max
              ? plan.constraints.date.max
              : plan.constraints.date.min
          )
            .add(
              plan.constraints.date.max ? 0 : plan.constraints.period_months,
              "M"
            )
            .format("YYYY-MM-DD")
        )
      );
    }
    dispatch(
      getSubscriptionPlanDetail(plan.id, (response, data) => {
        response
          ? setSubscriptionPlanDetail(data.data)
          : setSubscriptionError(data);
        setTableLoader(false);
      })
    );
  };

  useEffect(() => {

    if (subscriptionPlanDetail.length > 0) calculateTotalAmount();
  }, [subscriptionPlanDetail]);

  const calculateTotalAmount = () => {
    let total = 0;
    let currency =
      subscriptionPlanDetail[0] && subscriptionPlanDetail[0].currency === "EUR"
        ? "€"
        : "$";
    subscriptionPlanDetail.forEach((data: any) => {
      total += data.amount;
    });
    setCurrency(currency);
    setTotalAmount(total);
  };

  const handleTitle = () => {
    if (cancel === "cancel") {
      if (popUpType === "success") {
        return <IntlMessages id="subscription.cancelled" />;
      } else if (popUpType === "danger") {
        return <><IntlMessages id="subscription.cancelFail" />{extendError}</>;
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    } else if (cancel === "delete") {
      if (popUpType === "success") {
        return <IntlMessages id="subscription.deleted" />;
      } else if (popUpType === "danger") {
        return <IntlMessages id="subscription.deleteFail" />;
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    } else if (extend) {
      if (popUpType === "success") {
        return <IntlMessages id="subscription.extend" />;
      } else if (popUpType === "danger") {
        return <><IntlMessages id="subscription.failedExtend" /><h5 className="text-danger">{extendError}</h5></>;
      } else if (popUpType === "warning") {
        return <IntlMessages id="subscription.extendLabel" />;
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    } else {
      if (popUpType === "success") {
        return <IntlMessages id="subscription.success" />;
      } else if (popUpType === "danger") {
        return <><IntlMessages id="subscription.fail" /><h5 className="text-danger">{extendError}</h5></>;
      } else if (popUpType === "warning") {
        return <IntlMessages id="subscription.createLabel" />;
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    }
  };

  const handleOnCancelButton = () => {
    setShowPopUpValue(false);
    setPopUpType("");
  };

  const onSubmitHandler = () => {
    setPopUpType("warning");
    setShowPopUpValue(true);
  };

  const onConfirm = () => {
  
   
    let m = moment().utcOffset(0);
    //m.set({hour:0,minute:0,second:0,millisecond:0})
    m.toISOString();
    m.format();
    if (popUpType === "warning") {
      setPopUpType("loading");
      setShowPopUpValue(true);
     
      if (extend && defalutPlanID > 0 || defalutPlanID == undefined) {
       
        dispatch(
          createSubscription(
            {
              id: props.match.params.id,
              ...extendDetails,
              period_start: moment(extendDetails.period_start).format(
                "YYYY-MM-DD"
              ),
              period_end: moment(extendDetails.period_end).format("YYYY-MM-DD"),
              discount: discount * 100,
             
              
            },
            (response, data) => {
              if(response) {
                setPopUpType("success")
              } else {
                setPopUpType("danger")
                if(data?.errors?.plan_id){
                  setExtendError(data?.errors?.plan_id[0])
                }else if(data?.errors?.period_end){
                  setExtendError(data?.errors?.period_end[0])
                }else if(data?.errors?.period_start){
                  setExtendError(data?.errors?.period_start[0])
                }else{
                  setExtendError(data?.errors?.discount[0])
                }
              }
              //response ? setPopUpType("success") : setPopUpType("danger");
            },
            extend
          )
        );
      } else {
        dispatch(
          createSubscription(
            {
              id: props.match.params.id,
              planId: defalutPlanID,
              discount: discount * 100,
              period_start: periodStartDate.format("YYYY-MM-DD"),
              period_end: periodEndDate.format("YYYY-MM-DD"),
              extension_of:extendDetails.extension_of
            },
            (response, data) => {
              if(response) {
                setPopUpType("success")
              } else {
                setPopUpType("danger")
                if(data?.errors?.plan_id){
                  setExtendError(data?.errors?.plan_id[0])
                }else if(data?.errors?.period_end){
                  setExtendError(data?.errors?.period_end[0])
                }else if(data?.errors?.period_start){
                  setExtendError(data?.errors?.period_start[0])
                }else{
                  setExtendError(data?.errors?.discount[0])
                }
              }
              //response ? setPopUpType("success") : setPopUpType("danger");
            }
          )
        );
      }
    } else if (popUpType === "success") {
      setShowPopUpValue(false);
      setPopUpType("");
      fetchData({ page: 0, limit: 10 });
      onToggle(false);
    } else {
      setShowPopUpValue(false);
      setCancel(false);
    }
  };
  const inputChangeHandler = (date, fieldName) => {
    let value = moment(moment(date).format("Y-MM-DD HH:mm:ss"));
    switch (fieldName) {
      case "periodStartDate":
        setPeriodStartDate(value);
        setMinimumDate({
          ...minimumDate,
          end: selectedPlan.constraints.date.max
            ? moment(
              moment(selectedPlan.constraints.date.max)
                // .add(1, "y")
                .format("YYYY-MM-DD")
            )
            : moment(
              moment(value)
                .add(selectedPlan.constraints.period_months, "M")
                .format("YYYY-MM-DD")
            ),
        });
        break;
      case "periodEndDate":
        setPeriodEndDate(value);
        break;
      case "periodExtendStartDate":
        /*setExtendDetails({
          ...extendDetails,
          period_start: value,
        });*/
        break;
      case "periodExtendEndDate":
        setExtendDetails({
          ...extendDetails,
          period_end: value,
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    subscriptionPlanDetail.forEach((sub) =>
      setTotalAmount(sub.amount - discount! * 100)
    );
  }, [discount]);

  const onDiscountchangeHandler = (input) => {
    if (/^\d*\.\d{2}$|\d+|^$/.test(input)) {
      setDiscount(input);
    }
  };

  const handleSelectPlan = async (event: any, value: any) => {
    setDefaultPlan(value)
    setDefaultPlanID(value?.id)
  };

  const [defalutPlan, setDefaultPlan] =useState<any>('');
  const [defalutPlanID, setDefaultPlanID] =useState<any>('');

  useEffect(() => {
    setDefaultPlan('');
    if(extendDetails?.planId) {
      const plan = subscriptionPlans?.find(el => el?.id == extendDetails?.planId);
      setDefaultPlanID(plan?.id)
      setDefaultPlan(plan)
    }
  },[extendDetails?.planId, modal]);

  useEffect(() => {
    dispatch(
      getSubscriptionPlans((response, data) => {
        response ? setSubscriptionPlans(data.data) : setSubscriptionError(data);
        setModalLoader(false);
      })
    );
  }, [modal]);

  return (
    <>
      <div className="d-flex justify-content-end subscription-btns-wrap">
        <UserHasPermission permission="view-statistics">
          <Button variant="outlined" onClick={getAllData} color="primary">
            <IntlMessages id="subscription.allData" />
          </Button>
        </UserHasPermission>
        <UserHasPermission permission="subscription-service-create-subscription">
          <Button
            variant="outlined"
            onClick={onHandleCreateSubscription}
            color="primary"
          >
            <IntlMessages id="subscription.CreateButton" />
          </Button>

          <Modal isOpen={modal}>
            <ModalHeader>
              <Col sm={{ size: 11 }}>
                {extend ? (
                  <IntlMessages id="subscription.ExtendButton" />
                ) : (
                  <IntlMessages id="subscription.CreateButton" />
                )}
              </Col>
              <Col sm={{ size: 1 }}>
                <IconButton onClick={() => onToggle(false)}>
                  <CancelIcon />
                </IconButton>
              </Col>
            </ModalHeader>
            <ModalBody>
              {modalLoader ? (
                renderLoading
              ) : subscriptionPlans.length ? (
                <FormControl variant="outlined" className={classes.formControl}>
                  {extendDetails &&
                    extendDetails.planId &&
                    subscriptionPlans.findIndex(
                      (plan) => plan.id === extendDetails.planId
                    ) >= 0 ? (
                    <>
                      <Autocomplete
                        className="mb-2 mr-2 h-75 float-right"
                        id="emp-list"
                        value={defalutPlan}
                        options={subscriptionPlans}
                        getOptionLabel={(option: { name: string }) => `${option?.name}`}
                        style={{ width: 300, zIndex: 10000 }}
                        renderInput={(params) => <TextField {...params}
                          label={<IntlMessages id="subscription.PlanLabel" />}
                          variant="outlined" />
                        }
                        onChange={(event, value) => handleSelectPlan(event, value)}
                      />
                    </>
                  ) : (
                    <>
                      <InputLabel id="demo-simple-select-outlined-label">
                        <IntlMessages id="subscription.PlanLabel" />
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        onChange={(e) => onSubscriptionChange(e.target.value)}
                        label={<IntlMessages id="subscription.PlanLabel" />}
                      >
                        {subscriptionPlans &&
                          subscriptionPlans.map((plan) => {
                            return (
                              <MenuItem value={plan}>{plan.name}</MenuItem>
                            );
                          })}
                      </Select>
                    </>
                  )}
                </FormControl>
              ) : (
                <b className="d-flex justify-content-center">
                  <IntlMessages id="subscription.noSubscriptions" />
                </b>
              )}
              {tableLoader && renderLoading}
              {subscriptionError && (
                <div style={{ color: "red" }}>{subscriptionError}</div>
              )}
              {Boolean(subscriptionPlanDetail.length) && (
                <>
                  <div className="jr-card">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <b>
                              <IntlMessages id="subscription.Item" />
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              <IntlMessages id="subscription.Description" />
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              <IntlMessages id="subscription.Amount" />
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              <IntlMessages id="subscription.Currency" />
                            </b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subscriptionPlanDetail.map((data) => {
                          return (
                            <TableRow>
                              <TableCell>{data.name}</TableCell>
                              <TableCell>{data.description}</TableCell>
                              <TableCell>
                                {(data.amount / 100).toFixed(2)}
                              </TableCell>
                              <TableCell>{data.currency}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="jr-card">
                    <b>
                      <IntlMessages id="subscription.totalAmount" />
                    </b>
                    : {(totalAmount / 100).toFixed(2)}
                  </div>
                  <div className="jr-card">
                    <TextField
                      id="outlined-basic"
                      value={discount}
                      label={`${currency} Discount`}
                      variant="outlined"
                      placeholder={`${currency} 1000`}
                      onChange={(e) => onDiscountchangeHandler(e.target.value)}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <DatePicker
                        format="YYYY-MM-DD"
                        label={<IntlMessages id="subscription.PeriodStart" />}
                        value={
                          extend ? extendDetails.period_start : periodStartDate
                        }
                        minDate={
                          extend ? minimumExtendDate.start : minimumDate.start
                        }
                        inputVariant="outlined"
                        animateYearScrolling={false}
                        leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                        rightArrowIcon={
                          <i className="zmdi zmdi-arrow-forward" />
                        }
                        onChange={(date) =>
                          inputChangeHandler(
                            date,
                            extend ? "periodExtendStartDate" : "periodStartDate"
                          )
                        }
                        disabled={extend}
                      />
                      <DatePicker
                        format="YYYY-MM-DD"
                        value={
                          extend ? extendDetails.period_end : periodEndDate
                        }
                        minDate={
                          extend
                            ? moment(extendDetails.period_start)
                              .add(1, "d")
                              .format("YYYY-MM-DD")
                            : moment(periodStartDate)
                              .add(1, "d")
                              .format("YYYY-MM-DD")
                        }
                        maxDate={
                          extend
                            ? moment(new Date())
                              .add(99, "y")
                              .format("YYYY-MM-DD")
                            : minimumDate.end
                        }
                        label={<IntlMessages id="subscription.PeriodEnd" />}
                        animateYearScrolling={false}
                        leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                        rightArrowIcon={
                          <i className="zmdi zmdi-arrow-forward" />
                        }
                        onChange={(date) =>
                          inputChangeHandler(
                            date,
                            extend ? "periodExtendEndDate" : "periodEndDate"
                          )
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmitHandler}
                  >
                    <IntlMessages
                      id={
                        extend
                          ? "paginationTable.extend"
                          : "subscription.create"
                      }
                    />
                  </Button>
                </>
              )}
            </ModalBody>
          </Modal>
          <Modal isOpen={statics || showAllData}>
            <ModalHeader>
              <Col sm={{ size: 11 }}>
                <IntlMessages id="paginationTable.statics" />
              </Col>
              <Col sm={{ size: 1 }}>
                <IconButton
                  onClick={() => {
                    setStatics(false);
                    setShowAllData(false);
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Col>
            </ModalHeader>
            <ModalBody>
              {!staticsData ? (
                renderLoading
              ) : staticsData.error ? (
                <div style={{ color: "red" }}>{staticsData.error}</div>
              ) : (
                <>
                  {!showAllData && staticsData.plan && (
                    <>
                      <div className="jr-card">
                        <div>
                          <b>
                            <IntlMessages id="orderDetailViewTable.subscriptionId" />
                            :{" "}
                          </b>
                          {staticsData.plan.id}
                        </div>
                        <div>
                          <b>
                            <IntlMessages id="orderDetailViewTable.attachmentsName" />
                            :{" "}
                          </b>
                          {staticsData.plan.name}
                        </div>
                      </div>

                      <div className="jr-card">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <b>
                              <IntlMessages id="subscription.PeriodStart" />:{" "}
                            </b>
                            {moment(staticsData.active_from).format(
                              "MM-DD-YYYY HH:mm:ss"
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <b>
                              <IntlMessages id="subscription.PeriodEnd" />:{" "}
                            </b>
                            {moment(staticsData.active_until).format(
                              "MM-DD-YYYY HH:mm:ss"
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="jr-card">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <b>
                          <IntlMessages id="subscription.averagePrice" />:{" "}
                        </b>
                        {staticsData.statistics &&
                          (staticsData.statistics.average_price / 100).toFixed(
                            2
                          )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <b>
                          <IntlMessages id="paginationTable.totalPrice" />:{" "}
                        </b>
                        {staticsData.statistics &&
                          (staticsData.statistics.total_price / 100).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div style={{ flex: 1 }}>
                        <b>
                          <IntlMessages id="subscription.Amount" />:{" "}
                        </b>
                        {staticsData.statistics &&
                          staticsData.statistics.amount}
                      </div>
                      <div style={{ flex: 1 }}>
                        <b>
                          <IntlMessages id="subscription.totalOrders" />:{" "}
                        </b>
                        {staticsData.statistics &&
                          staticsData.statistics.total_orders}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </ModalBody>
          </Modal>
        </UserHasPermission>
      </div>
      <PaginationTable
        meta={meta}
        dataList={subscriptionList}
        columns={subscriptionColumns}
        loading={loading}
        onChange={fetchData}
        error={error}
      />

      <AlertPopUp
        show={showPopUpValue}
        title={handleTitle()}
        success={popUpType === "success"}
        warning={popUpType === "warning"}
        danger={popUpType === "danger"}
        showCancel={popUpType === "warning"}
        disabled={popUpType === "loading"}
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={onConfirm}
        onCancel={handleOnCancelButton}
      />
      <AlertPopUp
        show={!!showCancelPopUpData}
        title={
          cancel === "delete" ? (
            <IntlMessages id="sweetAlerts.deleteSubscription" />
          ) : (
            <IntlMessages id="sweetAlerts.cancelSubscription" />
          )
        }
        showCancel
        showOk
        warning={true}
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={
          cancel === "delete" ? deleteSubscription : cancelSubscription
        }
        onCancel={() => {
          setCancel(false);
          setShowCancelPopUpData(false);
        }}
      />
    </>
  );
};

export default SubscriptionList;