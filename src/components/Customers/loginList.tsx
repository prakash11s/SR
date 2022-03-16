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
import {readableDateTimeLocale} from "../../util/helper";
const LoginList = ({ list }) => {

    const intl = useIntl();
    const localDateTimeFormat = intl.formatMessage({ id: 'localeDateTime', defaultMessage:"DD-MM-YYYY hh:mm:ss"});

    return (
        <React.Fragment>
            <div className="d-flex justify-content-center">
                <div className="col-12 p-0 table-container">
                    <div className="d-flex justify-content-between">
                        <h3 className="mt-2">
                            <IntlMessages id="customer.Loginlist" />
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
                                                <TableCell> <IntlMessages id="orderOverview.Type" /></TableCell>
                                                <TableCell><IntlMessages id="orderDetailViewTable.userIp"/></TableCell>
                                                <TableCell><IntlMessages id="customer.login.Device"/></TableCell>
                                                <TableCell><IntlMessages id="dashboard.browser"/></TableCell>
                                                <TableCell><IntlMessages id="orderOverview.Date"/></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {list?.length > 0 ? list.map((obj: any, index: any) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell style={{width:300}}>{obj.type}</TableCell>
                                                        <TableCell style={{width:520}}>{obj.ip_address}</TableCell>
                                                        <TableCell style={{width:80}}>{obj?.device?.platform}</TableCell>
                                                        <TableCell style={{width:200}}>{obj.device?.browser}</TableCell>
                                                        <TableCell>{readableDateTimeLocale(obj.created_at,localDateTimeFormat)}</TableCell>
                                                    </TableRow>
                                                );
                                            }) : <TableRow>
                                            <TableCell align="center" colSpan={5}>Logins list is empty.</TableCell>
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

export default LoginList
