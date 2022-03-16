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
  getOpenQuotes,
  downloadOpenQuotes,
} from "../../actions/Actions/ReportActions";

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
      department: "asc",
      phone: "asc",
      email: "asc",
      city: "asc",
      salutation: "asc",
    },
  });

  useEffect(() => {
    dispatch(getOpenQuotes(page, rowsPerPage));
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
    dispatch(getOpenQuotes(page, rowsPerPage));
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
    props.history.push("/support/reports/open-quotes?download=true");
    dispatch(
      downloadOpenQuotes((status: boolean, data: any) => {
        setDownloadStatus(status ? 1 : 0);
        setMessage(data.message);
      })
    );
  };

  return (
    <div>
      <ContainerHeader
        title={<IntlMessages id="breadCrumbBar.reports.openQuotes" />}
        match={props.match}
      />
      <UserHasPermission permission="analytics-service-booking-service-open-quotes-query">
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
              <TableCell onClick={() => onSortChange("department")}>
                <IntlMessages id={"reportTable.Department"} />
                {/* {sort.sort.department === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("phone")}>
                <IntlMessages id={"reportTable.Phone"} />
                {/* {sort.sort.phone === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("email")}>
                <IntlMessages id={"reportTable.Email"} />
                {/* {sort.sort.email === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("city")}>
                <IntlMessages id={"reportTable.City"} />
                {/* {sort.sort.city === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
              <TableCell onClick={() => onSortChange("city")}>
                <IntlMessages id={"reportTable.Salutation"} />
                {/* {sort.sort.city === 'asc' ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>} */}
              </TableCell>
            </TableHead>
            <TableBody>
              {!reportState.error && reportState.loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <Spinner color="primary" />
                  </TableCell>
                </TableRow>
              )}
              {reportState.error && !reportState.loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <h2>{reportState.error}</h2>
                  </TableCell>
                </TableRow>
              )}
              {!Boolean(reportList.length) &&
                !reportState.error &&
                !reportState.loading && (
                  <TableRow>
                    <TableCell colSpan={6}>
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
                      <TableCell>{report.department}</TableCell>
                      <TableCell>{report.phone}</TableCell>
                      <TableCell>{report.email}</TableCell>
                      <TableCell>{report.city}</TableCell>
                      <TableCell>{report.salutation}</TableCell>
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
