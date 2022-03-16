import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../util/Api"
import { getAllPermission } from "actions/Actions/PermissionAction";
import { Card, CardBody, CardText } from 'reactstrap';
import { useIntl } from "react-intl";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    TablePagination,
    Button,
    TableContainer
} from "@material-ui/core";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import { readableDateTimeLocale } from "../../util/helper";


const PermissionsList = ({ list }) => {

    const intl = useIntl();
    const localDateTimeFormat = intl.formatMessage({ id: 'localeDateTime', defaultMessage: "DD-MM-YYYY hh:mm:ss" });

    return (
        <React.Fragment>
            <div className="d-flex justify-content-center">
                <div className="col-12 p-0 table-container">
                    <div className="d-flex justify-content-between">
                        <h3 className="mt-2">
                            <IntlMessages id="customer.permissionlist" />
                        </h3>
                    </div>

                    <Card className={`shadow border-0`}>
                        <CardBody>
                            <CardText>
                                <div className="table-responsive-material">
                                    <TableContainer style={{ maxHeight: 440 }}>
                                        <Table className="default-table table-unbordered table table-sm table-hover" stickyHeader aria-label="sticky table">
                                            <TableHead className="th-border-b">
                                                <TableRow>
                                                    <TableCell><IntlMessages id="partnerEmployee.name" /></TableCell>
                                                    <TableCell><IntlMessages id="customer.permissionlist.Title"/></TableCell>
                                                    <TableCell><IntlMessages id="customer.DeleteProtaction"/></TableCell>
                                                    <TableCell><IntlMessages id="orderOverview.Date"/></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {list?.length > 0 ? list.map((obj: any, index: any) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell style={{ width: 300 }} >{obj.name}</TableCell>
                                                            <TableCell style={{ width: 600 }}>{obj.title}</TableCell>
                                                            <TableCell style={{ width: 200 }}>{obj?.delete_protection}</TableCell>
                                                            <TableCell >{readableDateTimeLocale(obj.created_at, localDateTimeFormat)}</TableCell>
                                                        </TableRow>
                                                    );
                                                }) : <TableRow>
                                                    <TableCell align="center" colSpan={4}><IntlMessages id="customer.permission.notFound" /></TableCell>
                                                </TableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </CardText>
                        </CardBody>
                    </Card>

                </div>
            </div>
        </React.Fragment>
    )
}

export default PermissionsList
