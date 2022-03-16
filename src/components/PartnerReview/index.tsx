import React, { useEffect, useState } from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import UserHasPermission from "util/Permission";
import {
  ButtonDropdown,
  Card,
  CardBody,
  CardText,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  Button,
} from "reactstrap";
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  FormControl,
  TablePagination,
  TableFooter,
  Tooltip,
} from "@material-ui/core";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  getPartnerFeedbackAction,
  getPartnerStatusAction,
  updatePartnerFeedbackAction,
} from "../../actions/Actions/FeedbackActions";
import { SHOW_FEEDBACK, UPDATE_FEEDBACK } from "../../rbac/abilities.constants";
import RBACContext from "../../rbac/rbac.context";
import { Search } from "@material-ui/icons";
import AlertPopUp from "../../common/AlertPopUp";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { readableDate, readableDateTime } from "../../util/helper";
import { useHistory } from "react-router";

const PartnerReview: React.FC<any> = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const feedbackState = useSelector((state: any) => state.feedbackState);

  const [feedbackList, setFeedbackList] = useState<any>([]);
  const [searchFeedback, setSearchFeedback] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [popUpType, setPopUpType] = useState<string>("warning");
  const [popUpMsg, setPopUpMsg] = useState<string>("");
  const [errorStatus, setErrorStatus] = useState<number>(0);

  const [actionId, setActionId] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");
  const [filter, setFilter] = useState<string>("open");
  const [filterList, setFilterList] = useState<any>([{name:"open"},{name:"accepted"},{name:"rejected"}]);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [sort, setSort] = useState<any>({
    sort: {
      id: "asc",
      name: "asc",
      content: "asc",
      rating: "asc",
    },
  });

  // useEffect(() => {
  //   dispatch(
  //     getPartnerStatusAction((response: any) => {
  //       setFilter(response[0].name);
  //       setFilterList(response);
  //     })
  //   );
  // }, []);

  useEffect(() => {
    if (feedbackState.feedbackList) {
      setFeedbackList(feedbackState.feedbackList);
      if (feedbackState.meta) {
        setCount(feedbackState.meta.total);
      }
    }
  }, [feedbackState]);

  useEffect(() => {
    if (filter && !searchFeedback) {
      const sortBase64 = window.btoa(
        unescape(encodeURIComponent(JSON.stringify(sort)))
      );
      getFeedback(searchFeedback);
    }
  }, [page, rowsPerPage, filter, searchFeedback, sort]);

  const getFeedback = (search: string) => {
    dispatch(
      getPartnerFeedbackAction(page, rowsPerPage, searchFeedback)
    );
  };

  const refreshPage = () => {
    const sortBase64 = window.btoa(
      unescape(encodeURIComponent(JSON.stringify(sort)))
    );
    getFeedback(sortBase64);
  };

  const handleChangePage = (event: any, page: any) => {
    setPage(page + 1);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
  };

  const feedbackPopUpHandler = (action: string, id: string) => {
    setActionId(id);
    setActionType(action);
    setPopUpType("warning");
    setShowPopUpValue(true);
  };

  const handleOnConfirmButton = () => {
    if (popUpType === "warning") {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        updatePartnerFeedbackAction(
          actionId,
          actionType,
          (msg: string, errorCode: number) => {
            setPopUpType(msg);
            setErrorStatus(errorCode);
            setShowPopUpValue(true);
          }
        )
      );
    } else if (popUpType === "success") {
      setShowPopUpValue(false);
      setPopUpType("");
      setErrorStatus(0);
    } else {
      setPopUpType("");
      setShowPopUpValue(false);
      setErrorStatus(0);
    }
  };

  const handleOnCancelButton = () => {
    setShowPopUpValue(false);
    setErrorStatus(0);
    setPopUpType("");
    setPopUpMsg("");
  };

  const handleTitle = () => {
    if (actionType === "accept") {
      if (popUpType === "warning") {
        return <IntlMessages id="sweetAlerts.acceptFeedbackWarning" />;
      } else if (popUpType === "success") {
        return <IntlMessages id="sweetAlerts.acceptFeedbackSuccess" />;
      } else if (popUpType === "danger") {
        if (errorStatus !== 0 && errorStatus === 403) {
          return <IntlMessages id="sweetAlerts.AccessPermission" />;
        } else {
          return <IntlMessages id="sweetAlerts.FeedbackError" />;
        }
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    } else if (actionType === "reject") {
      if (popUpType === "warning") {
        return <IntlMessages id="sweetAlerts.rejectFeedbackWarning" />;
      } else if (popUpType === "success") {
        return <IntlMessages id="sweetAlerts.rejectFeedbackSuccess" />;
      } else if (popUpType === "danger") {
        if (errorStatus !== 0 && errorStatus === 403) {
          return <IntlMessages id="sweetAlerts.AccessPermission" />;
        } else {
          return <IntlMessages id="sweetAlerts.FeedbackError" />;
        }
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    } else if (actionType === "recover") {
      if (popUpType === "warning") {
        return <IntlMessages id="sweetAlerts.recoverFeedbackWarning" />;
      } else if (popUpType === "success") {
        return <IntlMessages id="sweetAlerts.recoverFeedbackSuccess" />;
      } else if (popUpType === "danger") {
        if (errorStatus !== 0 && errorStatus === 403) {
          return <IntlMessages id="sweetAlerts.AccessPermission" />;
        } else {
          return <IntlMessages id="sweetAlerts.FeedbackError" />;
        }
      } else {
        return <IntlMessages id="sweetAlerts.sendCallBackLoading" />;
      }
    }
  };

  const onSortChange = (field: string) => {
    const oldSort = { ...sort };
    const newSort = { sort: {} };
    newSort.sort[field] = oldSort.sort[field] === "asc" ? "desc" : "asc";
    delete oldSort.sort[field];
    Object.keys(oldSort.sort).forEach((key) => {
      newSort.sort[key] = oldSort.sort[key];
    });
    setSort(newSort);
  };

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="app-wrapper">
      <ContainerHeader
        title={<IntlMessages id="breadCrumbBar.reviews" />}
        match={props.match}
      />
      <RBACContext.Consumer>
        {({ userCan, abilities }: any) =>
          userCan(abilities, SHOW_FEEDBACK) ? (
            <>
              <div className="d-flex justify-content-between">
                <h3 className="mt-2">
                  <IntlMessages id="feedbackList" />
                </h3>
                <div>
                  <FormControl className="mb-3">
                    <InputLabel htmlFor="search_feedback">
                      <IntlMessages id={"searchFeedbackLabel"} />
                    </InputLabel>
                    <Input
                      id="search_feedback"
                      type="text"
                      value={searchFeedback}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchFeedback(event.target.value)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          {searchFeedback.length ? (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={refreshPage}
                            >
                              <Search />
                            </IconButton>
                          ) : null}
                        </InputAdornment>
                      }
                    />
                  </FormControl>
{/* 
                  <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle color="primary" caret>
                      <IntlMessages id="feedbackFilter" /> - {filter}
                    </DropdownToggle>
                    <DropdownMenu>
                      {filterList &&
                        filterList.map((item: { name: string }) => {
                          return (
                            <DropdownItem onClick={() => setFilter(item.name)}>
                              {item.name}
                            </DropdownItem>
                          );
                        })}
                    </DropdownMenu>
                  </ButtonDropdown> */}
                
                </div>
              </div>

              <Card
                className={`shadow border-0 `}
                id="order-details-table"
                style={{ marginBottom: 50 }}
              >
                <CardBody>
                  <CardText>
                    <div className="table-responsive-material">
                      <Table className="default-table table-unbordered table table-sm table-hover">
                        <TableHead className="th-border-b">
                          <TableCell >
                            <IntlMessages id={"feedbackTable.Id"} />{" "}
                            {/* {sort.sort.id === "asc" ? (
                              <ArrowDownwardIcon />
                            ) : (
                              <ArrowUpwardIcon />
                            )}{" "} */}
                          </TableCell>
                          <TableCell >
                            <IntlMessages id={"feedbackTable.Name"} />{" "}
                            {/* {sort.sort.name === "asc" ? (
                              <ArrowDownwardIcon />
                            ) : (
                              <ArrowUpwardIcon />
                            )}{" "} */}
                          </TableCell>
                          <TableCell >
                            <IntlMessages id={"feedbackTable.Content"} />{" "}
                            {/* {sort.sort.content === "asc" ? (
                              <ArrowDownwardIcon />
                            ) : (
                              <ArrowUpwardIcon />
                            )}{" "} */}
                          </TableCell>
                          <TableCell >
                            <IntlMessages id={"feedbackTable.Rating"} />{" "}
                            {/* {sort.sort.rating === "asc" ? (
                              <ArrowDownwardIcon />
                            ) : (
                              <ArrowUpwardIcon />
                            )}{" "} */}
                          </TableCell>
                          {/* action column */}
                          {/* {filter === "accepted" && (
                            <TableCell>
                              <IntlMessages id={"feedbackTable.Accepted"} />
                            </TableCell>
                          )}
                          {filter === "rejected" && (
                            <TableCell>
                              <IntlMessages id={"feedbackTable.Rejected"} />
                            </TableCell>
                          )}
                          <TableCell>
                            <IntlMessages id={"feedbackTable.Action"} />
                          </TableCell> */}
                          {/* action column */}
                        </TableHead>
                        <TableBody>
                          {!feedbackState.error && feedbackState.loading && (
                            <TableRow>
                              <TableCell colSpan={4}>
                                <Col sm={{ size: 1, offset: 5 }}>
                                  <Spinner color="primary" />
                                </Col>
                              </TableCell>
                            </TableRow>
                          )}
                          {feedbackState.error && !feedbackState.loading && (
                            <TableRow>
                              <TableCell colSpan={4}>
                                <Col sm={{ size: 4, offset: 3 }}>
                                  <h2>{feedbackState.error}</h2>
                                </Col>
                              </TableCell>
                            </TableRow>
                          )}
                          {!Boolean(feedbackList.length) &&
                            !feedbackState.error &&
                            !feedbackState.loading && (
                              <TableRow>
                                <TableCell colSpan={4}>
                                  <Col sm={{ size: 12 }}>
                                    <h2 style={{ textAlign: "center" }}>
                                      <IntlMessages id="partnerReviewEmptyList" />
                                    </h2>
                                  </Col>
                                </TableCell>
                              </TableRow>
                            )}
                          {Boolean(feedbackList.length) &&
                            !feedbackState.error &&
                            !feedbackState.loading &&
                            feedbackList.map((feedback: any) => {
                              return (
                                <TableRow
                                  tabIndex={-1}
                                  key={feedback.id}
                                  style={{ lineHeight: "4" }}
                                >
                                  <TableCell>{feedback.id}</TableCell>
                                  <TableCell>{feedback.name}</TableCell>
                                  <TableCell>
                                    <Tooltip title={feedback.content}>
                                      <p>
                                        {feedback.content
                                          ? feedback.content.slice(0, 50) +
                                            "...."
                                          : ""}
                                      </p>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>{feedback.rating / 10}</TableCell>
                                  {/* {filter !== "open" && (
                                    <TableCell>
                                      {filter === "accepted" &&
                                      feedback.accepted
                                        ? readableDate(feedback.accepted)
                                        : filter === "rejected" &&
                                          feedback.deleted_at
                                        ? readableDateTime(feedback.deleted_at)
                                        : "-"}
                                    </TableCell>
                                  )} */}
                                 {/*  <TableCell>
                                    {filter === "open" && (
                                      <UserHasPermission permission="feedback-service-approve-feedback">
                                        {feedback.rating / 10 < 4 && (
                                          <UserHasPermission permission="feedback-service-allow-approve-bad-feedbacks">
                                            <Button
                                              style={{
                                                backgroundColor: "orange",
                                                borderColor: "orange",
                                              }}
                                              onClick={() =>
                                                feedbackPopUpHandler(
                                                  "accept",
                                                  feedback.id
                                                )
                                              }
                                            >
                                              <IntlMessages
                                                id={"feedbackTable.Approve"}
                                              />
                                            </Button>
                                          </UserHasPermission>
                                        )}
                                        {feedback.rating / 10 >= 4 && (
                                          <Button
                                            style={{
                                              backgroundColor: "orange",
                                              borderColor: "orange",
                                            }}
                                            onClick={() =>
                                              feedbackPopUpHandler(
                                                "accept",
                                                feedback.id
                                              )
                                            }
                                          >
                                            <IntlMessages
                                              id={"feedbackTable.Approve"}
                                            />
                                          </Button>
                                        )}
                                      </UserHasPermission>
                                    )}
                                    {filter !== "rejected" && (
                                      <UserHasPermission permission="feedback-service-delete-feedback">
                                        <Button
                                          color="danger"
                                          onClick={() =>
                                            feedbackPopUpHandler(
                                              "reject",
                                              feedback.id
                                            )
                                          }
                                        >
                                          <IntlMessages
                                            id={"feedbackTable.Reject"}
                                          />
                                        </Button>
                                      </UserHasPermission>
                                    )}
                                    {filter === "rejected" && (
                                      <UserHasPermission permission="feedback-service-recover-rejected-feedback">
                                        <Button
                                          color="danger"
                                          onClick={() =>
                                            feedbackPopUpHandler(
                                              "recover",
                                              feedback.id
                                            )
                                          }
                                        >
                                          <IntlMessages
                                            id={"feedbackTable.Recover"}
                                          />
                                        </Button>
                                      </UserHasPermission>
                                    )}
                                    <UserHasPermission permission="feedback-service-update-feedback">
                                      <Button
                                        color="primary"
                                        onClick={() =>
                                          history.push(
                                            `reviews/${feedback.id}/edit`
                                          )
                                        }
                                      >
                                        Edit
                                      </Button>
                                    </UserHasPermission>
                                  </TableCell>
                                 */}
                                
                                </TableRow>
                              );
                            })}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              count={count}
                              rowsPerPage={rowsPerPage}
                              page={page - 1}
                              onChangePage={handleChangePage}
                              onChangeRowsPerPage={handleChangeRowsPerPage}
                              labelRowsPerPage={<IntlMessages id="tablePaginationLabel"/>}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </CardText>
                </CardBody>
              </Card>
            </>
          ) : (
            <h1 style={{ textAlign: "center" }}>
              <IntlMessages id={"feedbackNoViewPermission"} />
            </h1>
          )
        }
      </RBACContext.Consumer>

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
    </div>
  );
};

export default PartnerReview;
