import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Fab from "@material-ui/core/Fab";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CardBox from "../CardBox";
import Avatar from "@material-ui/core/Avatar";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import moment from "moment";
import { useSelector } from "react-redux";
import IntlMessages from "../../util/IntlMessages";
import UserHasPermission from "../../util/Permission";
import { Spinner } from "reactstrap";

import {
  IEmployeeTableProps,
  IDataList,
} from "./Interface/EmployeeTableInterface";
import { Button } from "@material-ui/core";

const EmployeeTable = (props: IEmployeeTableProps): JSX.Element => {
  /**
   * handle state for EmployeeTable
   */
  const page =
    props.meta && props.meta.hasOwnProperty("page") ? props.meta.page - 1 : 0;
  const total =
    props.meta && props.meta.hasOwnProperty("total")
      ? props.meta.total
      : props.dataList.length;
  const limit =
    props.meta && props.meta.hasOwnProperty("limit")
      ? props.meta.limit
      : props.dataList.length;
  const [rowsPerPage, SetRowsPerPage] = useState<number>(25);

  /**
   * get employee list state from redux
   * */
  const employeePayload = useSelector((state: any) => state.employeeState);
  const authUser = useSelector((state: any) => state.auth.authUser);
  const loading = employeePayload.loading;
  const error = employeePayload.error;

  /**
   * handle page change event
   * @param event
   * @param page
   */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void => {
    props.onChange({ page, limit });
  };

  /**
   * handle Per Page change event
   * @param event
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    SetRowsPerPage(Number(event.target.value));
    props.onChange({ page: 0, limit: Number(event.target.value) });
  };

  const { onRowClick, deleteEmployee, dataList, toggleCreateModal, notificationAction } = props;
  return (
    <div className="table-responsive-material">
      {dataList ? (
        <>
          <div className="row mb-md-3">
            <CardBox styleName="col-12" cardStyle="p-0" headerOutside>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <IntlMessages id="employee.profile" />
                    </TableCell>
                    <TableCell>
                      <IntlMessages id="employee.first-name" />
                    </TableCell>
                    <TableCell align="right">
                      <IntlMessages id="employee.last-name" />
                    </TableCell>
                    <TableCell align="right">
                      <IntlMessages id="employee.email" />
                    </TableCell>
                    <TableCell align="right">
                      <IntlMessages id="employee.role" />
                    </TableCell>
                    <TableCell align="right">
                      <IntlMessages id="employee.phone" />
                    </TableCell>
                    <TableCell align="right">
                      <IntlMessages id="employee.created-at" />
                    </TableCell>
                    <TableCell align="right">
                      <IntlMessages id="employee.updated-at" />
                    </TableCell>
                    <TableCell align="right">
                      <IntlMessages id="extension.notification" />
                    </TableCell>
                    <TableCell align="right">
                      <IntlMessages id="employee.delete" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataList && !loading &&
                    dataList
                      .map((data: IDataList, index: number) => {
                        return (
                          <TableRow
                            key={index}
                            onClick={() => onRowClick(data.id)}
                          >
                            <TableCell>
                              <b>
                                <Avatar
                                  alt="Adelle Charles"
                                  src={data.avatar}
                                />
                              </b>
                            </TableCell>
                            <TableCell>
                              <b>{data.first_name}</b>
                            </TableCell>
                            <TableCell align="right">
                              {data.last_name}
                            </TableCell>
                            <TableCell align="right">{data.email}</TableCell>
                            <TableCell align="right">{data.role}</TableCell>
                            <TableCell align="right">
                              <div
                                className="underlineElement"
                                onClick={(e) =>
                                  props.callPhone(e, data.id, data.phone)
                                }
                              >
                                {data.phone}
                              </div>
                            </TableCell>
                            <TableCell align="right">
                              {moment(data.created_at).format(
                                "MM-DD-YYYY HH:mm:ss"
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {moment(data.updated_at).format(
                                "MM-DD-YYYY HH:mm:ss"
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {data.notifications ? 
                                <svg onClick={(e) => notificationAction(e, data.user_id, false)} focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                  <path fill="green" d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"></path>
                                </svg> : 
                                <svg onClick={(e) => notificationAction(e, data.user_id, true)} focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                 <path fill="red" d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128 70.741 0 128 57.249 128 128 0 70.741-57.249 128-128 128-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128 0 70.74-57.249 128-128 128z"></path>
                               </svg>
                              }
                            </TableCell>
                            <TableCell align="right">
                              {authUser.id !== data.user_id && (
                                <UserHasPermission permission="support-access-partner-employees-delete">
                                  <Fab
                                    className="jr-fab-btn bg-secondary text-white"
                                    onClick={(e) => deleteEmployee(e, data.id)}
                                  >
                                    <i className="zmdi zmdi-delete zmdi-hc-lg" />
                                  </Fab>
                                </UserHasPermission>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  {!loading && !Boolean(dataList.length) && !error && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        align={"center"}
                        size={"medium"}
                        variant={"head"}
                      >
                        <IntlMessages id="paginationTable.noData" />
                      </TableCell>
                    </TableRow>
                  )}
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        align={"center"}
                        size={"medium"}
                        variant={"head"}
                      >
                        <Spinner color="primary" className={"spinner"} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        align={"center"}
                        size={"medium"}
                        variant={"head"}
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    {!!toggleCreateModal && (
                      <UserHasPermission permission="service-points-service-create-employee">
                        <Button
                          className="bg-secondary jr-btn text-white mt-3 ml-3 bg-info"
                          onClick={toggleCreateModal}
                        >
                          <i className="zmdi zmdi-plus zmdi-hc-lg" />
                        </Button>
                      </UserHasPermission>
                    )}
                    <TablePagination
                      count={total}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      labelRowsPerPage={<IntlMessages id="tablePaginationLabel"/>}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </CardBox>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default EmployeeTable;
