import React, { Component } from 'react';
import { connect } from "react-redux";

import Loader from 'containers/Loader/Loader';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import CallQueueOverviewCell from './CallQueueOverviewCell';
import { getCallQueueOverviewTable } from '../../actions/Actions/callQueueListActions';
import { createStructuredSelector } from 'reselect';
import { selectCallQueueOverviewData, selectLoader, selectSnackbarStatus } from '../../selectors/callQueueListSelectors';
import { ICallQueueOverviewTableProps, ICallQueueOverviewTableState } from './Interface/IndexInterface';
import SnackAlert from '../Snackbar';

class CallQueueOverviewTable extends Component<ICallQueueOverviewTableProps, ICallQueueOverviewTableState> {

  constructor(props: ICallQueueOverviewTableProps) {
    super(props);
    this.state = {
      isLoading: true,
      open: true
    }
  }

  componentDidMount() {
    this.props.getCallQueueOverviewTable();
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { data, loader, snackBar } = this.props
    let loaderComponent;

    if (loader) {
      loaderComponent = <Loader />;
    }

    return (
      <div>
        <ContainerHeader title={<IntlMessages id="breadCrumbBar.callQueueList" />} match={this.props.match} />
        <div className="table-responsive-material">
          <table className="default-table table-unbordered table table-sm table-hover">
            <thead className="th-border-b">
              {data.length ? (<tr>
                <th> <IntlMessages id="callQueueListTable.id" /></th>
                <th> <IntlMessages id="callQueueListTable.name" /></th>
                <th> <IntlMessages id="callQueueListTable.stats" /></th>
                <th> <IntlMessages id="callQueueListTable.description" /></th>
                <th> <IntlMessages id="callQueueListTable.updatedAt" /></th>
                <th> <IntlMessages id="callQueueListTable.createdAt" /></th>
              </tr>) : <h1 className="text-center text-grey mt-5"><IntlMessages id="callQueueListTable.noCallQueueItems" /></h1>}
            </thead>
            <tbody>

              {data && data.map((data) => {
                return (
                  <CallQueueOverviewCell key={data.id} data={data} history={this.props.history} />
                );
              })}

            </tbody>
          </table>
          {loaderComponent}
        </div>

        {/* Custom snackbar gets displayed when the server returns 500 */}
        { snackBar && <SnackAlert open={this.state.open} onClose={this.handleClose} /> } 

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  getCallQueueOverviewTable: () => dispatch(getCallQueueOverviewTable()),
});

const mapStateToProps = createStructuredSelector({
  data: selectCallQueueOverviewData,
  loader: selectLoader,
  snackBar: selectSnackbarStatus
});

export default connect(mapStateToProps, mapDispatchToProps)(CallQueueOverviewTable);
