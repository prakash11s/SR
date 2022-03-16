import React, { useState } from "react";
import { Card, CardBody, CardText } from 'reactstrap';

import {
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer
} from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
import IntlMessages from 'util/IntlMessages';

const OrderList = ({orderList}) => {
    let department = "";
    orderList && orderList.map((data,index)=>{
        if(data.department == "couriers"){
          return department = "Couriers - department"
        }else{
          return department = "Vehicles - department"
        }
    });
    return (
        <React.Fragment>
            <div className="d-flex justify-content-center">
                <div className="col-12 p-0 table-container">
                    <div className="d-flex justify-content-between">
                        <h3 className="mt-2">
                            <IntlMessages id="breadCrumbBar.ordersList" />
                        </h3>
                    </div>
                    {orderList.length > 0 ?
                        <Card className={`shadow border-0`}>
                            <CardBody>
                                <CardText>
                                    <div className="table-responsive-material">
                                    <TableContainer style={{ maxHeight: 440 }}>
                                        <Table className="default-table table-unbordered table table-sm table-hover" stickyHeader aria-label="sticky table">
                                            <TableHead className="th-border-b">
                                                <TableRow>
                                                    <TableCell>Id</TableCell>
                                                    <TableCell>Customer</TableCell>
                                                    <TableCell>Contact</TableCell>
                                                    <TableCell>Order Date</TableCell>
                                                    <TableCell>{department}</TableCell>
                                                    <TableCell>Services</TableCell>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderList && orderList.map((list: any, index: any) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{list.id}</TableCell>
                                                            <TableCell>{list.name}</TableCell>
                                                            <TableCell>{list.phone}{list.email}</TableCell>
                                                            <TableCell>{list.services[0].name}{list.services[0].price}</TableCell>
                                                            <TableCell>{list.meta.total_price}</TableCell>
                                                            <TableCell>{list.meta.total_price}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                        </TableContainer>
                                    </div>
                                </CardText>
                            </CardBody>
                        </Card>
                        : ''}


                </div>
            </div>
        </React.Fragment>
    )
}

export default OrderList
