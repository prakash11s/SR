import React, { useEffect, useState } from "react";
import {
  downloadInvoice,
  getInvoices,
  pauseInvoice,
  resumeInvoice,
} from "actions/Actions/ComapaniesActions";
import { useDispatch, useSelector } from "react-redux";
import "./Styles/SubscriptionList.scss";
import PaginationTable from "../../common/PaginationTable";
import { Link } from "react-router-dom";
import IntlMessages from "util/IntlMessages";
import { currencyConventor } from "util/helper";
import { UncontrolledTooltip } from "reactstrap";
import AlertPopUp from "common/AlertPopUp";

const InvoicesList: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const [popUpType, setPopUpType] = useState<string>("warning");
  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [isStopInvoice, setIsStopInvoice] = useState<boolean>(false);
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const [popUpMsg, setPopUpMsg] = useState<string>("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<any>(null);
  const [filters, setFitlers] = useState<any>([]);

  /**
   * get invoice list state from redux
   * */
  const invoices = useSelector((state: any) => state.companyState.invoices);
  const invoicesList = invoices.invoiceList;
  const loading = invoices.loading;

  const error = invoices.error;
  const meta = invoices.meta;

  const fetchData = ({
    page,
    limit,
    data = filters,
  }: {
    page: number;
    limit: number;
    data?: any;
  }) => {
    if (data && data.length) {
      dispatch(
        getInvoices(
          props.match.params.id,
          page + 1,
          limit,
          btoa(
            unescape(
              encodeURIComponent(
                JSON.stringify({
                  status: data,
                })
              )
            )
          )
        )
      );
    } else {
      dispatch(getInvoices(props.match.params.id, page + 1, limit));
    }
  };
  /**
   * Order columns
   */
  const invoiceColumns = [
    {
      name: "paginationTable.id",
      key: "reference_id",
    },
    {
      name: "paginationTable.price",
      key: "currency_code",
      render: ({ currency_code, total_items_price }) =>
        currency_code === "EUR"
          ? "€" + (parseInt(total_items_price) / 100).toFixed(2)
          : currency_code + (parseInt(total_items_price) / 100).toFixed(2),
    },
    {
      name: "paginationTable.status",
      key: "status.name",
      render: (data) => renderStatus(data),
    },
    {
      name: "paginationTable.sentAt",
      key: "invoiced_at",
      format: "paginationTable.datetime",
    },
    {
      name: "paginationTable.dueAt",
      key: "due_at",
      format: "paginationTable.datetime",
    },
    {
      name: "paginationTable.paidAt",
      key: "paid_at",
      format: "paginationTable.datetime",
    },
    {
      name: "paginationTable.action",
      render: (data) => renderAction(data),
    },
  ];

  const renderStatus = ({ status }) => {
    let classname = "warning";
    switch (status.name) {
      case "late":
      case "uncollectible":
      case "reminded":
        classname = "danger";
        break;
      case "paid":
        classname = "success";
        break;
      case "draft":
        classname = "primary";
        break;
    }
    return (
      <div className={`alertbox alert-${classname} p-2`}>
        <label style={{ textTransform: "capitalize" }}>{status.name}</label>
      </div>
    );
  };

  const renderAction = (data) => {
    return (
      <div className="d-flex">
        <div className="mr-1 text-dark">
          <svg
            aria-hidden="true"
            focusable="false"
            id={`download-${data.id}`}
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            onClick={() =>
              dispatch(
                downloadInvoice(
                  props.match.params.id,
                  data.id,
                  (status, res) => {
                    if (status) {
                      window.open(res.data.url, "_blank");
                    } else {
                      setIsDownload(true);
                      setShowPopUpValue(true);
                      setPopUpType("danger");
                    }
                  }
                )
              )
            }
          >
            <path
              fill="currentColor"
              d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm76.45 211.36l-96.42 95.7c-6.65 6.61-17.39 6.61-24.04 0l-96.42-95.7C73.42 337.29 80.54 320 94.82 320H160v-80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v80h65.18c14.28 0 21.4 17.29 11.27 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"
            ></path>
          </svg>
          <UncontrolledTooltip placement="top" target={`download-${data.id}`}>
            <IntlMessages id="invoiceTable.downloadInvoice" />
          </UncontrolledTooltip>
        </div>
        {data.status &&
        data.status.name !== "paid" &&
        data.status.name !== "scheduled" &&
        data.status.name !== "draft" ? (
          <div className="mr-1 text-dark">
            {data.paused ? (
              <>
                <svg
                  aria-hidden="true"
                  id={`pause-${data.id}`}
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  onClick={() => {
                    setPopUpType("warning");
                    setPopUpMsg("");
                    setIsDownload(false);
                    setShowPopUpValue(true);
                    setIsStopInvoice(false);
                    setSelectedInvoiceId(data.id);
                  }}
                >
                  <path
                    fill="currentColor"
                    d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z"
                  ></path>
                </svg>
                <UncontrolledTooltip
                  placement="top"
                  target={`pause-${data.id}`}
                >
                  <IntlMessages id="invoiceTable.continueInvoice" />
                </UncontrolledTooltip>
              </>
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  id={`play-${data.id}`}
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  onClick={() => {
                    setPopUpType("warning");
                    setPopUpMsg("");
                    setShowPopUpValue(true);
                    setIsDownload(false);
                    setIsStopInvoice(true);
                    setSelectedInvoiceId(data.id);
                  }}
                >
                  <path
                    fill="currentColor"
                    d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-16 328c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160zm112 0c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160z"
                  ></path>
                </svg>

                <UncontrolledTooltip placement="top" target={`play-${data.id}`}>
                  <IntlMessages id="invoiceTable.pauseInvoice" />
                </UncontrolledTooltip>
              </>
            )}
          </div>
        ) : null}
        <div className="mr-1 text-dark">
          <svg
            aria-hidden="true"
            focusable="false"
            id={`resendinvoice-${data.id}`}
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"
            ></path>
          </svg>
          <UncontrolledTooltip
            placement="top"
            target={`resendinvoice-${data.id}`}
          >
            <IntlMessages id="invoiceTable.resendInvoice" />
          </UncontrolledTooltip>
        </div>
        <Link
          className="mr-1 text-dark"
          to={`/support/companies/${props.match.params.id}/invoices/${data.id}`}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            id={`open-${data.id}`}
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path
              fill="currentColor"
              d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
            ></path>
          </svg>
          <UncontrolledTooltip placement="top" target={`open-${data.id}`}>
            <IntlMessages id="invoiceTable.openInvoice" />
          </UncontrolledTooltip>
        </Link>
      </div>
    );
  };

  const filterByLabel = (type) => {
    const arr = [...filters];
    if (filters.includes(type)) {
      setFitlers([...filters.filter((data) => data !== type)]);
    } else {
      arr.push(type);
      setFitlers(arr);
    }
  };

  useEffect(() => {
    fetchData({ page: 0, limit: 10, data: filters });
  }, [filters.length]);

  const getLabel = (type) => {
    let classname = "success";
    switch (type) {
      case "open":
        if (meta[type].total > 0) {
          classname = "warning";
        }
        break;
      case "paused":
      case "unpaid":
      case "reminded":
      case "late":
        if (meta[type].total > 0) {
          classname = "danger";
        }
        break;
      default:
        classname = "success";
    }
    return (
      <div
        className="alertbox-main ml-2 cursor-pointer"
        onClick={() => filterByLabel(type)}
      >
        <div
          className={`alertbox alert-${classname} text-center ${
            filters.includes(type) ? "border border-primary" : ""
          }`}
        >
          <label className="cursor-pointer">
            <div>
              <IntlMessages id={`invoiceTable.${type}`} /> ({meta[type].total})
            </div>
            {currencyConventor(meta[type].price / 100)}
          </label>
        </div>
      </div>
    );
  };

  const handleOnCancelButton = () => {
    setPopUpType("warning");
    setShowPopUpValue(false);
    setIsDownload(false);
    setPopUpMsg("");
  };

  const handleOnConfirmButton = () => {
    if (popUpType === "warning" && isStopInvoice) {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        pauseInvoice(
          props.match.params.id,
          selectedInvoiceId,
          (status, res) => {
            setShowPopUpValue(true);
            setPopUpType(status);
          }
        )
      );
    } else if (popUpType === "warning" && !isStopInvoice) {
      setPopUpType("loading");
      setShowPopUpValue(true);
      dispatch(
        resumeInvoice(
          props.match.params.id,
          selectedInvoiceId,
          (status, res) => {
            setShowPopUpValue(true);
            setPopUpType(status);
          }
        )
      );
    } else if (popUpType === "success") {
      setPopUpType("");
      setShowPopUpValue(false);
      fetchData({ page: 0, limit: 10 });
    } else {
      setShowPopUpValue(false);
    }
  };

  const handleTitle = (type: string) => {
    if (popUpType === "warning") {
      return <IntlMessages id={`sweetAlerts.${type}`} />;
    } else if (popUpType === "success") {
      return <IntlMessages id={`sweetAlerts.${type}Success`} />;
    } else if (popUpType === "danger") {
      return <IntlMessages id={`sweetAlerts.${type}Fail`} />;
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex justify-content-end">
        {meta && getLabel("paid")}
        {meta && getLabel("open")}
        {meta && getLabel("paused")}
        {meta && getLabel("unpaid")}
        {meta && getLabel("late")}
        {meta && getLabel("reminded")}
      </div>
      <PaginationTable
        meta={meta}
        dataList={invoicesList}
        columns={invoiceColumns}
        loading={loading}
        onChange={fetchData}
        error={error}
      />
      <AlertPopUp
        show={showPopUpValue}
        message={popUpMsg && popUpMsg}
        title={handleTitle(
          isDownload
            ? "downloadInvoice"
            : isStopInvoice
            ? "pauseInvoice"
            : "resumeInvoice"
        )}
        success={popUpType === "success"}
        warning={popUpType === "warning"}
        danger={popUpType === "danger"}
        disabled={popUpType === "loading"}
        showCancel={popUpType === "warning"}
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={handleOnConfirmButton}
        onCancel={handleOnCancelButton}
      />
    </React.Fragment>
  );
};

export default InvoicesList;
