import React, { Component } from 'react';

import OrderTableCell from './OrderTableCell';
import IntlMessages from "../../util/IntlMessages";
import { IOrderTableProps, IOrderTableState } from './Interface/IndexInterface';
import {
  TableRow,
  TableCell
} from "@material-ui/core";

class OrderTable extends Component<IOrderTableProps, IOrderTableState> {
  render() {
    const { dataList, deleteOrder }: any = this.props;

    let department = "";
    dataList && dataList.map((data, index) => {
      if (data.department == "couriers") {
        return department = "Couriers - department"
      } else {
        return department = "Vehicles - department"
      }
    });

    return (
      <div className={`table-responsive-material ${this.props?.className}`}>
        <table className="default-table table-unbordered table table-sm table-hover">
          <thead className="th-border-b ">
            <tr>
              <th>Id</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Order Date</th>
              <th>Execution Date</th>
              <th>{department}</th>
              <th>Services</th>
              <th>Total</th>
              <th></th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(dataList?.length > 0) ? dataList.map((data, index) => {
              return (
                <OrderTableCell openSearchServiceModal={this.props.openSearchServiceModal} key={index} data={data} deleteOrder={deleteOrder} menuState={this.props.menuState as any} handleRequestClose={this.props.handleRequestClose as any} />
              );
            }) :  (this.props?.className ? <TableRow>
              <TableCell align="center" colSpan={10}><IntlMessages id="order.notFound" /></TableCell>
            </TableRow> : '')}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OrderTable;
