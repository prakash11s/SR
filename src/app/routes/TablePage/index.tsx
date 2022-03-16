import React from "react";
import { connect } from 'react-redux';
import { Card, CardBody, CardText } from 'reactstrap';
import Avatar from '@material-ui/core/Avatar';
import { Button } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { Link } from 'react-router-dom';

import IntlMessages from '../../../util/IntlMessages';
import softPhoneService from '../../../components/Phone/softPhone.service';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import api from "../../../util/Api";
import { setCallQueueIdData } from '../../../actions/Actions/callQueueListActions';
import { callQueueIdData } from '../../../selectors/callQueueListSelectors';
import SipCallService from "../../../components/Phone/SipCallService";

class TablePage extends React.Component<any,any> {

  constructor(props:any) {
    super(props);
    this.state = {
      userData: [],
      meta: {},
      isTableLoading: false,
      limit: 50,
      page: 1
    };
    this.badgeColor = this.badgeColor.bind(this);
  }


  componentDidMount() {
    this.getQueueEntries();
    this.props.setCallQueueIdData(this.props.match.params.id)
  }

  getQueueEntries = () => {
    const id = this.props.match.params.id;
    this.setState({ isTableLoading: true })
    api(`/call-queues/${id}/entries?limit=${this.state.limit}&page=${this.state.page}`).then(respones => {
      const data = respones.data.data;
      this.setState({ userData: [...this.state.userData, ...data], meta: respones.data.meta, isTableLoading: false });
    });
  }

  badgeColor(status:any) {
    let statusStyle;
    if (status.includes("available")) {
      statusStyle = "text-white bg-info";
    } else if (status.includes("in_queue")) {
      statusStyle = "bg-amber";
    } else if (status.includes("rejected")) {
      statusStyle = "text-white bg-danger";
    } else if (status.includes("reserved")) {
      statusStyle = "text-black bg-yellow";
    } else if (status.includes("approved")) {
      statusStyle = "text-white bg-success";
    } else if (status.includes("deleted")) {
      statusStyle = "text-white bg-danger";
    } else if (status.includes("unsubscribe")) {
      statusStyle = "text-white bg-danger";
    }
    return statusStyle;
  }

  callPhone = (user:any) => {
      const callData = {
        id: user.id,
        phoneNumber: user.phone,
        type: 'call-queue'
      }
      SipCallService.startCall(callData);
      //softPhoneService.connectCall(callData);
  }

  fetchData = () => {
    this.setState({ page: this.state.page + 1 }, () => this.getQueueEntries())
  }

  render() {
    const tableLoading = this.state.isTableLoading && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));
    const { userData, meta } = this.state;
    const { callQueueIdData } = this.props
    return (
      <div>
        <div className="d-flex justify-content-center">

          <div className="col-12 table-container">
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="card jr-card-intra shadow text-center">
                  <div className="card-header py-3 d-flex align-items-center">
                    <h3 className="mb-0"><IntlMessages id="viewCallQueueListHeading.totalEntries" /></h3>
                  </div>
                  <div className="stack-order  py-4 px-2">
                    <h1 className="chart-f30">{meta.total}</h1>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="card jr-card-intra shadow text-center">
                  <div className="card-header py-3 d-flex align-items-center">
                    <h3 className="mb-0"><IntlMessages id="viewCallQueueListHeading.approved" /></h3>
                  </div>
                  <div className="stack-order  py-4 px-2">
                    <h1 className="chart-f30">{meta.approved}</h1>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="card jr-card-intra shadow text-center">
                  <div className="card-header py-3 d-flex align-items-center">
                    <h3 className="mb-0"><IntlMessages id="viewCallQueueListHeading.rejected" /></h3>
                  </div>
                  <div className="stack-order  py-4 px-2">
                    <h1 className="chart-f30">{meta.rejected}</h1>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="card jr-card-intra shadow text-center">
                  <div className="card-header py-3 d-flex align-items-center">
                    <h3 className="mb-0"><IntlMessages id="viewCallQueueListHeading.reserved" /></h3>
                  </div>
                  <div className="stack-order  py-4 px-2">
                    <h1 className="chart-f30">{meta.reserved}</h1>
                  </div>
                </div>
              </div>
            </div>

            {callQueueIdData &&
            <div className="jr-card p-0">
                 <div className="jr-card-1header card-img-top mb-0 p-4 bg-grey lighten-4 d-flex">
                    <div className="pt-3"><h3 className="card-heading"><b> <IntlMessages id="callQueueListEdit.name" /> : </b>{callQueueIdData.name}</h3></div>
                    <img src={callQueueIdData.image} alt={callQueueIdData.name} className="img-responsive pl-2" style={{width:"100px", height:"50px"}}/>
                </div>

                <div className="card-body">
                    <ul className="contact-list list-unstyled">
                        <li className="media">
                            <span className="media-body">
                                <b> <IntlMessages id="callQueueListEdit.id" /> : </b>{callQueueIdData.id}
                            </span>
                            <span className="media-body">

                            <b> <IntlMessages id="callQueueListEdit.department" /> : </b>
                                {callQueueIdData.department}
                            </span>
                            <span className="media-body">
                               <b> <IntlMessages id="callQueueListEdit.description" /> : </b> {callQueueIdData.description}
                            </span>

                            <span className="media-body">
                            <b> <IntlMessages id="callQueueListEdit.order" /> : </b> {callQueueIdData.order}
                        </span>
                        </li>

                        <li className="media">
                            <span className="media-body">
                                <b><IntlMessages id="callQueueListEdit.createdAt" />:</b> {moment(callQueueIdData.created_at).format('MM-DD-YYYY HH:mm:ss')}
                            </span>
                            <span className="media-body">
                                <b><IntlMessages id="callQueueListEdit.updatedAt" />:</b> {moment(callQueueIdData.updated_at).format('MM-DD-YYYY HH:mm:ss')}
                            </span>
                        </li>
                    </ul>

	                   <Link to={`/support/call-queues/${callQueueIdData.id}/edit`} className="mr-3">
                         <Button size="small"
	                        className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-warning text-white"
	                        color="primary"><IntlMessages id="callQueueListEdit.edit" /></Button>
                    </Link>
                    <Button size="small"
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
                            color="primary"><IntlMessages id="callQueueListEdit.delete" /></Button>
                    {/*<Button size="small"*/}
                    {/*        className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn  bg-light-green text-white"*/}
                    {/*        color="primary"><IntlMessages id="callQueueListEdit.cancel" /></Button>*/}
                    {/*<Button size="small"*/}
                    {/*        className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-gray text-black"*/}
                    {/*        color="primary"><IntlMessages id="callQueueListEdit.sendCallbackRequest" /></Button>*/}
                    {/*<Link to={`/support/call-queues/${callQueueIdData.id}/entries`} className="mr-3">*/}
                    {/*    <Button size="small"*/}
                    {/*            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-warning text-white"*/}
                    {/*            color="primary"><IntlMessages id="callQueueListEdit.entries" /></Button>*/}
                    {/*</Link>*/}
                </div>
            </div> }


            <div>
              <Card className={`shadow border-0 `} id="order-table">
                <CardBody>
                  <CardText>
                    <InfiniteScroll
                      height="60vh"
                      loader={tableLoading}
                      dataLength={userData.length} //This is important field to render the next data
                      next={this.fetchData}
                      hasMore={meta && meta.has_more_pages}
                      endMessage={
                        <p style={{ textAlign: 'center' }}>
                          <b><IntlMessages id="infinityScrollBar.noDataLeft" /></b>
                        </p>
                      }
                    >
                      <div className="table-responsive-material">
                        <table className="default-table table-unbordered table table-sm table-hover">
                          <thead className="th-border-b">
                            <tr>
                              <th><IntlMessages id="callQueueEntries.name" /></th>
                              <th><IntlMessages id="callQueueEntries.phone" /></th>
                              <th><IntlMessages id="callQueueEntries.email" /></th>
                              <th><IntlMessages id="callQueueEntries.status" /></th>
                              <th><IntlMessages id="callQueueEntries.createdAt" /></th>
                              <th><IntlMessages id="callQueueEntries.updatedAt" /> </th>
                            </tr>
                          </thead>
                          <tbody>
                            {userData.map((data:any) => {
                              return (
                                <tr
                                  tabIndex={-1}
                                  key={data.id}
                                >
                                  <td>
                                    <div className="user-profile d-flex flex-row align-items-center">
                                      <Avatar
                                        alt={data.name}
                                        src={data.image}
                                        className="user-avatar"
                                      >
                                      {data.name.charAt(0)}
                                      </Avatar>
                                      <div className="user-detail">
                                        <h5 className="user-name">{data.name} </h5>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="underlineElement" onClick={() => this.callPhone(data)}>{data.phone}</td>
                                  <td>{data.email}</td>
                                  <td className="">
                                    <div className={` badge text-uppercase ${this.badgeColor(data.status)}`}>{data.status}</div>
                                  </td>
                                  <td>{moment(data.created_at).format('DD-MM-YYYY hh:mm')}</td>
                                  <td>{moment(data.updated_at).format('DD-MM-YYYY hh:mm')}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </InfiniteScroll>
                  </CardText>
                </CardBody>
              </Card>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCallQueueIdData: (id) => dispatch(setCallQueueIdData(id))
  }
};

const mapStateToProps = createStructuredSelector(
  {
    callQueueIdData: callQueueIdData
  });

export default connect(mapStateToProps, mapDispatchToProps)(TablePage);
