import React, { Component } from "react";
import { Card, CardBody, CardText, Spinner } from "reactstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Avatar,
  CircularProgress,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import IntlMessages from "../../util/IntlMessages";
import {
  Istate,
  IData,
  ICompaniesTableProps,
  IRootCompaniesState,
} from "./Interface/indexInterface";
import {
  getQueueEntries,
  getSearchData,
  clearReducerData,
  clearCompanyData,
} from "../../actions/Actions/ComapaniesActions";
import SipCallService from "../Phone/SipCallService";
import AlertPopUp from "../../common/AlertPopUp";

class CompaniesTable extends Component<ICompaniesTableProps, Istate> {
  constructor(props: ICompaniesTableProps) {
    super(props);
    this.state = {
      limit: 25,
      page: 1,
      searchData: "",
      avatar: "",
      callNumber: "",
      callName: "",
      callAlert: false,
      showDeleted: false,
    };
  }

  componentDidMount() {
    this.props.clearCompanyData();
    this.getQueueEntries();
  }

  getQueueEntries = (addData = false, showDeleted = false) => {
    this.props.getQueueEntries(
      this.state.limit,
      this.state.page,
      addData,
      showDeleted
    );
    this.setState({ searchData: "" });
  };

  callPhone = (phoneNumber: number, name: string, avatar: string) => {
    if (!this.props.callState.showOngoingCallPad) {
      this.setState({
        ...this.state,
        avatar: avatar,
        callNumber: phoneNumber.toString(),
        callName: name,
        callAlert: true,
      });
    }
    //SipCallService.startCall(phoneNumber, name, avatar);
  };

  callCancel = () => {
    this.setState({
      ...this.state,
      callAlert: false,
      callName: "",
      callNumber: "",
      avatar: "",
    });
  };

  makeCall = () => {
    this.setState({
      ...this.state,
      callAlert: false,
    });
    SipCallService.startCall(this.state.callNumber, this.state.callName);
  };

  onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, searchData: event.currentTarget.value });
  };

  clearData = (showDeleted = false) => {
    this.setState({ page: 1 });
    this.props.clearReducerData();
    this.getQueueEntries(false, showDeleted);
  };

  fetchData = () => {
    if (this.state.searchData !== "") {
      this.setState({ page: this.state.page + 1 }, () =>
        this.getSearchData(true)
      );
    } else {
      this.setState({ page: this.state.page + 1 }, () =>
        this.getQueueEntries(true, this.state.showDeleted)
      );
    }
  };

  onClickShowDeleted = (e) => {
    const checked = e.target.checked;
    this.props.clearReducerData();
    this.setState({ page: 1, showDeleted: checked }, () => {
      if (this.state.searchData !== "") {
        this.getSearchData(true);
      } else {
        this.getQueueEntries(false, checked);
      }
    });
  };

  getSearchData = (addData = false) => {
    this.props.getSearchData(
      this.state.limit,
      this.state.page,
      this.state.searchData,
      addData,
      this.state.showDeleted
    );
  };

  onSearch = () => {
    this.setState({ page: 1 }, () => this.getSearchData());
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.onSearch();
  };

  render() {
    const { companyData, meta, listError, isTableLoading } = this.props;

    const tableLoading = isTableLoading && (
      <div className="d-flex justify-content-center">
        <CircularProgress className="infinite-loader" />
      </div>
    );

    return (
    
        <>
        <div className="d-flex justify-content-center">
          <div className="col-12 table-container">

            <div>
              <>
                <div className="d-sm-flex justify-content-sm-between align-items-sm-center d-flex">
                  <form
                    style={{ width: "85%" }}
                    className="input-group mb-3 "
                    onSubmit={this.handleSubmit}
                  >
                    <input
                      type="text"
                      className="form-control col-2"
                      placeholder="Service Point"
                      aria-label="servicePointSearch"
                      aria-describedby="inputGroup-sizing-default"
                      onChange={(event) => this.onChangeHandler(event)}
                      value={this.state.searchData}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm ml-1 mr-1"
                      onClick={() => this.onSearch()}
                    >
                      <IntlMessages id="companiesTable.search" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => this.clearData(this.state.showDeleted)}
                    >
                      <IntlMessages id="companiesTable.clearSearch" />
                    </button>
                  </form>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={this.onClickShowDeleted}
                        color="primary"
                      />
                    }
                    label={<IntlMessages id="companiesTable.showDeleted" />}
                  />
                </div>
                <Card className={`shadow border-0 `} id="order-table">
                  <CardBody>
                    <CardText>
                      {!listError  ? (
                        <InfiniteScroll
                          height="60vh"
                          dataLength={companyData.length} //This is important field to render the next data
                          next={() => this.fetchData()}
                          hasMore={ meta && meta.has_more_pages}
                          loader={tableLoading}
                          endMessage={
                            companyData.length > 0 && (
                              <p style={{ textAlign: "center" }}>
                              <b>
                                <IntlMessages id="infinityScrollBar.noDataLeft" />
                              </b>
                            </p>
                            )

                          }
                        >
                          <div className="table-responsive-material">
                            <Table className="default-table table-unbordered table table-sm table-hover">
                              <TableHead className="th-border-b">
                                <TableRow>
                                  <TableCell>
                                    <IntlMessages id="companiesTable.name" />
                                  </TableCell>
                                  <TableCell>
                                    <IntlMessages id="companiesTable.recognition" />
                                  </TableCell>
                                  <TableCell>
                                    <IntlMessages id="companiesTable.city" />
                                  </TableCell>
                                  <TableCell>
                                    <IntlMessages id="companiesTable.phone" />
                                  </TableCell>
                                  {/* <TableCell><IntlMessages id="companiesTable.id"/></TableCell> */}
                                  <TableCell>
                                    <IntlMessages id="companiesTable.action" />
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {companyData.length > 0 ? (
                                  companyData.map((data: IData) => {
                                    var sortRecognitions =
                                      data.recognitions &&
                                      data.recognitions.length > 0
                                        ? data.recognitions.sort((a, b) => {
                                            if (a.name > b.name) return 1;
                                            if (a.name < b.name) return -1;
                                            return 0;
                                          })
                                        : [];
                                    return (
                                      <TableRow tabIndex={-1} key={data.id}>
                                        <TableCell>
                                          <div className="user-profile d-flex flex-row align-items-center">
                                            <Avatar
                                              alt={data.name}
                                              src={
                                                data.avatar ? data.avatar : ""
                                              }
                                              className="user-avatar"
                                            >
                                              {!data.avatar &&
                                                data.name.charAt(0)}
                                            </Avatar>
                                            <div className="user-detail">
                                              <h5 className="user-name">
                                                {data.name}{" "}
                                              </h5>
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          {sortRecognitions.length > 0
                                            ? sortRecognitions
                                                .sort((a, b) => a.name - b.name)
                                                .map((rec, recId) => (
                                                  <img
                                                    className="rec-img mx-2"
                                                    key={recId}
                                                    src={rec.image}
                                                    alt="recognition"
                                                  />
                                                ))
                                            : ""}
                                        </TableCell>
                                        <TableCell>{data.city}</TableCell>
                                        <TableCell
                                          className="underlineElement"
                                          onClick={() =>
                                            this.callPhone(
                                              data.phone,
                                              data.name,
                                              data.avatar
                                            )
                                          }
                                        >
                                          {data.phone}
                                        </TableCell>
                                        {/* <TableCell>{data.id}</TableCell> */}
                                        <TableCell>
                                          <Link
                                            to={`companies/${data.id}?view-stats=true`}
                                          >
                                            <Button
                                              variant="contained"
                                              className="jr-btn bg-blue-grey text-white m-1"
                                            >
                                              <IntlMessages id="companiesTable.statsButton" />
                                            </Button>
                                          </Link>
                                          <Link to={`companies/${data.id}`}>
                                            <Button
                                              variant="contained"
                                              className="jr-btn bg-blue-grey text-white m-1"
                                            >
                                              <IntlMessages id="companiesTable.openButton" />
                                            </Button>
                                          </Link>
                                          <Link to={`companies/${data.id}/services`}>
                                            <Button
                                              variant="contained"
                                              className="jr-btn bg-blue-grey text-white m-1"
                                            >
                                              <IntlMessages id="sidebar.services" />
                                            </Button>
                                          </Link>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={5}
                                      align={"center"}
                                      size={"medium"}
                                      variant={"head"}
                                    >
                                      {/* <Spinner
                                        color="primary"
                                        className={"spinner"}
                                      /> */}
                                      <IntlMessages id="paginationTable.noData" />
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </InfiniteScroll>
                      ) : (
                        <h3 style={{ textAlign: "center" }}>{listError}</h3>
                      )}
                    </CardText>
                  </CardBody>
                </Card>
              </>
            </div>
          </div>
        </div>
        <AlertPopUp
          show={this.state.callAlert}
          title={<IntlMessages id={"sipCallMakeCall"} />}
          warning={true}
          showCancel={true}
          onCancel={this.callCancel}
          onConfirm={this.makeCall}
        />
        </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getQueueEntries: (
      limit: number,
      page: number,
      addData?: boolean,
      deleted?: boolean
    ) => dispatch(getQueueEntries(limit, page, addData, deleted)),
    getSearchData: (
      limit: number,
      page: number,
      searchData: string,
      addData?: boolean,
      deleted?: boolean
    ) => dispatch(getSearchData(limit, page, searchData, addData, deleted)),
    clearReducerData: () => dispatch(clearReducerData()),
    clearCompanyData: () => dispatch(clearCompanyData()),
  };
};

const mapStateToProps = (state: IRootCompaniesState) => {
  return {
    companyData: state.companyState.queueEntries.data,
    meta: state.companyState.queueEntries.meta,
    isTableLoading: state.companyState.isTableLoading,
    listError: state.companyState.error,
    callState: state.softPhone.Call,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompaniesTable as any);
