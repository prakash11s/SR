import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPhoneSystemCallHistories, getPhoneSystemCallHistoriesRecordings } from 'actions/Actions/Support';
import IntlMessages from 'util/IntlMessages';
import InfiniteScroll from 'react-infinite-scroll-component';
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, CardBody, CardText, CardTitle } from 'reactstrap';
import Loader from 'containers/Loader/Loader';
import ContainerHeader from './../../../../components/ContainerHeader';
import Moment from 'react-moment';
import './callHistories.scss';

class PhoneSystem extends React.Component {
  state = {
    dataList: [],
    metData: [],
    pageSize: 25,
    pageIndex: 0,
    playing: false,
    page: 1,
    isLoading: false,
    isTableLoading: false,
    tableLoading: false,
    audioPlayer: false,
    playPauseButton: true,
    audioToggle: true
  }

  componentDidMount() {
    try {

      this.setState({ tableLoading: true });
      this.props.getPhoneSystemCallHistories(1, 25);
      this.setState({ dataList: this.props.callHistories })
    } catch (error) {
      this.setState({ tableLoading: false });
    }

  }

  // handle event of change page of pagination
  handleChangePage(event) {
    this.setState({ pageIndex: event.target.value })
    this.props.getPhoneSystemCallHistories(event.target.value, this.state.pageIndex + 1);
  }

  // handle event of change row per page of pagination
  handleChangeRowsPerPage(event) {
    this.setState({ pageSize: event.target.value })
    this.props.getPhoneSystemCallHistories(this.state.pageIndex + 1, event.target.value);
  }

  // get phonesyaytem call hsitories recordings
  playRecording = (id) => {
    this.props.getPhoneSystemCallHistoriesRecordings(id)
    this.setState({ playing: !this.state.playing })
  }

  audioplayer = () => {
    this.setState({ playPauseButton: false, audioPlayer: true });
  }

  async getOrders(addData = false) {
    try {
      this.setState({ isLoading: !addData ? true : false, isTableLoading: addData ? true : false });
      this.props.getPhoneSystemCallHistories(this.state.page, this.state.pageSize);
    } catch (err) {
      this.setState({ isLoading: false, isTableLoading: false });
      console.log(err);
    }
  }

  fetchData() {
    this.setState({ page: this.state.page + 1 }, () => this.getOrders(true))
  }

  render() {
    const tableLoading = this.state.isTableLoading && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));
    const { callHistories, callHistoriesMeta } = this.props;

    return (
      <div className="animated slideInUpTiny animation-duration-3" style={{ marginBottom: '100px' }}>
        {this.state.isLoading && <Loader />}
       <div className="table-responsive-material table-design">
        <ContainerHeader title={<IntlMessages id="breadCrumbBar.Call Histories" />} match={this.props.match} statuses={this.state.statuses} toggleSelectedFilters={this.toggleSelectedFilters} selectedFilters={this.state.selectedFilters} />
        <Card className="shadow border-0 " id='order-table'>
          <CardBody>
            <CardTitle></CardTitle>
            <CardText>
              <InfiniteScroll
                height="80vh"
                loading={tableLoading}
                dataLength={callHistories.length}  //This is important field to render the next data
                next={this.fetchData.bind(this)}
                hasMore={callHistoriesMeta && callHistoriesMeta.has_more_pages}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>No Data Left</b>
                  </p>
                }
              >
                < table className="default-table table-unbordered table table-sm table-hover" >
                  <thead className="th-border-b ">
                    <tr>
                      <th className="table-head" > <IntlMessages id="callHistory.phone-number" /></th>
                      <th className="table-head" > <IntlMessages id="callHistory.call-duration" /></th>
                      <th className="table-head" > <IntlMessages id="callHistory.direction" /></th>
                      <th className="table-head" > <IntlMessages id="callHistory.agent" /></th>
                      <th className="table-head" > <IntlMessages id="callHistory.Recording" /></th>
                      <th className="table-head" > <IntlMessages id="callHistory.created_at" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {callHistories.map(history => {
                      return (
                        <tr className="user-details" data-id={history.id}>
                          <td align="left" className="user-profile">{history.phone_number} </td>
                          <td align="left" className="user-profile">{history.call_duration} </td>
                          <td align="left" className="user-profile">{history.direction} </td>
                          <td align="left" className="user-profile">{history.agent.name}</td>
                          <td align="left" className="user-profile"><div >{this.state.audioToggle && history.src && <div className="d-flex align-items-center"> <audio controls>  <source src={history.src}></source> </audio> </div>}  <span>{!history.src && (<Button size="small" className="jr-btn jr-btn-sm" color="secondary" disabled={!history.recording_available} onClick={() => this.playRecording(history.id)} >
                            <span>{history.isPlaying ? <IntlMessages id="pause" /> : <IntlMessages id="play" />}</span>
                          </Button>)} </span>   </div>
                          </td>
                          <td align="left" className="user-profile"><Moment format="DD-MM-YYYY hh:mm:ss">{history.created_at}</Moment></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table >
              </InfiniteScroll>
            </CardText>
          </CardBody>
        </Card>
      </div>
    </div >
  );
  }
}

const mapStateToProps = (state) => {
  return {
    callHistories: state.supportState.callHistories,
    callHistoriesMeta: state.supportState.callHistoriesMeta,
    callHistoriesRecording: state.supportState.callHistoriesRecording
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getPhoneSystemCallHistories,
    getPhoneSystemCallHistoriesRecordings
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneSystem)
