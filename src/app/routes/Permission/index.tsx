import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllPermission} from "actions/Actions/PermissionAction";
import { Card, CardBody, CardText } from 'reactstrap';

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    TablePagination,
    Button
} from "@material-ui/core";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';

const Permission = (props) => {

    const [permissionList, setPermissionList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, SetRowsPerPage] = useState(10);
    const [sweetAlertDelete, setSweetAlertDelete] = useState(false);
    const [sweetAlertSuccess, setSweetAlertSuccess] = useState(false);
    const permissions = useSelector((state:any) => state.permissionState.permissions);
    const dispatch = useDispatch();

    /**
     * handle page change event
     * @param event
     * @param page
     */
    const handleChangePage = (event:any, page:any) => {
        setPage(page);
    };

    /**
     * handle Per Page change event
     * @param event
     */
    const handleChangeRowsPerPage = (event:any) => {
        SetRowsPerPage(event.target.value);
    };

    /**
     * Delete permissions
     */
    const deletePermission = () => {
        setSweetAlertDelete(false)
        setSweetAlertSuccess(true)
    };
    /**
     * Dispatch action for getting all the permission
     */
    useEffect(() => {
        dispatch(getAllPermission());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    /**
     * setting permission list in local state
     */
    useEffect(() => {
        setPermissionList(permissions.data)
    }, [permissions])

    return (
        <React.Fragment>
            <div className="d-flex justify-content-center app-wrapper">
                <div className="col-12 table-container">
                    <ContainerHeader title={<IntlMessages id="breadCrumb.permission"/>} match={props.match} />

                    {permissionList ?
                                <Card className={`shadow border-0`}>
                                    <CardBody>
                                        <CardText>
                                            <div className="table-responsive-material">
                                    <Table className="default-table table-unbordered table table-sm table-hover">
                                        <TableHead className="th-border-b">
                                            <TableRow>
                                                <TableCell>Id</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Created at</TableCell>
                                                <TableCell>Updated at</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {permissionList && permissionList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((permission:any, index:any) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>{permission.id}</TableCell>
                                                        <TableCell>{permission.name}</TableCell>
                                                        <TableCell>{permission.title}</TableCell>
                                                        <TableCell>{moment(permission.created_at).format('MM-DD-YYYY HH:mm:ss')}</TableCell>
                                                        <TableCell>{moment(permission.updated_at).format('MM-DD-YYYY HH:mm:ss')}</TableCell>
                                                        <TableCell>
                                                            <Button variant="contained" className="jr-btn bg-red text-white" onClick={() => setSweetAlertDelete(true)} >Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    count={permissionList.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
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
                        : ''}

                </div>
            </div>

            <SweetAlert show={sweetAlertDelete} warning showCancel
                        confirmBtnText="Delete"
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title="Delete !"
                        onConfirm={() => deletePermission()}
                        onCancel={() => setSweetAlertDelete(false)}>
                Are you sure want to delete permission ?
            </SweetAlert>
            <SweetAlert show={sweetAlertSuccess} success title="Success" confirmBtnText="Okay"
                        onConfirm={() => setSweetAlertSuccess(false)}>
                Deleted Successfully
            </SweetAlert>
        </React.Fragment>
    )
}

export default Permission
