import React, { useEffect, useState } from "react";
import IntlMessages from "util/IntlMessages";
import { Button } from "@material-ui/core";
import {
  downloadInvoice,
  getInvoiceById,
  pauseInvoice,
  resumeInvoice,
} from "actions/Actions/ComapaniesActions";
import { useDispatch } from "react-redux";
import AlertPopUp from "common/AlertPopUp";
import { Link } from "react-router-dom";

const InvoiceDetails: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [popUpType, setPopUpType] = useState<string>("warning");
  const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
  const [isStopInvoice, setIsStopInvoice] = useState<boolean>(false);
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const [popUpMsg, setPopUpMsg] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    dispatch(
      getInvoiceById(
        props.match.params.id,
        props.match.params.invoiceId,
        (status, res) => {
          if (status) setInvoiceData(res);
        }
      )
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
          props.match.params.invoiceId,
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
          props.match.params.invoiceId,
          (status, res) => {
            setShowPopUpValue(true);
            setPopUpType(status);
          }
        )
      );
    } else if (popUpType === "success") {
      setPopUpType("");
      setShowPopUpValue(false);
      fetchData();
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
    <>
      Invoice detail page id: {props.match.params.invoiceId}
      <div>
        <Button
          className="jr-btn bg-warning text-white"
          onClick={() =>
            dispatch(
              downloadInvoice(
                props.match.params.id,
                props.match.params.invoiceId,
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
          <IntlMessages id="invoiceTable.downloadInvoice" />
        </Button>
        {invoiceData &&
        invoiceData.status?.name !== "paid" &&
        invoiceData.status?.name !== "scheduled" &&
        invoiceData.status?.name !== "draft" ? (
          <>
            {invoiceData.paused ? (
              <Button
                className="jr-btn bg-primary text-white"
                onClick={() => {
                  setPopUpType("warning");
                  setPopUpMsg("");
                  setIsDownload(false);
                  setShowPopUpValue(true);
                  setIsStopInvoice(false);
                }}
              >
                <IntlMessages id="invoiceTable.continueInvoice" />
              </Button>
            ) : (
              <Button
                className="jr-btn bg-primary text-white"
                onClick={() => {
                  setPopUpType("warning");
                  setPopUpMsg("");
                  setShowPopUpValue(true);
                  setIsDownload(false);
                  setIsStopInvoice(true);
                }}
              >
                <IntlMessages id="invoiceTable.pauseInvoice" />
              </Button>
            )}
          </>
        ) : null}
        <Button className="jr-btn bg-blue-grey text-white">
          <IntlMessages id="invoiceTable.resendInvoice" />
        </Button>
        <Link
          className="mr-1 text-dark"
          to={`/support/companies/${props.match.params.id}/invoices/`}
        >
          <Button className="jr-btn bg-dark text-white">
            <IntlMessages id="appModule.back" />
          </Button>
        </Link>
      </div>
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
    </>
  );
};

export default InvoiceDetails;
