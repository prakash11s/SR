import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CardBox from "../CardBox";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import moment from "moment";
import IntlMessages from "../../util/IntlMessages";
 
import { IOrderTableProps, IDataList } from './Interface/OrderTableInterface';
import {Spinner} from "reactstrap";
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";

const OrderTable = (props: IOrderTableProps): JSX.Element => {
    const { dataList, loading, selectedPage, rowsPerPage, itemCount } = props;
    /**
     * handle page change event
     * @param event
     * @param page
     */ 
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number): void => {
        props.onChange({page, rowsPerPage});
    };

    /**
     * handle Per Page change event
     * @param event
     */
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.onChange({page: 0, rowsPerPage: Number(event.target.value)});
    };

    return (
        <div className="table-responsive-material">
            {dataList ? <>
                <div className="row mb-md-3">
                    <CardBox styleName="col-12" cardStyle="p-0" heading="Order List" headerOutside>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell><IntlMessages id="order.name" /></TableCell>
                                    <TableCell align="right"><IntlMessages id="order.status" /></TableCell>
                                    <TableCell align="right"><IntlMessages id="order.phone" /></TableCell>
                                    <TableCell align="right"><IntlMessages id="order.price" /></TableCell>
                                    <TableCell align="right"><IntlMessages id="order.created-at" /></TableCell>
                                    <TableCell align="right"><IntlMessages id="order.updated-at" /></TableCell>
                                    <TableCell align="right"><IntlMessages id="order.action" /></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Boolean(dataList.length) ? dataList.map((data: IDataList, index: number) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell><b>{data.name}</b></TableCell>
                                                <TableCell align="right">{data.status.name}</TableCell>
                                                <TableCell align="right"><div className="underlineElement">{data.phone}</div></TableCell>
                                                <TableCell align="right">{data.price}</TableCell>
                                                <TableCell align="right">{moment(data.created_at).format('MM-DD-YYYY HH:mm:ss')}</TableCell>
                                                <TableCell align="right">{moment(data.updated_at).format('MM-DD-YYYY HH:mm:ss')}</TableCell>
                                                <TableCell>
                                                    <Link to={`/support/orders/${data.id}`}>
                                                        <Button variant="contained"
                                                                className="jr-btn bg-blue-grey text-white m-1">
                                                            <IntlMessages id="orderOptions.open-order"/>
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                    : <TableRow>
                                        <TableCell colSpan={6} align={"center"} size={"medium"} variant={"head"}>
                                            {
                                                loading ? <Spinner color="primary" className={"spinner"}/>
                                                    : "There are 0 records returned from server"
                                            }
                                        </TableCell>
                                    </TableRow>}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        count={itemCount}
                                        rowsPerPage={rowsPerPage}
                                        page={selectedPage}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                        labelRowsPerPage={<IntlMessages id="tablePaginationLabel"/>}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table></CardBox></div></> : ''}
        </div>
    )
};

export default OrderTable;
