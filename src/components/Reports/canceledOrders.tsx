import React, { useEffect, useState } from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import UserHasPermission from "util/Permission";
import { Col, Spinner } from "reactstrap";
import {
  Button,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TablePagination,
  TableFooter,
} from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector, useDispatch } from "react-redux";
import {
  getCanceledOrders,
  downloadCanceledOrders,
} from "../../actions/Actions/ReportActions";
import moment from "moment";

const OpenQuotes: React.FC<any> = (props) => {
  const dispatch = useDispatch();
  const reportState = useSelector((state: any) => state.reportState);

  const [reportList, setReportList] = useState<any>([]);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [downloadStatus, setDownloadStatus] = useState(2);
  const [message, setMessage] = useState("");

  const [sort, setSort] = useState<any>({
    sort: {
      id: "asc",
      name: "asc",
      city: "asc",
      department: "asc",
      services: "asc",
      service_point_name: "asc",
      service_description: "asc",
      total_price: "asc",
      request_date_passed: "asc",
      cancelled_at: "asc",
    },
  });

  useEffect(() => {
    dispatch(getCanceledOrders(page, rowsPerPage));
  }, []);

  useEffect(() => {
    if (reportState.reportList.length) {
      setReportList(reportState.reportList);
      if (reportState.meta) {
        setCount(reportState.meta.total);
      }
    }
  }, [reportState]);

  useEffect(() => {
    dispatch(getCanceledOrders(page, rowsPerPage));
  }, [page]);

  const handleChangePage = (event: any, page: any) => {
    setPage(page + 1);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
  };

  const onSortChange = (field: string) => {
    const oldSort = { ...sort };
    const newSort = { sort: {} };
    newSort.sort[field] = oldSort.sort[field] === "asc" ? "desc" : "asc";
    delete oldSort.sort[field];
    Object.keys(oldSort.sort).forEach((key) => {
      newSort.sort[key] = oldSort.sort[key];
    });
    setSort(newSort);
  };

  const handleDownload = () => {
    props.history.push("/support/reports/canceled-orders?download=true");
    dispatch(
      downloadCanceledOrders((status: boolean, data: any) => {
        setDownloadStatus(status ? 1 : 0);
        setMessage(data.message);
      })
    );
  };

  return (
    <div>
      <ContainerHeader
        title={<IntlMessages id="breadCrumbBar.reports.canceledOrders" />}
        match={props.match}
      />
      <UserHasPermission permission="analytics-service-booking-service-canceled-orders-query">
        <div className="d-flex w-100">
          <Button
            className="bg-primary text-white mb-2 ml-auto"
            onClick={() => handleDownload()}
          >
            <IntlMessages id={"appModule.download"} />
          </Button>
        </div>
        <div className="jr-card p-0">
          <Table className="default-table table table-hover">
            <TableHead className="th-border-b">
              <TableCell onClick={() => onSortChange("id")}>
                <IntlMessages id={"reportTable.Id"} />
                {/* {sort.sort.id === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("name")}>
                <IntlMessages id={"reportTable.Name"} />
                {/* {sort.sort.name === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("city")}>
                <IntlMessages id={"reportTable.City"} />
                {/* {sort.sort.city === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("department")}>
                <IntlMessages id={"reportTable.Department"} />
                {/* {sort.sort.department === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("services")}>
                <IntlMessages id={"reportTable.Services"} />
                {/* {sort.sort.services === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("service_point_name")}>
                <IntlMessages id={"reportTable.ServicePointName"} />
                {/* {sort.sort.service_point_name === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("service_description")}>
                <IntlMessages id={"reportTable.ServiceDescription"} />
                {/* {sort.sort.service_description === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("total_price")}>
                <IntlMessages id={"reportTable.TotalPrice"} />
                {/* {sort.sort.total_price === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("request_date_passed")}>
                <IntlMessages id={"reportTable.RequestDatePassed"} />
                {/* {sort.sort.request_date_passed === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("cancelled_at")}>
                <IntlMessages id={"reportTable.CancelledAt"} />
                {/* {sort.sort.cancelled_at === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
            </TableHead>
            <TableBody>
              {!reportState.error && reportState.loading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    <Spinner color="primary" />
                  </TableCell>
                </TableRow>
              )}
              {reportState.error && !reportState.loading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    <h2>{reportState.error}</h2>
                  </TableCell>
                </TableRow>
              )}
              {!Boolean(reportList.length) &&
                !reportState.error &&
                !reportState.loading && (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <Col sm={{ size: 12 }}>
                        <h2 style={{ textAlign: "center" }}>
                          <IntlMessages id="error404" />
                        </h2>
                      </Col>
                    </TableCell>
                  </TableRow>
                )}
              {Boolean(reportList.length) &&
                !reportState.error &&
                !reportState.loading &&
                reportList.map((report: any) => {
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={report.id}
                      className="cursor-pointer"
                      onClick={() =>
                        props.history.push(`/support/orders/${report.id}`)
                      }
                    >
                      <TableCell>{report.id}</TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.city}</TableCell>
                      <TableCell>{report.department}</TableCell>
                      <TableCell>{report.services}</TableCell>
                      <TableCell>{report.service_point_name}</TableCell>
                      <TableCell>{report.service_description}</TableCell>
                      <TableCell>{report.total_price}</TableCell>
                      <TableCell>{report.request_date_passed}</TableCell>
                      <TableCell>
                        {moment(report.cancelled_at).format("YYYY-MM-DD")}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={count}
                  rowsPerPage={rowsPerPage}
                  page={page - 1}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  labelRowsPerPage={<IntlMessages id="tablePaginationLabel"/>}
                />
              </TableRow>
            </TableFooter>
          </Table>
          <SweetAlert
            show={downloadStatus != 2}
            success={downloadStatus == 1}
            warning={downloadStatus == 0}
            title={
              downloadStatus == 1
                ? "Success"
                : downloadStatus == 0
                ? "Failed"
                : ""
            }
            confirmBtnText="Ok"
            onConfirm={() => setDownloadStatus(2)}
          >
            {message}
          </SweetAlert>
        </div>
      </UserHasPermission>
    </div>
  );
};

export default OpenQuotes;
