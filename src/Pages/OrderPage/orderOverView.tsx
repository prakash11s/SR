import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router";
import { Badge, Col, Row, Spinner } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { Card, CardBody, CardText } from "reactstrap";
import {
  Button,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Tooltip,
  Table,
  IconButton,
  Grid,
} from "@material-ui/core";
import CachedhIcon from "@material-ui/icons/Cached";
import InfoIcon from "@material-ui/icons/Info";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Select from "react-select";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import {
  clearOrderOverview,
  getAdditionalDataAction,
  getNearByServicePointAction,
  getOrderOverView,
  getServicePointDetails,
  orderAction,
  getServicePointDissociationReason,
  requestServicePointDissociationReason,
  getOrderPreferredDates,
  getOrderRejections,
  getOrderPayments,
  createPreferredDate,
  deletePreferredDate,
  updatePreferredDate,
  deleteOrderComment,
  getDeliveryId,
  getOrderComments,
  sendPaymentLinkAction,
} from "actions/Actions/OrderActions";
import CancelOrder from "./cancelOrder";
import UserHasPermission from "../../util/Permission";
import axios from "../../util/Api";
import IntlMessages from "../../util/IntlMessages";
import Avatar from "@material-ui/core/Avatar";
import SipCallService from "../../components/Phone/SipCallService";
import Loader from "../../containers/Loader/Loader";
import AssignServicePointPrompt from "../../components/AssignServicePointPrompt/AssignServicePointPrompt";
import AlertPopUp from "../../common/AlertPopUp";
import {
  currencyConventor,
  readableDate,
  readableDateTimeLocale,
} from "../../util/helper";
import "./Style/orderOverViewStyle.css";
import RBACContext from "../../../src/rbac/rbac.context";
import OrderServices from "../../components/OrderServices";
import ServiceDissociationPrompt from "components/ServicePointDissociationPopup";
import PreferredDatesTable from "./preferredDatesTable";
import { ICreatePreferredDate } from "reducers/Interface/OrderInterface";
import { injectIntl } from "react-intl";
import AddOrderComment from "../../components/OrderComments/addComment";
import moment from "moment";
import { Link } from "react-router-dom";
import { getSubscriptionPlans } from "actions/Actions/ComapaniesActions";
import PaymentList from "components/PaymentList";
import CallQueueOverviewTable from "./callRecordings";
import EmailsList from "./emailList";
import RejectionPrompt from "components/RejectionPrompt";

const OrderOverView = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams() as any;
  const history = useHistory();
  const orders = useSelector((state: any) => state.orderState.order);
  const preferred_dates = useSelector(
    (state: any) => state.orderState.preferredDates
  );
  const reasons = useSelector(
    (state: any) => state.orderState.service_point_dissociation.reason
  );
  const service_point_details = useSelector(
    (state: any) => state.orderState.service_point_details
  );
  const department = useSelector(
    (state: any) => state.department.selectedDepartment
  );
  const service_points = useSelector(
    (state: any) => state.orderState.service_points
  );
  const callState = useSelector((state: any) => state.softPhone.Call);
  const { userCan, abilities } = useContext<any>(RBACContext);

  const limitList = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "25", value: "25" },
  ];

  const max_distance = [
    { label: "9KM", value: "9000" },
    { label: "20KM", value: "20000" },
    { label: "30KM", value: "30000" },
    { label: "50KM", value: "50000" },
  ];

  const [orderOverview, setOrderOverview] = useState<any>({});
  const [servicePoints, setServicePoints] = useState<any>([]);
  const [comments, setComment] = useState<any>([]);
  const [plans, setPlans] = useState<any>([]);
  const [servicePointDetails, setServicePointsDetails] = useState<any>({});
  const [cancelOrderPopUp, setCancelOrderPopUp] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [successPopup, setSuccessPopup] = useState<boolean>(false);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const [checkedData, setCheckedData] = useState<any>([]);

  const [isServicePointLoading, setIsServicePointLoading] = useState(true);
  const [servicePointError, setServicePointError] = useState<string>("");

  const [distanceDropdown, setDistanceDropdown] = useState<boolean>(false);
  const [distance, setDistance] = useState<string>(max_distance[0].value);
  const [selectedDistance, setSelectedDistance] = useState<string>(
    max_distance[0].value
  );

  const [limitDropdown, setLimitDropdown] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<string>(
    limitList[0].value
  );

  const [orderError, setOrderError] = useState<string>("");
  const [reasonIdRequiredError, setReasonIdRequiredError] = useState<boolean>(
    false
  );

  const [
    dissociationRequestAcknowledgement,
    setDissociationRequestAcknowledgement,
  ] = useState<string>("");
  const [createPreferredDateError, setCreatePreferredDateError] = useState<
    string
  >("");
  const [updatePreferredDateError, setUpdatePreferredDateError] = useState<
    string
  >("");
  const [deletePreferredDateError, setDeletePreferredDateError] = useState<
    string
  >("");
  const [servicePointDetailsError, setServicePointDetailsError] = useState<
    string
  >("");
  const [assignVisible, setAssignVisible] = useState<boolean>(false);
  const [hideServicePoint, setHideServicePoint] = useState<boolean>(false);
  const [servicePoint, setServicePoint] = useState<number>(0);

  const [additional_data, setAdditional_data] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const editVisibleList = [
    "draft",
    "awaiting_confirmation",
    "on_hold",
    "scheduled",
    "awaiting_completion",
    "awaiting_payment",
  ];
  const deleteVisibleList = [...editVisibleList];
  const cancelVisibleList = [...editVisibleList];
  const sendCallbackVisibleList = [
    ...deleteVisibleList,
    "cancelled",
    "processing",
  ];

  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [popUpType, setPopUpType] = useState<string>("warning");
  const [popUpMsg, setPopUpMsg] = useState<string>("");
  const [callNumber, setCallNumber] = useState<string>("");
  const [callName, setCallName] = useState<string>("");
  const [callImage, setCallImage] = useState<any>(null);
  const [callAlert, setCallAlert] = useState<boolean>(false);
  const [dissociationReasonAlert, setDissociationReasonAlert] = useState<
    boolean
  >(false);
  const [showCancelPopup, setShowCancelPopup] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const [showOrdersPopup, setShowOrdersPopup] = useState<boolean>(false);
  const [
    servicePointDissociationPopup,
    setServicePointDissociationPopup,
  ] = useState<boolean>(false);
  const [dissociationReasonObj, setDissociationReasonObj] = useState<any>(null);
  const [preferredDates, setPreferredDates] = useState<any>([]);
  const [preferredDateError, setPreferredDateError] = useState<string>("");
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [rejectedOrdersError, setRejectedOrdersError] = useState("");
  const [getOrderPaymentError, setGetOrderPaymentError] = useState("");
  const [rejectionLoading, setRejectionLoading] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [showCreateNewComment, setCreateNewComment] = useState<boolean>(false);
  const [editCommentData, setEditCommentData] = useState<any>(null);
  const [deleteCommentId, setDeleteCommentData] = useState<string>("");
  const [showDeletePopup, setDeleteCommentPopup] = useState<boolean>(false);
  const [errorCommentPopup, setErrorCommentPopup] = useState<boolean>(false);
  const [showRejectionPrompt, setShowRejectionPrompt] = useState<boolean>(
    false
  );

  const [subscriptions, setSubscriptions] = useState<any>([
    { value: "all", label: "All" },
  ]);
  const [activeSubscription, setActiveSubscription] = useState<boolean>(false);
  const [selectedPlans, setSelectedPlans] = useState<any>([]);

  const geocoder = new google.maps.Geocoder();
  const localDateTimeFormat = props.intl.formatMessage({
    id: "localeDateTime",
    defaultMessage: "DD-MM-YYYY hh:mm:ss",
  });

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id);
      fetchOrderComments(id);
    }
    return () => {
      dispatch(clearOrderOverview());
    };
  }, []);

  useEffect(() => {
    if (createPreferredDateError !== "") {
      createPreferredDateError === "success"
        ? NotificationManager.success("Preferred date is added successfully")
        : NotificationManager.error(createPreferredDateError);
    }
  }, [createPreferredDateError]);

  useEffect(() => {
    if (dissociationRequestAcknowledgement === "dissociation_success") {
      setOrderOverview({});
      setDissociationReasonObj(null);
      onAssignServicePromptClose(true);
    } else {
      dissociationRequestAcknowledgement !== "" &&
        NotificationManager.error(dissociationRequestAcknowledgement);
    }
  }, []);

  useEffect(() => {
    if (deletePreferredDateError !== "") {
      deletePreferredDateError === "success"
        ? NotificationManager.success("Preferred date is removed successfully")
        : NotificationManager.error(deletePreferredDateError);
    }
  }, [deletePreferredDateError]);

  useEffect(() => {
    if (updatePreferredDateError !== "") {
      updatePreferredDateError === "success"
        ? NotificationManager.success("Preferred date is Updated successfully")
        : NotificationManager.error(updatePreferredDateError);
    }
  }, [updatePreferredDateError]);

  useEffect(() => {
    setPreferredDates(preferred_dates);
  }, [preferred_dates]);

  useEffect(() => {
    if (id) {
      history.push(`/support/orders/${id}`);
    }
  }, []);

  const fetchOrderDetails = (id: string) => {
    dispatch(getOrderOverView(id, (msg: string) => setOrderError(msg)));
    dispatch(
      getOrderPreferredDates(id, (msg: string) => setPreferredDateError(msg))
    );
    fetchOrderRejections(id);
    fetchOrderPayments(id);
  };

  const fetchOrderRejections = (id) => {
    setRejectionLoading(true);
    dispatch(
      getOrderRejections(id, (status, res) => {
        setRejectionLoading(false);
        if (status) {
          setRejectedOrdersError("");
          setRejectedOrders(res.data);
        } else {
          setRejectedOrdersError(res);
        }
      })
    );
  };

  const fetchOrderPayments = (id) => {
    setPaymentLoading(true);
    setGetOrderPaymentError("");
    dispatch(
      getOrderPayments(id, (status, res) => {
        setPaymentLoading(false);
        if (status) {
          setPaymentList(res.data);
        } else {
          setGetOrderPaymentError(res);
        }
      })
    );
  };

  useEffect(() => {
    if (department && department.slug) {
      setSelectedDepartment(department.slug);
    }
  }, [department]);

  useEffect(() => {
    dispatch(
      getSubscriptionPlans((response, data) => {
        if (response) setPlans(data.data);
      })
    );
  }, []);

  useEffect(() => {
    if (selectedDistance && Boolean(orderOverview.id)) {
      setCallName(orderOverview.name);
      setCallNumber(orderOverview.phone);
      getNearByServicePoint();
    }
  }, [selectedDistance, selectedLimit]);

  const [deliveryId, setDeliveryId] = useState<any>(null);
  useEffect(() => {
    let data = orders && orders.additional_data;
    if (data) {
      for (let i of data) {
        if (i.key === "delivery_option_id") {
          dispatch(
            getDeliveryId(i.value, (status: string, response: any) => {
              if (status === "success") {
                setDeliveryId(response);
              }
            })
          );
          break;
        }
      }
    }
  }, [orders && orders.additional_data]);

  useEffect(() => {
    if (Boolean(orders)) {
      if (orders.additional_data && orders.additional_data.length > 0) {
        if (selectedDepartment !== "") {
          if (orders.service_point_id) {
            fetchServicePointDetails(orders.service_point_id);
          }
          if (selectedDepartment === "vehicles") {
            let license: string = "";
            let vehicleId: string = "";
            let constructionYear: string = "";
            let paymentMethod = {};
            orders.additional_data.forEach((data: any) => {
              if (data.key === "license-plate") {
                license = data.value ? data.value : "";
              }
              if (data.key === "vehicle_id") {
                vehicleId = data.value ? data.value : "";
              }
              if (data.key === "construction_year") {
                constructionYear = data.value ? data.value : "";
              }
              if (data.key === "payment_method") {
                paymentMethod = data["json_value"];
              }
            });
            fetchAdditionalData(
              selectedDepartment,
              license,
              vehicleId,
              constructionYear,
              paymentMethod
            );
          } else if (selectedDepartment === "couriers") {
            const details = {
              routeInfo: {},
              senderDetails: {},
              receiverDetails: {},
              routeInfoDetails: {},
              dimensionsDetails: {},
              paymentMethod: {},
            };
            let routeInfo,
              vehicleDetails,
              cargoDetails = null;
            orders.additional_data.forEach((data: any) => {
              if (data.key === "route_information") {
                routeInfo = data;
                details.routeInfoDetails = data["json_value"];
              } else if (data.key === "sender_details") {
                details.senderDetails = data["json_value"];
              } else if (data.key === "receiver_details") {
                details.receiverDetails = data["json_value"];
              } else if (data.key === "payment_method") {
                details.paymentMethod = data["json_value"];
              } else if (data.key === "dimensions") {
                details.dimensionsDetails = data["json_value"];
              } else if (data.key === "transportation_vehicle_id") {
                getVehicleName(data["json_value"]["id"]).then((res) => {
                  vehicleDetails = res.data.data.name;
                  setAdditional_data((prevState) => {
                    return {
                      ...prevState,
                      vehicleDetails,
                    };
                  });
                });
              } else if (data.key === "cargo_type_id") {
                getCargoName(data["json_value"]["id"]).then((res) => {
                  cargoDetails = res.data.data.name;
                  setAdditional_data((prevState) => {
                    return {
                      ...prevState,
                      cargoDetails,
                    };
                  });
                });
              }
            });
            setAdditional_data((prevState) => {
              return {
                ...prevState,
                ...details,
              };
            });

            if (routeInfo) {
              getAddressData(
                routeInfo["json_value"]["origin"]["place_id"],
                "from"
              );
              getAddressData(
                routeInfo["json_value"]["destination"]["place_id"],
                "to"
              );
            }
          } else {
            let paymentMethod = {};
            orders.additional_data.forEach((data: any) => {
              if (data.key === "payment_method") {
                paymentMethod = data["json_value"];
              }
            });
            setAdditional_data((prevState) => {
              return {
                ...prevState,
                paymentMethod,
              };
            });
          }
        }
      }
      setOrderOverview(orders);
    }
  }, [orders, selectedDepartment]);

  useEffect(() => {
    if (orderOverview && orderOverview.id) {
      getNearByServicePoint();
    }
  }, [orderOverview]);

  const getNearByServicePoint = () => {
    if (
      orderOverview &&
      orderOverview.status.name.toUpperCase() === "ON_HOLD"
    ) {
      setIsServicePointLoading(true);
      setServicePointError("");
      dispatch(
        getNearByServicePointAction(
          id,
          selectedDistance,
          selectedLimit,
          selectedPlans,
          activeSubscription,
          (type: string, msg: string) => {
            switch (type) {
              case "loading": {
                setIsServicePointLoading(true);
                setServicePointError(msg);
                break;
              }
              case "success": {
                setIsServicePointLoading(false);
                setServicePointError(msg);
                break;
              }
              case "fail": {
                setSelectedLimit(limitList[0].value);
                setSelectedDistance(max_distance[0].value);
                setIsServicePointLoading(false);
                setServicePointError(msg);
                break;
              }
            }
          }
        )
      );
    }
  };

  const fetchServicePointDetails = (id: string) => {
    dispatch(
      getServicePointDetails(id, (msg: string) =>
        setServicePointDetailsError(msg)
      )
    );
  };

  useEffect(() => {
    if (service_point_details) {
      setServicePointsDetails(service_point_details);
    }
  }, [service_point_details]);

  const getAddressData = (placeId: string, type: string) => {
    geocoder.geocode({ placeId: placeId }, function(results, status) {
      if (status === "OK") {
        if (results[0]) {
          type === "from"
            ? setAdditional_data((prevState) => {
                return {
                  ...prevState,
                  from_location: results[0].formatted_address,
                };
              })
            : setAdditional_data((prevState) => {
                return {
                  ...prevState,
                  to_location: results[0].formatted_address,
                };
              });
        }
      }
    });
  };

  const fetchAdditionalData = (
    department: string,
    licenseId: string,
    vehicleId,
    constructionYear: string,
    paymentMethod
  ) => {
    dispatch(
      getAdditionalDataAction(
        department,
        licenseId,
        vehicleId,
        constructionYear,
        (status: string, data: any) => {
          if (status === "success") {
            setAdditional_data({ ...data, paymentMethod });
          }
        }
      )
    );
  };

  useEffect(() => {
    if (service_points.length > 0) {
      setServicePoints(service_points);
    }
  }, [service_points]);

  useEffect(() => {
    if (servicePoints.length > 0) {
      setIsServicePointLoading(false);
    }
  }, [servicePoints]);

  const onSuccessCancelPopUp = (isSuccess) => {
    setCancelOrderPopUp(false);
    isSuccess && setShowOrdersPopup(false);
  };

  const handleSuccessPopup = () => {
    setSuccessPopup(false);
    history.goBack();
  };

  const deleteOrder = (id: any) => {
    axios
      .delete(`/orders/${id}`)
      .then(() => {
        setDeleteConfirm(false);
        setSuccessPopup(true);
      })
      .catch((error) => {
        setErrorPopup(true);
      });
  };

  const getVehicleName = async (id: number) => {
    const vehicleDetails = await axios.get(
      `/services/transportation-vehicles/${id}`
    );
    return vehicleDetails;
  };

  const getCargoName = async (id: number) => {
    const cargoDetails = await axios.get(`/services/cargo-types/${id}`);
    return cargoDetails;
  };

  const editOrderClick = (id: number) => {
    history.push(`${id}/edit`);
  };

  const handleChange = (data) => {
    const currentIndex = checkedData.indexOf(data);
    if (currentIndex === -1) {
      setCheckedData([...checkedData, data]);
    } else {
      setCheckedData(checkedData.filter((item) => item.id !== data.id));
    }
  };

  const toggleDistanceDropdown = () => setDistanceDropdown(!distanceDropdown);

  const toggleLimitDropdown = () => setLimitDropdown(!limitDropdown);

  const makeCall = (phone: string, name: string) => {
    if (!callState.showOngoingCallPad) {
      setCallName(name);
      setCallNumber(phone);
      setCallAlert(true);
    }
  };

  const customerCall = () => {
    if (!callState.showOngoingCallPad) {
      setCallName(orderOverview.name);
      setCallNumber(orderOverview.phone);
      setCallAlert(true);
    }
  };

  const servicePointCall = (name: string, phone: string, avatar?: string) => {
    if (!callState.showOngoingCallPad) {
      setCallName(name);
      setCallNumber(phone);
      setCallImage(avatar || null);
      setCallAlert(true);
    }
  };

  const onServicePointSelect = (servicePoint?: any) => {
    if (orderOverview.status.name.toUpperCase() === "ON_HOLD") {
      setDistance((servicePoint && servicePoint.distance) || 0);
      setAssignVisible(true);
      setHideServicePoint(servicePoint && servicePoint.id ? false : true);
      setServicePoint((servicePoint && servicePoint.id) || {});
    }
  };

  const onFinishCallBack = () => {
    setShowOrdersPopup(true);
  };

  const onClickAction = (type) => {
    setShowPopUpValue(true);
    setPopUpType("warning");
    setActionType(type);
  };

  const handleOnConfirmSendPaymentLink = () => {
    if (popUpType === "warning") {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        sendPaymentLinkAction(id, (status: string, message: string) => {
          setPopUpType(status);
          setPopUpMsg(message);
          setShowPopUpValue(true);
          dispatch(getOrderOverView(id, (msg: string) => setOrderError(msg)));
        })
      );
    } else {
      setPopUpMsg("");
      setPopUpType("");
      setShowPopUpValue(false);
    }
  };

  const handleOnConfirmButton = () => {
    if (actionType === "SEND_CALL_BACK") {
      handleOnConfirmAction("send-callback-request");
    } else if (actionType === "FINISH_ORDER") {
      handleOnConfirmAction("finish-order");
    } else if (actionType === "SEND_PAYMENT_LINK") {
      handleOnConfirmSendPaymentLink();
    } else if (actionType === "MOVE_TO_PROCESSING") {
      handleOnConfirmAction("put-processing");
    } else if (actionType === "MOVE_TO_ON_HOLD") {
      handleOnConfirmAction("put-on-hold");
    } else if (actionType === "CANCEL_QUOTE") {
      handleOnConfirmAction("expire-quote");
    } else {
      setShowPopUpValue(false);
      setPopUpType("");
      setPopUpMsg("");
    }
  };

  const handleOnConfirmAction = (endpoint: string) => {
    if (popUpType === "warning") {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        orderAction(id, endpoint, (status: string, message: string) => {
          setPopUpType(status);
          setPopUpMsg(message);
          setShowPopUpValue(true);
          dispatch(getOrderOverView(id, (msg: string) => setOrderError(msg)));
        })
      );
    } else {
      setPopUpMsg("");
      setPopUpType("");
      setShowPopUpValue(false);
    }
  };

  const toggleCancelOrderPopup = () => {
    setShowCancelPopup(!showCancelPopup);
  };

  const handleOnCancelButton = () => {
    setShowPopUpValue(false);
    setPopUpType("");
    setPopUpMsg("");
  };

  const handleTitle = () => {
    const title =
      actionType === "SEND_CALL_BACK"
        ? "sendCallBack"
        : actionType === "FINISH_ORDER"
        ? "finishOrder"
        : actionType === "SEND_PAYMENT_LINK"
        ? "sendPaymentLink"
        : actionType === "MOVE_TO_ON_HOLD" ||
          actionType === "MOVE_TO_PROCESSING" ||
          actionType === "CANCEL_QUOTE"
        ? "moveToOnHold"
        : "";
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

  const callPhone = () => {
    setCallAlert(false);
    SipCallService.startCall(callNumber, callName, callImage);
  };

  const onAssignServicePromptClose = (result: boolean) => {
    if (result) {
      fetchOrderDetails(id);
    }
    setAssignVisible(false);
  };

  const getOrders = async (addData = false) => {
    setOrderOverview({});
    try {
      fetchOrderDetails(id);
    } catch (err) {
      console.log(err);
    }
  };

  const closeOrderServicesModal = (): void => {
    setShowOrdersPopup(false);
  };

  const reloadData = (): void => {
    setShowOrdersPopup(false);
    fetchOrderDetails(id);
  };

  const onCancelOrder = (): void => {
    toggleCancelOrderPopup();
    setCancelOrderPopUp(true);
  };

  const handleServicePointDissociationPopup = () => {
    if (reasons === null)
      dispatch(getServicePointDissociationReason("service_point_dissociation"));
    if (!servicePointDissociationPopup) setServicePointDissociationPopup(true);
  };
  const onShowCreateComment = (data: any) => {
    setEditCommentData(data);
    setCreateNewComment(true);
  };
  const onDeleteComment = (id) => {
    setDeleteCommentData(id);
    setDeleteCommentPopup(true);
  };
  const deleteCommentConfirm = () => {
    dispatch(deleteOrderComment(id, deleteCommentId, callbackDeleteComment));
  };
  const callbackDeleteComment = (result: string, response: any) => {
    setDeleteCommentData("");
    setDeleteCommentPopup(false);
    if (result === "success") {
      fetchOrderComments(id);
    } else {
      setErrorCommentPopup(true);
    }
  };
  const onCloseCreateComment = (isSuccess) => {
    setCreateNewComment(false);
    isSuccess && fetchOrderComments(id);
  };

  const fetchOrderComments = (id) => {
    dispatch(
      getOrderComments(id, (status: boolean, res: any) => {
        if (status) {
          setComment(res.data);
        }
      })
    );
  };

  const handleDissociationConfirmation = () => {
    if (Boolean(dissociationReasonObj?.reason_id)) {
      setServicePointDissociationPopup(false);
      if (!dissociationReasonAlert) setDissociationReasonAlert(true);
    } else {
      setReasonIdRequiredError(true);
    }
  };

  const sendDissociationRequest = () => {
    if (dissociationReasonObj) {
      dispatch(
        requestServicePointDissociationReason(
          orderOverview.id,
          dissociationReasonObj,
          (msg: string) => setDissociationRequestAcknowledgement(msg)
        )
      );
    }
    setDissociationReasonAlert(false);
  };

  const handleDissociationPromptClose = () => {
    setServicePointDissociationPopup(false);
  };

  const handleReasonChange = (e?: any) => {
    const { name, value } = e.target;
    setDissociationReasonObj({
      ...dissociationReasonObj,
      [name]: name === "reason_id" ? value : Boolean(value),
    });
  };

  const onDeletePreferredDate = (preferredDateId: number) => {
    dispatch(
      deletePreferredDate(orderOverview.id, preferredDateId, (msg: string) =>
        setDeletePreferredDateError(msg)
      )
    );
  };

  const onCreatePreferredDate = (data: ICreatePreferredDate) => {
    dispatch(
      createPreferredDate(orderOverview.id, data, (msg: string) =>
        setCreatePreferredDateError(msg)
      )
    );
  };

  const onUpdatePreferredDate = (
    preferredDateId: number,
    data: ICreatePreferredDate
  ) => {
    dispatch(
      updatePreferredDate(
        orderOverview.id,
        preferredDateId,
        data,
        (msg: string) => setUpdatePreferredDateError(msg)
      )
    );
  };
  const distanceInKm = (value) => {
    return Number(value) / 1000 + " KM";
  };
  const secondsToHms = (value) => {
    value = Number(value);
    var h = Math.floor(value / 3600);
    var m = Math.floor((value % 3600) / 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    return hDisplay + mDisplay;
  };
  const totalSum = () => {
    // let sum = 0;
    // let totalSum :any = "";
    // let currencyConvert :any = "";
    // for(let i = 0;i<orderOverview.services.length;i++){
    //     currencyConvert = CURRENCY_CODES.find(code => code.currency_code_iso === orderOverview.services[i].currency_code_iso);
    //     sum = (sum + orderOverview.services[i].calculated_price_inc_vat)/100;
    // }
    // totalSum = currencyConventor(sum, orderOverview.services[0].currency_code_iso)
    // return totalSum
    return currencyConventor(
      orderOverview.meta.total_price / 100,
      orderOverview.services[0] && orderOverview.services[0].currency_code_iso
    );
  };

  const handleSubscriptionChange = (value) => {
    if (value) {
      if (value[value.length - 1].value == "all") {
        setSubscriptions([{ value: "all", label: "All" }]);
        setActiveSubscription(false);
        setSelectedPlans([]);
        dispatch(
          getNearByServicePointAction(
            id,
            selectedDistance,
            selectedLimit,
            [],
            false,
            (type: string, msg: string) => {
              switch (type) {
                case "loading": {
                  setIsServicePointLoading(true);
                  setServicePointError(msg);
                  break;
                }
                case "success": {
                  setIsServicePointLoading(false);
                  setServicePointError(msg);
                  break;
                }
                case "fail": {
                  setSelectedLimit(limitList[0].value);
                  setSelectedDistance(max_distance[0].value);
                  setIsServicePointLoading(false);
                  setServicePointError(msg);
                  break;
                }
              }
            }
          )
        );
      } else if (value[value.length - 1].value == "active_subscription") {
        setSubscriptions([
          { value: "active_subscription", label: " Active subscription" },
        ]);
        setActiveSubscription(true);
        setSelectedPlans([]);
        dispatch(
          getNearByServicePointAction(
            id,
            selectedDistance,
            selectedLimit,
            [],
            true,
            (type: string, msg: string) => {
              switch (type) {
                case "loading": {
                  setIsServicePointLoading(true);
                  setServicePointError(msg);
                  break;
                }
                case "success": {
                  setIsServicePointLoading(false);
                  setServicePointError(msg);
                  break;
                }
                case "fail": {
                  setSelectedLimit(limitList[0].value);
                  setSelectedDistance(max_distance[0].value);
                  setIsServicePointLoading(false);
                  setServicePointError(msg);
                  break;
                }
              }
            }
          )
        );
      } else {
        let vals: any = [];
        const selectedVal = value[value.length - 1];
        if (typeof value[0].value === "number") {
          setSubscriptions(
            value.map((val) => {
              return { value: val.value, label: val.label };
            })
          );
          vals = value.map((val) => val.value);
        } else {
          setSubscriptions([
            { value: selectedVal.value, label: selectedVal.label },
          ]);
          vals = [selectedVal.value];
        }
        setSelectedPlans(vals);
        setActiveSubscription(false);
        dispatch(
          getNearByServicePointAction(
            id,
            selectedDistance,
            selectedLimit,
            vals,
            false,
            (type: string, msg: string) => {
              switch (type) {
                case "loading": {
                  setIsServicePointLoading(true);
                  setServicePointError(msg);
                  break;
                }
                case "success": {
                  setIsServicePointLoading(false);
                  setServicePointError(msg);
                  break;
                }
                case "fail": {
                  setSelectedLimit(limitList[0].value);
                  setSelectedDistance(max_distance[0].value);
                  setIsServicePointLoading(false);
                  setServicePointError(msg);
                  break;
                }
              }
            }
          )
        );
      }
    } else {
      setActiveSubscription(false);
      setSubscriptions(value);
    }
  };

  return (
    <React.Fragment>
      <NotificationContainer />
      {showCreateNewComment && (
        <AddOrderComment
          show={showCreateNewComment}
          onClose={onCloseCreateComment}
          id={orderOverview.id}
          data={editCommentData}
        />
      )}
      {showOrdersPopup && (
        <OrderServices
          id={orderOverview.id}
          preSelectedServices={orderOverview.services}
          show={showOrdersPopup}
          onCancelOrder={onCancelOrder}
          closeModal={closeOrderServicesModal}
          reloadData={reloadData}
        />
      )}
      {!Boolean(orderOverview.id) && !orderError && <Loader />}
      {Boolean(orderOverview.id) && !orderError ? (
        <>
          <div className="jr-card p-0">
            <div className="jr-card-1header card-img-top mb-0 p-4 bg-#3f51b5 lighten-4 d-flex justify-content-between">
              <h3 className="card-heading">
                <b> Name : </b>
                {orderOverview.name}
                <Link
                  to={`/support/customers/${orderOverview?.user_id}`}
                  className="text-decorate-none"
                >
                  {" "}
                  <i
                    className="fas fa-external-link-alt ml-2"
                    style={{ fontSize: 14, cursor: "pointer" }}
                  ></i>{" "}
                </Link>
              </h3>
              {additional_data?.paymentMethod?.name ? (
                <h5>
                  <b>
                    <IntlMessages id="orderOverview.paymentMethod" /> :{" "}
                  </b>{" "}
                  {additional_data?.paymentMethod?.name}
                </h5>
              ) : null}
            </div>

            <div className="card-body">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <h5>
                    <b> Id : </b>
                    {orderOverview.id}
                  </h5>
                  <h5>
                    <b> Phone : </b>{" "}
                    <span onClick={customerCall} className="underlineElement">
                      {orderOverview.phone}
                    </span>
                  </h5>
                  <h5>
                    <b> Email : </b> {orderOverview.email}
                  </h5>
                  <h5>
                    <b> Salutation : </b> {orderOverview.salutation}
                  </h5>
                  <h5>
                    <b> Name : </b> {orderOverview.name}
                  </h5>
                  <h5>
                    <b> Address :</b>
                    {orderOverview.address &&
                      `${orderOverview.address.street} ${orderOverview.address.street_number}, ${orderOverview.address.zip_code}, ${orderOverview.address.city}, ${orderOverview.address.country} `}
                  </h5>
                  <h5>
                    <b>
                      <IntlMessages id="sender.street_number" /> :{" "}
                    </b>{" "}
                    {orderOverview["address"]["street_number"]}
                  </h5>
                  <div style={{ display: "flex" }}>
                    <h5>
                      <b>
                        {" "}
                        <IntlMessages id="order.status" /> :
                      </b>
                      <Badge color="success" pill>
                        {orderOverview.status &&
                          orderOverview.status.name.toUpperCase()}
                      </Badge>
                    </h5>
                    {orderOverview.quote_request && (
                      <h5 style={{ marginLeft: 10 }}>
                        <Badge color="primary" pill>
                          <IntlMessages id={"order.quotationRequest"} />
                        </Badge>
                      </h5>
                    )}
                  </div>
                  {deliveryId !== null && (
                    <h5>
                      <b>
                        {" "}
                        <IntlMessages id="order.deliverOption" /> :
                      </b>
                      {deliveryId.name}
                    </h5>
                  )}
                  <Row xs="2">
                    <Col>
                      <h5>
                        <b>
                          <IntlMessages id="order.created-at" />:
                        </b>
                        {orderOverview.created_at
                          ? readableDateTimeLocale(
                              orderOverview.created_at,
                              localDateTimeFormat
                            )
                          : "-"}
                      </h5>
                    </Col>
                    <Col>
                      <h5>
                        <b>
                          <IntlMessages id="order.updated-at" />:
                        </b>
                        {orderOverview.updated_at
                          ? readableDateTimeLocale(
                              orderOverview.updated_at,
                              localDateTimeFormat
                            )
                          : "-"}
                      </h5>
                    </Col>
                    {/*<Col>*/}
                    {/*<h5><b>Execution date:</b>*/}
                    {/*{orderOverview.execution_date ? readableDate(orderOverview.execution_date) : '-'}*/}
                    {/*</h5>*/}
                    {/*</Col>*/}
                    {orderOverview.deleted_at && (
                      <Col>
                        <h5>
                          <b>Delete date:</b>
                          {orderOverview.deleted_at
                            ? readableDateTimeLocale(
                                orderOverview.deleted_at,
                                localDateTimeFormat
                              )
                            : "-"}
                        </h5>
                      </Col>
                    )}
                  </Row>
                  {orderOverview.status && (
                    <>
                      {editVisibleList.includes(orderOverview.status.name) && (
                        <UserHasPermission permission="booking-service-support-order-update">
                          <Button
                            size="small"
                            onClick={() => editOrderClick(orderOverview.id)}
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-warning text-white"
                            color="primary"
                          >
                            <IntlMessages id="orderOptions.edit-order" />
                          </Button>
                        </UserHasPermission>
                      )}
                      {(deleteVisibleList.includes(orderOverview.status.name) ||
                        orderOverview.status.name === "completed") && (
                        <UserHasPermission
                          permission={
                            orderOverview.status.name === "completed"
                              ? "booking-service-allow-delete-completed-order"
                              : "booking-service-support-order-delete"
                          }
                        >
                          <Button
                            size="small"
                            onClick={() => setDeleteConfirm(true)}
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
                            color="primary"
                          >
                            <IntlMessages id="orderOptions.delete-order" />
                          </Button>
                        </UserHasPermission>
                      )}
                      {cancelVisibleList.includes(
                        orderOverview.status.name
                      ) && (
                        <UserHasPermission permission="booking-service-support-order-cancel">
                          <Button
                            size="small"
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn  bg-light-green text-white"
                            color="primary"
                            onClick={() => {
                              toggleCancelOrderPopup();
                              setCancelOrderPopUp(true);
                            }}
                          >
                            <IntlMessages id="orderOptions.cancel-order" />
                          </Button>
                        </UserHasPermission>
                      )}
                      {orderOverview.status.name ===
                        "awaiting_confirmation" && (
                        <Button
                          size="small"
                          className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn  bg-primary text-white"
                          color="primary"
                          onClick={() => onClickAction("CANCEL_QUOTE")}
                        >
                          <IntlMessages id="orderOptions.expire-quote" />
                        </Button>
                      )}
                      {orderOverview.status.name === "on_hold" && (
                        <UserHasPermission permission="booking-service-put-order-processing">
                          <Button
                            size="small"
                            onClick={() => onClickAction("MOVE_TO_PROCESSING")}
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-primary text-white"
                            color="primary"
                          >
                            <IntlMessages id="dissociation.popup.label.move_to_processing" />
                          </Button>
                        </UserHasPermission>
                      )}
                      {sendCallbackVisibleList.includes(
                        orderOverview.status.name
                      ) && (
                        <UserHasPermission permission="booking-service-support-order-create-callback-request">
                          <Button
                            size="small"
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
                            color="primary"
                            onClick={() => onClickAction("SEND_CALL_BACK")}
                          >
                            <IntlMessages id="orderOptions.send-callback-request" />
                          </Button>
                        </UserHasPermission>
                      )}

                      {(orderOverview.status.name === "awaiting_confirmation" ||
                        orderOverview.status.name === "processing" ||
                        orderOverview.status.name === "scheduled" ||
                        orderOverview.status.name === "awaiting_payment" ||
                        orderOverview.status.name ===
                          "awaiting_completion") && (
                        <UserHasPermission permission="booking-service-put-order-on-hold">
                          <Button
                            size="small"
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
                            color="primary"
                            onClick={() => onClickAction("MOVE_TO_ON_HOLD")}
                          >
                            <IntlMessages id="orderOptions.move-to-on-hold" />
                          </Button>
                        </UserHasPermission>
                      )}
                      {(orderOverview.status.name === "scheduled" ||
                        orderOverview.status.name ===
                          "awaiting_completion") && (
                        <UserHasPermission permission="booking-service-finish-orders">
                          <Button
                            size="small"
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
                            color="primary"
                            onClick={onFinishCallBack}
                          >
                            Finish Order
                          </Button>
                        </UserHasPermission>
                      )}
                    </>
                  )}
                </Grid>
                <Grid item xs={6}>
                  {Boolean(additional_data) &&
                    selectedDepartment !== "" &&
                    (selectedDepartment === "vehicles" ||
                      selectedDepartment === "couriers") && (
                      <div style={{ marginTop: "20px" }}>
                        <h3>Additional Data : </h3>
                        {selectedDepartment === "vehicles" ? (
                          <Row xs="2">
                            <Col>
                              <img
                                src={
                                  additional_data["images"] &&
                                  additional_data["images"][0] &&
                                  additional_data["images"][0]["location"]
                                }
                                height={100}
                                width={100}
                                style={{ margin: "10px" }}
                              />
                            </Col>
                            <Col>
                              <h5>
                                <b> Department : </b> {orderOverview.department}
                              </h5>
                            </Col>
                            <Col>
                              <h5>
                                <b>
                                  <IntlMessages id="vehicleStepperStep1.licensePlate" />{" "}
                                  :
                                </b>{" "}
                                {additional_data["plate"]}
                              </h5>
                            </Col>
                            <Col>
                              <h5>
                                <b>
                                  <IntlMessages id="brand" /> :{" "}
                                </b>{" "}
                                {additional_data["brand"]["name"]}{" "}
                              </h5>
                            </Col>
                            <Col>
                              <h5>
                                <b>
                                  <IntlMessages id="model" /> :{" "}
                                </b>{" "}
                                {additional_data["model"]["name"]}{" "}
                              </h5>
                            </Col>
                            <Col>
                              <h5>
                                <b>
                                  <IntlMessages id="fuel" /> :{" "}
                                </b>{" "}
                                {additional_data["fuel"]["name"]}{" "}
                              </h5>
                            </Col>
                            <Col>
                              <h5>
                                <b>
                                  <IntlMessages id="vehicleStepperStep1.constructionYear" />{" "}
                                  :
                                </b>{" "}
                                {additional_data["construction_year"] &&
                                additional_data["construction_year"].toString()
                                  .length === 4
                                  ? additional_data["construction_year"]
                                  : readableDate(
                                      additional_data["construction_year"]
                                    )}{" "}
                              </h5>
                            </Col>
                            {additional_data[
                              "mandatory_service_expiry_date"
                            ] ? (
                              <Col>
                                <h5>
                                  <b>
                                    <IntlMessages id="mandatory_service_expiry" />{" "}
                                    :
                                  </b>{" "}
                                  {readableDate(
                                    additional_data[
                                      "mandatory_service_expiry_date"
                                    ]
                                  )}{" "}
                                </h5>
                              </Col>
                            ) : null}
                            <Col>
                              <h5>
                                <b>
                                  <IntlMessages id="vehicle.vehicleID" /> :{" "}
                                </b>{" "}
                                {additional_data["vehicle_id"]}{" "}
                              </h5>
                            </Col>
                          </Row>
                        ) : (
                          <>
                            <Row xs="2">
                              <Col>
                                <h5>
                                  <b>
                                    <IntlMessages id="fromLocation" /> :{" "}
                                  </b>{" "}
                                  {
                                    additional_data["routeInfoDetails"][
                                      "origin"
                                    ]["full"]
                                  }
                                </h5>
                                <h5>
                                  <b>
                                    <IntlMessages id="sender.street" /> :{" "}
                                  </b>{" "}
                                  {
                                    additional_data["routeInfoDetails"][
                                      "origin"
                                    ]["street"]
                                  }
                                </h5>
                                <h5>
                                  <b>
                                    <IntlMessages id="sender.zipCode" /> :{" "}
                                  </b>{" "}
                                  {
                                    additional_data["routeInfoDetails"][
                                      "origin"
                                    ]["zipCode"]
                                  }
                                </h5>
                                {additional_data["senderDetails"]["name"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="sender.name" />:{" "}
                                    </b>{" "}
                                    {additional_data["senderDetails"]["name"]}
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["senderDetails"]["email"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="sender.email" />:{" "}
                                    </b>{" "}
                                    {additional_data["senderDetails"]["email"]}
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["senderDetails"]["phone"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="sender.phone" />:{" "}
                                    </b>{" "}
                                    {additional_data["senderDetails"]["phone"]}
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["senderDetails"][
                                  "street_number"
                                ] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="sender.street_number" />
                                      :{" "}
                                    </b>{" "}
                                    {
                                      additional_data["senderDetails"][
                                        "street_number"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["senderDetails"]["company"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="sender.company" />:{" "}
                                    </b>{" "}
                                    {
                                      additional_data["senderDetails"][
                                        "company"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["senderDetails"][
                                  "department"
                                ] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="sender.department" />:{" "}
                                    </b>{" "}
                                    {
                                      additional_data["senderDetails"][
                                        "department"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["senderDetails"][
                                  "salutation"
                                ] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="sender.salutation" />:{" "}
                                    </b>{" "}
                                    {
                                      additional_data["senderDetails"][
                                        "salutation"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                              </Col>
                              <Col>
                                <h5>
                                  <b>
                                    <IntlMessages id="toLocation" /> :{" "}
                                  </b>{" "}
                                  {additional_data["routeInfoDetails"][
                                    "destination"
                                  ]
                                    ? distanceInKm(
                                        additional_data["routeInfoDetails"][
                                          "destination"
                                        ]["full"]
                                      )
                                    : ""}
                                </h5>
                                <h5>
                                  <b>
                                    <IntlMessages id="receiver.distance" /> :{" "}
                                  </b>{" "}
                                  {additional_data["routeInfoDetails"][
                                    "distance"
                                  ]
                                    ? distanceInKm(
                                        additional_data["routeInfoDetails"][
                                          "distance"
                                        ]
                                      )
                                    : ""}
                                </h5>
                                <h5>
                                  <b>
                                    <IntlMessages id="receiver.duration" /> :{" "}
                                  </b>{" "}
                                  {secondsToHms(
                                    additional_data["routeInfoDetails"][
                                      "duration"
                                    ]
                                  )}
                                </h5>
                                {additional_data["receiverDetails"]["name"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="receiver.name" />:{" "}
                                    </b>{" "}
                                    {additional_data["receiverDetails"]["name"]}
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["receiverDetails"]["email"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="receiver.email" />:{" "}
                                    </b>{" "}
                                    {
                                      additional_data["receiverDetails"][
                                        "email"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["receiverDetails"]["phone"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="receiver.phone" />:{" "}
                                    </b>{" "}
                                    {
                                      additional_data["receiverDetails"][
                                        "phone"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["receiverDetails"][
                                  "company"
                                ] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="receiver.company" />:{" "}
                                    </b>{" "}
                                    {
                                      additional_data["receiverDetails"][
                                        "company"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["receiverDetails"][
                                  "street_number"
                                ] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="sender.street_number" />
                                      :{" "}
                                    </b>{" "}
                                    {
                                      additional_data["receiverDetails"][
                                        "street_number"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["receiverDetails"][
                                  "department"
                                ] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="receiver.department" />:{" "}
                                    </b>{" "}
                                    {
                                      additional_data["receiverDetails"][
                                        "department"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["receiverDetails"][
                                  "salutation"
                                ] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="receiver.salutation" />:{" "}
                                    </b>{" "}
                                    {
                                      additional_data["receiverDetails"][
                                        "salutation"
                                      ]
                                    }
                                  </h5>
                                ) : (
                                  ""
                                )}
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                {additional_data["dimensionsDetails"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="courier.dimensions" />:{" "}
                                    </b>
                                    <IntlMessages id="Width" />:{" "}
                                    {
                                      additional_data["dimensionsDetails"][
                                        "width"
                                      ]
                                    }{" "}
                                    &nbsp;
                                    <IntlMessages id="Height" />:{" "}
                                    {
                                      additional_data["dimensionsDetails"][
                                        "height"
                                      ]
                                    }{" "}
                                    &nbsp;
                                    <IntlMessages id="Length" />:{" "}
                                    {
                                      additional_data["dimensionsDetails"][
                                        "length"
                                      ]
                                    }{" "}
                                    &nbsp;
                                    <IntlMessages id="Weight" />:{" "}
                                    {
                                      additional_data["dimensionsDetails"][
                                        "weight"
                                      ]
                                    }{" "}
                                    &nbsp;
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["vehicleDetails"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="vehicle" />:{" "}
                                    </b>{" "}
                                    {additional_data["vehicleDetails"]} &nbsp;
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {additional_data["cargoDetails"] ? (
                                  <h5>
                                    <b>
                                      <IntlMessages id="CargoType" />:{" "}
                                    </b>{" "}
                                    {additional_data["cargoDetails"]} &nbsp;
                                  </h5>
                                ) : (
                                  ""
                                )}
                              </Col>
                            </Row>
                          </>
                        )}
                      </div>
                    )}
                </Grid>
              </Grid>
            </div>
          </div>
          <CancelOrder
            closePopUp={onSuccessCancelPopUp}
            show={cancelOrderPopUp}
            orderId={id}
            getOrders={getOrders}
            togglePopup={toggleCancelOrderPopup}
            showPopUp={showCancelPopup}
            overview
          />
          <SweetAlert
            show={deleteConfirm}
            warning
            showCancel
            confirmBtnText="Yes"
            cancelBtnText="cancel"
            cancelBtnBsStyle="default"
            confirmBtnBsStyle="danger"
            onConfirm={() => deleteOrder(id)}
            onCancel={() => setDeleteConfirm(false)}
            title="Proceed Deletion"
          >
            Do you want to delete order ?
          </SweetAlert>
          <SweetAlert
            show={showDeletePopup}
            warning
            showCancel
            confirmBtnText="Yes"
            cancelBtnText="cancel"
            cancelBtnBsStyle="default"
            confirmBtnBsStyle="danger"
            onConfirm={() => deleteCommentConfirm()}
            onCancel={() => setDeleteCommentPopup(false)}
            title="Proceed Deletion"
          >
            Do you want to delete this comment ?
          </SweetAlert>
          <SweetAlert
            show={errorCommentPopup}
            warning
            confirmBtnBsStyle="danger"
            confirmBtnText="Okay"
            onConfirm={() => setErrorCommentPopup(false)}
            title="Error"
          >
            Something went wrong !
          </SweetAlert>
          <SweetAlert
            show={successPopup}
            success
            confirmBtnText="Great"
            onConfirm={handleSuccessPopup}
            title="Success"
          >
            Order Deleted Successfully
          </SweetAlert>
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

          {orderOverview &&
          orderOverview.completion_requests &&
          orderOverview.completion_requests.length ? (
            <>
              <div className="d-flex justify-content-between">
                <h3 className="mt-2">
                  <IntlMessages id="orderDetailViewTable.completionRequests" />
                </h3>
              </div>
              <Card className="shadow border-0" id="order-details-table">
                <CardBody>
                  <CardText>
                    <div className="table-responsive-material">
                      <table className="default-table table-unbordered table table-sm table-hover">
                        <thead className="th-border-b">
                          <tr>
                            <th>
                              <IntlMessages id="orderDetailViewTable.attachmentsId" />
                            </th>
                            <th>
                              <IntlMessages id="orderDetailViewTable.price" />
                            </th>
                            <th>
                              <IntlMessages id="orderOverview.Type" />
                            </th>
                            <th>
                              <IntlMessages id="viewCallQueueListHeading.approved" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderOverview &&
                            orderOverview.completion_requests.map(
                              (data: any) => {
                                return (
                                  <>
                                    <tr tabIndex={-1} key={data.id}>
                                      <td>{data.id}</td>
                                      <td>
                                        {currencyConventor(data.price / 100)}
                                      </td>
                                      <td>{data.type}</td>
                                      <td>
                                        {moment
                                          .utc(data.approved)
                                          .format("MM-DD-YYYY HH:mm:ss")}
                                      </td>
                                    </tr>
                                  </>
                                );
                              }
                            )}
                        </tbody>
                      </table>
                    </div>
                  </CardText>
                </CardBody>
              </Card>
            </>
          ) : null}

          <PreferredDatesTable
            dataList={preferredDates}
            deleteRow={onDeletePreferredDate}
            createPreferredDate={onCreatePreferredDate}
            updatePreferredDate={onUpdatePreferredDate}
            selectedDepartment={selectedDepartment}
          />

          <div className="d-flex justify-content-between">
            <h3 className="mt-2">
              <IntlMessages id="orderDetailViewTable.servicesList" />
            </h3>
            {/*<div>*/}
            {/*	<button type="button" className="btn btn-primary btn-xs m-0 mr-2"><IntlMessages*/}
            {/*		id="orderOverview.addNewService"/></button>*/}

            {/*	<ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>*/}
            {/*		<DropdownToggle color="primary" caret>*/}
            {/*			<IntlMessages id="orderOverview.bulkAction"/>*/}
            {/*		</DropdownToggle>*/}
            {/*		<DropdownMenu>*/}
            {/*			<DropdownItem><IntlMessages*/}
            {/*				id="orderOverview.deleteSelected"/> ({`${checkedData.length}`})</DropdownItem>*/}
            {/*			<DropdownItem><IntlMessages*/}
            {/*				id="orderOverview.updateSelected"/> ({`${checkedData.length}`})</DropdownItem>*/}
            {/*		</DropdownMenu>*/}
            {/*	</ButtonDropdown>*/}

            {/*</div>*/}
          </div>

          <Card className={`shadow border-0 `} id="order-details-table">
            <CardBody>
              <CardText>
                <div className="table-responsive-material">
                  <table className="default-table table-unbordered table table-sm table-hover">
                    <thead className="th-border-b">
                      <tr>
                        {/*<th>*/}

                        {/*	<FormGroup className='mb-0 d-flex'>*/}
                        {/*		<FormControlLabel*/}
                        {/*			control={*/}
                        {/*				<Checkbox color="primary"*/}
                        {/*									checked={selectAllChecked}*/}
                        {/*									onChange={(event: React.ChangeEvent<HTMLInputElement>) => selectAll()}*/}
                        {/*					// value={data}*/}
                        {/*				/>*/}
                        {/*			}*/}
                        {/*			label=''*/}
                        {/*		/>*/}
                        {/*	</FormGroup>*/}

                        {/*</th>*/}
                        <th>
                          <IntlMessages id="orderDetailViewTable.name" />
                        </th>
                        <th>
                          <IntlMessages id="orderDetailViewTable.amount" />
                        </th>
                        <th>
                          <IntlMessages id="orderDetailViewTable.price" />
                        </th>
                        <th>
                          <IntlMessages id="orderDetailViewTable.dates" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderOverview.services &&
                        orderOverview.services.map((data: any) => {
                          return (
                            <>
                              <tr
                                data-id={data.id}
                                tabIndex={-1}
                                key={data.id}
                                className={
                                  data.accepted === null ? "bg-warning" : ""
                                }
                                //style={{lineHeight: "4"}}
                                onClick={(
                                  event: React.MouseEvent<HTMLTableRowElement>
                                ) => handleChange(data)}
                              >
                                {/*<td>*/}
                                {/*	<FormGroup className='mb-0 d-flex'>*/}
                                {/*		<FormControlLabel*/}
                                {/*			control={*/}
                                {/*				<Checkbox color="primary"*/}
                                {/*									checked={_.some(checkedData, {'id': data.id})}*/}
                                {/*									onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(data)}*/}
                                {/*									value={data}*/}
                                {/*				/>*/}
                                {/*			}*/}
                                {/*			label=''*/}
                                {/*		/>*/}
                                {/*	</FormGroup>*/}
                                {/*</td>*/}
                                <td>
                                  {data.name}{" "}
                                  {data.custom_description && (
                                    <Tooltip title={data.custom_description}>
                                      <InfoIcon />
                                    </Tooltip>
                                  )}{" "}
                                </td>
                                <td>{data.amount}</td>
                                <td>
                                  {currencyConventor(
                                    data.calculated_price_inc_vat / 100,
                                    data.currency_code_iso
                                  )}
                                </td>
                                <td>
                                  {data.created_at && (
                                    <span>
                                      <>
                                        <b>
                                          <IntlMessages id="orderDetailViewTable.create" />
                                          :
                                        </b>
                                        {data.created_at
                                          ? readableDateTimeLocale(
                                              data.created_at,
                                              localDateTimeFormat
                                            )
                                          : "-"}
                                        <br></br>
                                      </>
                                    </span>
                                  )}
                                  {data.updated_at !== data.created_at && (
                                    <span>
                                      <b>
                                        <IntlMessages id="orderDetailViewTable.update" />
                                        :
                                      </b>
                                      {data.updated_at
                                        ? readableDateTimeLocale(
                                            data.updated_at,
                                            localDateTimeFormat
                                          )
                                        : "-"}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      <tr>
                        <td></td>
                        <td></td>
                        <td>{totalSum()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardText>
            </CardBody>
          </Card>

          {/* Payment List */}
          <PaymentList
            paymentData={paymentList}
            actionButton={
              orderOverview.status.name === "awaiting_confirmation" ||
              orderOverview.status.name === "processing" ||
              orderOverview.status.name === "on_hold" ||
              orderOverview.status.name === "scheduled" ||
              orderOverview.status.name === "awaiting_payment" ||
              orderOverview.status.name === "awaiting_completion" ? (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onClickAction("SEND_PAYMENT_LINK")}
                  >
                    <IntlMessages id="orderOptions.send-payment-link" />
                  </Button>
                  <IconButton
                    color="primary"
                    aria-label="fetch rejections"
                    onClick={() => fetchOrderPayments(orderOverview.id)}
                  >
                    <CachedhIcon />
                  </IconButton>
                </div>
              ) : (
                <IconButton
                  color="primary"
                  aria-label="fetch rejections"
                  onClick={() => fetchOrderPayments(orderOverview.id)}
                >
                  <CachedhIcon />
                </IconButton>
              )
            }
            isLoading={paymentLoading}
            error={getOrderPaymentError}
          />

          {/* Call recording  */}
          <CallQueueOverviewTable id={id} />
          {/* Call recording  */}

          {/* Email list */}
          <EmailsList id={id} />
          {/* Email list */}

          <div className="d-flex justify-content-between">
            <h3 className="mt-2">
              <IntlMessages id="orderDetailViewTable.rejectionList" />
            </h3>
            <div>
              <Button
                variant="contained"
                color="primary"
                className="mb-1"
                onClick={() => setShowRejectionPrompt(true)}
              >
                <IntlMessages id="orderDetailViewTable.newRejection" />
              </Button>
              <IconButton
                color="primary"
                aria-label="fetch rejections"
                onClick={() => fetchOrderRejections(orderOverview.id)}
              >
                <CachedhIcon />
              </IconButton>
            </div>
          </div>

          <Card className={`shadow border-0 `} id="order-details-table">
            <CardBody>
              <CardText>
                <div className="table-responsive-material">
                  <table className="default-table table-unbordered table table-sm table-hover">
                    <thead className="th-border-b">
                      <tr>
                        <th>
                          <IntlMessages id="orderDetailViewTable.avatar" />
                        </th>
                        <th>
                          <IntlMessages id="orderDetailViewTable.attachmentsName" />
                        </th>
                        <th>
                          <IntlMessages id="orderDetailViewTable.servicePointName" />
                        </th>
                        <th>
                          <IntlMessages id="orderOverview.Time" />
                        </th>
                        <th>
                          <IntlMessages id="orderDetailViewTable.rejectionReason" />
                        </th>
                        {userCan(
                          abilities,
                          "booking-service-order-rejected-sensitive-details"
                        ) && (
                          <>
                            <th>
                              <IntlMessages id="orderDetailViewTable.userIp" />
                            </th>
                            <th>
                              <IntlMessages id="orderDetailViewTable.userAgent" />
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {rejectionLoading && (
                        <tr>
                          <td align="center" colSpan={7}>
                            <Spinner color="primary" className={"spinner"} />
                          </td>
                        </tr>
                      )}
                      {!rejectionLoading &&
                        !rejectedOrders.length &&
                        !rejectedOrdersError && (
                          <tr>
                            <td align="center" colSpan={7}>
                              <h3 className="mt-3">
                                <IntlMessages id="orderDetailViewTable.noRejectionMsg" />
                              </h3>
                            </td>
                          </tr>
                        )}
                      {!rejectionLoading &&
                        !rejectedOrders.length &&
                        rejectedOrdersError && (
                          <tr>
                            <td align="center" colSpan={7}>
                              <h3 className="mt-3">{rejectedOrdersError}</h3>
                            </td>
                          </tr>
                        )}
                      {!rejectionLoading &&
                        rejectedOrders &&
                        rejectedOrders.map((data: any) => {
                          return (
                            <>
                              <tr tabIndex={-1} key={data.id}>
                                <td>
                                  <Avatar
                                    alt={data?.name}
                                    src={
                                      data?.user?.avatar
                                        ? data?.user?.avatar
                                        : department &&
                                          department?.image &&
                                          department?.image.small
                                        ? department?.image.small
                                        : ""
                                    }
                                    className="user-avatar"
                                  ></Avatar>
                                </td>
                                <td>
                                  {`${data?.user?.first_name || ""} ${data?.user
                                    ?.last_name || ""}`}{" "}
                                </td>
                                <td>{data?.service_point?.name}</td>
                                <td>
                                  {moment
                                    .utc(data.created_at)
                                    .format("MM-DD-YYYY HH:mm:ss")}
                                </td>
                                <td style={{ maxWidth: "300px" }}>
                                  {data.comment}
                                </td>
                                <UserHasPermission permission="booking-service-order-rejected-sensitive-details">
                                  <td>{data?.ip_address}</td>
                                  <td style={{ maxWidth: "300px" }}>
                                    {data.user_agent}
                                  </td>
                                </UserHasPermission>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardText>
            </CardBody>
          </Card>

          {orderOverview &&
            orderOverview.attachments &&
            orderOverview.attachments.length > 0 && (
              <>
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2">
                    <IntlMessages id="orderDetailViewTable.attachmentsList" />
                  </h3>
                </div>

                <Card className={`shadow border-0 `} id="order-details-table">
                  <CardBody>
                    <CardText>
                      <div className="table-responsive-material">
                        <table className="default-table table-unbordered table table-sm table-hover">
                          <thead className="th-border-b">
                            <tr>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsId" />
                              </th>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsName" />
                              </th>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsFileSize" />
                              </th>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsType" />
                              </th>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsMeta" />
                              </th>
                              <th style={{ textAlign: "center" }}>
                                <IntlMessages id="orderDetailViewTable.attachmentsPath" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderOverview.attachments &&
                              orderOverview.attachments.map((data: any) => {
                                return (
                                  <>
                                    <tr
                                      data-id={data.id}
                                      tabIndex={-1}
                                      key={data.id}
                                    >
                                      <td>{data.id}</td>
                                      <td>{data.name}</td>
                                      <td>
                                        {(data.filesize / 1000000).toFixed(2) +
                                          " MB"}
                                      </td>
                                      <td>{data.mime}</td>
                                      <td>
                                        {data.meta && data?.meta?.location
                                          ? data?.meta?.location
                                          : "-"}
                                      </td>
                                      <td>
                                        <Button
                                          size="small"
                                          variant="contained"
                                          color="primary"
                                          className="btn-block"
                                          onClick={() => window.open(data.path)}
                                        >
                                          Open
                                        </Button>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </CardText>
                  </CardBody>
                </Card>
              </>
            )}

          {orderOverview.status.name.toUpperCase() === "ON_HOLD" && (
            <>
              <div className="d-flex justify-content-between">
                <h3 className="mt-2">
                  <IntlMessages id="orderDetailViewTable.nearByServiceList" />
                </h3>
                <div className="d-flex mb-2">
                  <div className="mt-auto mb-auto">
                    <Select
                      closeMenuOnSelect={false}
                      defaultValue={[{ value: "all", label: "All" }]}
                      value={subscriptions}
                      isMulti
                      onChange={(value) => handleSubscriptionChange(value)}
                      options={[
                        { value: "all", label: "All" },
                        {
                          value: "active_subscription",
                          label: " Active subscription",
                        },
                        {
                          label: "Subscription",
                          options: plans.map((plan) => {
                            return { label: plan.name, value: plan.id };
                          }),
                        },
                      ]}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          backgroundColor: "white",
                          borderColor: "#3f51b5",
                          width: "350px",
                          marginRight: "10px",

                          ":active": {
                            ...styles[":active"],
                            borderColor: "#3f51b5",
                          },
                          ":hover": {
                            ...styles[":hover"],
                            borderColor: "#3f51b5",
                          },
                        }),
                        option: (
                          styles,
                          { data, isDisabled, isFocused, isSelected }
                        ) => {
                          return {
                            ...styles,
                            backgroundColor: "white",
                            cursor: isDisabled ? "not-allowed" : "default",

                            ":active": {
                              ...styles[":active"],
                              backgroundColor: "#3f51b5",
                              color: "white",
                            },
                            ":hover": {
                              ...styles[":hover"],
                              backgroundColor: "#3f51b5",
                              color: "white",
                            },
                          };
                        },
                        multiValue: (styles, { data }) => {
                          return {
                            ...styles,
                            backgroundColor: "#3f51b5",
                            color: "white",
                          };
                        },
                        multiValueLabel: (styles, { data }) => ({
                          ...styles,
                          color: "white",
                        }),
                        multiValueRemove: (styles, { data }) => ({
                          ...styles,
                          color: "white",
                          ":hover": {
                            backgroundColor: "#3f51b5",
                            color: "white",
                          },
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <ButtonDropdown
                      isOpen={distanceDropdown}
                      toggle={toggleDistanceDropdown}
                      style={{ marginRight: "10px" }}
                    >
                      <DropdownToggle color="primary" caret>
                        <IntlMessages id="orderOverview.maxDistance" />{" "}
                        {+selectedDistance / 1000} KM
                      </DropdownToggle>
                      <DropdownMenu>
                        {max_distance.map((distance: any) => {
                          return (
                            <DropdownItem
                              onClick={() =>
                                setSelectedDistance(distance.value)
                              }
                            >
                              {distance.label}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </ButtonDropdown>
                    <ButtonDropdown
                      isOpen={limitDropdown}
                      toggle={toggleLimitDropdown}
                      style={{ marginRight: "10px" }}
                    >
                      <DropdownToggle color="primary" caret>
                        <IntlMessages id="orderOverview.limit" />{" "}
                        {selectedLimit}
                      </DropdownToggle>
                      <DropdownMenu>
                        {limitList.map((limitItem: any) => {
                          return (
                            <DropdownItem
                              onClick={() => setSelectedLimit(limitItem.value)}
                            >
                              {limitItem.label}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </ButtonDropdown>
                    <UserHasPermission permission="booking-service-assign-order-to-service-point">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onServicePointSelect()}
                      >
                        <IntlMessages id="AssignServicePointButton" />
                      </Button>
                    </UserHasPermission>
                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                      onClick={getNearByServicePoint}
                    >
                      <CachedhIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
              <Card className={`shadow border-0`} id="order-details-table">
                <CardBody>
                  <CardText>
                    <div className="table-responsive-material">
                      <Table className="default-table table-unbordered table table-sm table-hover">
                        <TableHead className="th-border-b">
                          <TableRow>
                            <TableCell>
                              <IntlMessages id="orderDetailViewTable.avatar" />
                            </TableCell>
                            <TableCell>
                              <IntlMessages id="orderDetailViewTable.name" />
                            </TableCell>
                            <TableCell className="text-center">
                              Recognitions
                            </TableCell>
                            <TableCell>
                              <IntlMessages id="partnerSettings.zipcode" />
                            </TableCell>
                            <TableCell>
                              <IntlMessages id="servicePoint.distance" />
                            </TableCell>
                            <TableCell className="text-center">
                              Performance
                            </TableCell>
                            <TableCell>
                              <IntlMessages id="partnerEmployee.phone" />
                            </TableCell>
                            <TableCell>
                              <IntlMessages id="partnerEmployee.phone2" />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {isServicePointLoading && !servicePointError && (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                align={"center"}
                                size={"medium"}
                                variant={"head"}
                              >
                                <Spinner
                                  color="primary"
                                  className={"spinner"}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                          {!isServicePointLoading && servicePointError && (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                align={"center"}
                                size={"medium"}
                                variant={"head"}
                              >
                                <h3>{servicePointError}</h3>
                              </TableCell>
                            </TableRow>
                          )}
                          {!isServicePointLoading &&
                            !servicePointError &&
                            servicePoints.length === 0 && (
                              <TableRow>
                                <TableCell
                                  colSpan={6}
                                  align={"center"}
                                  size={"medium"}
                                  variant={"head"}
                                >
                                  <h3>We didn't find any results.</h3>
                                </TableCell>
                              </TableRow>
                            )}
                          {!isServicePointLoading &&
                            !servicePointError &&
                            servicePoints.length !== 0 &&
                            servicePoints.map((point: any) => {
                              return (
                                <TableRow
                                  className={"pointer"}
                                  onClick={() => onServicePointSelect(point)}
                                >
                                  <TableCell>
                                    <Avatar
                                      alt={point.name}
                                      src={
                                        point.avatar
                                          ? point.avatar
                                          : department &&
                                            department.image &&
                                            department.image.small
                                          ? department.image.small
                                          : ""
                                      }
                                      className="user-avatar"
                                    >
                                      {point.name.charAt(0)}
                                    </Avatar>
                                  </TableCell>
                                  <TableCell>{point.name}</TableCell>
                                  <TableCell>
                                    <span>
                                      {point.recognitions.map((rec, recId) => (
                                        <img
                                          className="rec-img mx-2"
                                          key={recId}
                                          src={rec.image}
                                          alt="recognitions"
                                        />
                                      ))}
                                    </span>
                                  </TableCell>
                                  <TableCell>{point.zip_code}</TableCell>
                                  <TableCell>
                                    {(point.distance / 1000).toFixed(2)} KM
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {point.performance && (
                                      <span>
                                        {
                                          point.performance
                                            .orders_in_processing_state
                                        }
                                        -{point.performance.orders_past_30_days}
                                        -
                                        {
                                          point.performance
                                            .orders_total_received
                                        }
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell
                                    className="underlineElement"
                                    onClick={() =>
                                      makeCall(point.phone, point.name)
                                    }
                                  >
                                    {point.phone}
                                  </TableCell>
                                  <TableCell
                                    className="underlineElement"
                                    onClick={() =>
                                      point.phone_2
                                        ? makeCall(point.phone_2, point.name)
                                        : {}
                                    }
                                  >
                                    {point.phone_2 ? point.phone_2 : "-"}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardText>
                </CardBody>
              </Card>
            </>
          )}
          <div className="d-flex justify-content-between">
            <h3 className="mt-2">
              <IntlMessages id="dashboard.comments" />
            </h3>
            <div>
              <UserHasPermission permission="booking-service-create-order-comment">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onShowCreateComment(null)}
                >
                  <IntlMessages id="comments.table.addNewComment" />
                </Button>
              </UserHasPermission>
            </div>
          </div>
          <Card
            className={`shadow border-0`}
            id="order-details-table"
            style={{ marginBottom: "50px" }}
          >
            <CardBody>
              <CardText>
                <div className="table-responsive-material">
                  <Table className="default-table table-unbordered table table-sm table-hover">
                    <TableHead className="th-border-b">
                      <TableRow>
                        <TableCell
                          align={"center"}
                          size={"medium"}
                          variant={"head"}
                        >
                          <IntlMessages id="comments.table.id" />
                        </TableCell>
                        <TableCell
                          align={"center"}
                          size={"medium"}
                          variant={"head"}
                        >
                          <IntlMessages id="comments.visibility" />
                        </TableCell>
                        <TableCell
                          align={"center"}
                          size={"medium"}
                          variant={"head"}
                        >
                          <IntlMessages id="order.name" />
                        </TableCell>
                        <TableCell
                          align={"center"}
                          size={"medium"}
                          variant={"head"}
                        >
                          <IntlMessages id="dashboard.comments" />
                        </TableCell>
                        <TableCell
                          align={"center"}
                          size={"medium"}
                          variant={"head"}
                        >
                          <IntlMessages id="comments.table.createdAt" />
                        </TableCell>
                        <TableCell
                          align={"center"}
                          size={"medium"}
                          variant={"head"}
                        >
                          <IntlMessages id="comments.table.action" />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comments && comments.length !== 0 ? (
                        comments.map((comment: any) => {
                          return (
                            <TableRow>
                              <TableCell
                                align={"center"}
                                size={"medium"}
                                variant={"head"}
                              >
                                {comment.id}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                size={"medium"}
                                variant={"head"}
                              >
                                {comment.visibility === "public" && (
                                  <svg
                                    focusable="false"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 496 512"
                                  >
                                    <path
                                      fill="green"
                                      d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"
                                    ></path>
                                  </svg>
                                )}
                                {comment.visibility === "private" && (
                                  <svg
                                    focusable="false"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                  >
                                    <path
                                      fill="red"
                                      d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
                                    ></path>
                                  </svg>
                                )}
                                {comment.visibility === "service_point" && (
                                  <svg
                                    focusable="false"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                  >
                                    <path
                                      fill="orange"
                                      d="M128 148v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12zm140 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-128 96h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm128 0h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-76 84v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm76 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm180 124v36H0v-36c0-6.6 5.4-12 12-12h19.5V24c0-13.3 10.7-24 24-24h337c13.3 0 24 10.7 24 24v440H436c6.6 0 12 5.4 12 12zM79.5 463H192v-67c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v67h112.5V49L80 48l-.5 415z"
                                    ></path>
                                  </svg>
                                )}
                                {comment.visibility === "customer" && (
                                  <svg
                                    focusable="false"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                  >
                                    <path
                                      fill="#000000"
                                      d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                                    ></path>
                                  </svg>
                                )}
                                {/* <IntlMessages
                                  id={`comments.visibility.${comment.visibility}`}
                                /> */}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                size={"medium"}
                                variant={"head"}
                              >
                                {comment.user && (
                                  <div className="d-flex justify-content-center align-items-center">
                                    <Avatar
                                      alt={comment.user.first_name}
                                      src={comment.user.avatar || "null"}
                                      className="user-avatar"
                                    >
                                      {comment.user.first_name.charAt(0)}
                                    </Avatar>
                                    <span>{`${comment.user.first_name} ${comment.user.last_name}`}</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                size={"medium"}
                                variant={"head"}
                              >
                                {comment.comment}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                size={"medium"}
                                variant={"head"}
                              >
                                {comment.created_at
                                  ? readableDateTimeLocale(
                                      comment.created_at,
                                      localDateTimeFormat
                                    )
                                  : "-"}
                              </TableCell>
                              <TableCell
                                align={"center"}
                                size={"medium"}
                                variant={"head"}
                              >
                                <UserHasPermission permission="booking-service-update-order-comment">
                                  <Button
                                    size="small"
                                    onClick={() => onShowCreateComment(comment)}
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-warning text-white"
                                    color="primary"
                                  >
                                    <svg
                                      width="18px"
                                      focusable="false"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 576 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"
                                      ></path>
                                    </svg>
                                  </Button>
                                </UserHasPermission>
                                <UserHasPermission permission="booking-service-delete-order-comment">
                                  <Button
                                    size="small"
                                    onClick={() => onDeleteComment(comment.id)}
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
                                    color="primary"
                                  >
                                    <svg
                                      focusable="false"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 448 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
                                      ></path>
                                    </svg>
                                  </Button>
                                </UserHasPermission>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            align={"center"}
                            size={"medium"}
                            variant={"head"}
                            colSpan={5}
                          >
                            <h3>There are 0 comments</h3>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardText>
            </CardBody>
          </Card>
        </>
      ) : (
        !Boolean(orderOverview.id) && orderError && <h2> Order {orderError}</h2>
      )}
      {/*{Boolean(orderOverview.service_point_id) && !Boolean(servicePointDetails.id)  && !servicePointDetailsError && <Loader />}*/}
      {Boolean(servicePointDetails.id) && !servicePointDetailsError && (
        <>
          <div className="jr-card p-0">
            <div className="jr-card-1header card-img-top mb-0 p-4 bg-#3f51b5 lighten-4">
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="card-heading">
                  <Link to={`/support/companies/${servicePointDetails.id}`}>
                    {" "}
                    <b>
                      {" "}
                      {servicePointDetails.name || "Service Point Details"}{" "}
                    </b>
                  </Link>
                </h3>
                {[
                  "on_hold",
                  "awaiting_confirmation",
                  "scheduled",
                  "awaiting_completion",
                ].includes(orders?.status?.name) && (
                  <UserHasPermission permission="booking-service-dissociate-service-point">
                    <Button
                      size="small"
                      className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
                      onClick={handleServicePointDissociationPopup}
                      color="primary"
                    >
                      Service-Point-Dissociation
                    </Button>
                  </UserHasPermission>
                )}
              </div>
            </div>
            <div className="card-body mb-4">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {servicePointDetails.avatar && (
                    <div>
                      <img
                        src={servicePointDetails.avatar}
                        height={100}
                        width={100}
                        style={{ margin: "10px" }}
                      />
                    </div>
                  )}
                  <h5>
                    <b> Phone : </b>{" "}
                    <span
                      onClick={() =>
                        servicePointCall(
                          servicePointDetails.name,
                          servicePointDetails.phone,
                          servicePointDetails.avatar
                        )
                      }
                      className="underlineElement"
                    >
                      {servicePointDetails.phone}
                    </span>
                  </h5>
                  {servicePointDetails.phone_2 && (
                    <h5>
                      <b> Phone 2 : </b>{" "}
                      <span
                        onClick={() =>
                          servicePointCall(
                            servicePointDetails.name,
                            servicePointDetails.phone_2,
                            servicePointDetails.avatar
                          )
                        }
                        className="underlineElement"
                      >
                        {servicePointDetails.phone_2}
                      </span>
                    </h5>
                  )}
                  <h5>
                    <b> Email : </b> {servicePointDetails.email}
                  </h5>
                  <h5>
                    <b> Name : </b> {servicePointDetails.name}
                  </h5>
                  <h5>
                    <b> Address :</b>
                    {`${servicePointDetails.street}, ${servicePointDetails.street_number}, ${servicePointDetails.zip_code}, ${servicePointDetails.city}, ${servicePointDetails.country} `}
                  </h5>
                  {Boolean(servicePointDetails.recognitions) && (
                    <div>
                      <h5>
                        <b> Recognitions : </b>{" "}
                      </h5>
                      {servicePointDetails.recognitions.map((rec, recId) => (
                        <img
                          className="rec-img mx-2 mb-1"
                          key={recId}
                          src={rec.image}
                          alt="recognitions"
                        />
                      ))}
                    </div>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <div style={{ marginTop: "20px" }}>
                    <h3>Additional Data : </h3>
                  </div>
                  <Row xs="2">
                    <Col>
                      <h5>
                        <b> Department : </b> {servicePointDetails.department}
                      </h5>
                    </Col>
                  </Row>
                </Grid>
              </Grid>
            </div>
          </div>
        </>
      )}
      {Boolean(orderOverview.id) && showRejectionPrompt && (
        <RejectionPrompt
          show={showRejectionPrompt}
          orderId={orderOverview.id}
          onSuccess={() => fetchOrderRejections(orderOverview.id)}
          onCancel={() => setShowRejectionPrompt(false)}
        />
      )}
      {Boolean(servicePoint) && Boolean(orderOverview.id) && (
        <AssignServicePointPrompt
          show={assignVisible}
          preferredDates={preferredDates}
          hideServicePoint={hideServicePoint}
          onCancel={onAssignServicePromptClose}
          servicePointId={servicePoint}
          orderId={orderOverview.id}
          extraData={{ distance }}
        />
      )}

      <AlertPopUp
        show={callAlert}
        title={<IntlMessages id={"sipCallMakeCall"} />}
        warning={true}
        showCancel={true}
        onCancel={() => setCallAlert(false)}
        onConfirm={callPhone}
      />
      <AlertPopUp
        show={showPopUpValue}
        message={popUpMsg && popUpMsg}
        title={handleTitle()}
        success={popUpType === "success"}
        warning={popUpType === "warning"}
        danger={popUpType === "danger"}
        disabled={popUpType === "loading"}
        showCancel={popUpType === "warning"}
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={handleOnConfirmButton}
        onCancel={handleOnCancelButton}
      />
      {servicePointDissociationPopup && (
        <ServiceDissociationPrompt
          actionError={reasonIdRequiredError}
          show={servicePointDissociationPopup}
          title={"dissociation.popup.title"}
          handleChange={handleReasonChange}
          onConfirm={handleDissociationConfirmation}
          onCancel={handleDissociationPromptClose}
          confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
          cancelBtnText={<IntlMessages id="sweetAlerts.cancelButton" />}
        />
      )}
      <AlertPopUp
        show={dissociationReasonAlert}
        title={<IntlMessages id={"dissociation.alert.msg"} />}
        warning={true}
        showCancel={true}
        onCancel={() => setDissociationReasonAlert(false)}
        onConfirm={sendDissociationRequest}
      />
    </React.Fragment>
  );
};

export default injectIntl(OrderOverView);
