import React, { useEffect, useState } from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";
import {
  getPartnerInvoices,
  downloadInvoice,
  payInvoice,
} from "actions/Actions/PartnerInvoicesActions";
import PaginationTable from "common/PaginationTable";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import AlertPopUp from "common/AlertPopUp";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
);

export const PartnerInvoices = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [invoiceList, setInvoices] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [payLoadingId, setPayLoading] = useState<any>(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(
      getPartnerInvoices((status, res) => {
        if (status) {
          setInvoices(res.data);
          setMeta(res.meta);
          setError("");
        } else {
          setError(res);
        }
        setLoading(false);
      })
    );
  }, []);

  const subscriptionColumns = [
    {
      name: "paginationTable.name",
      key: "reference",
    },
    {
      name: "paginationTable.currency_code",
      key: "currency_code",
    },
    {
      name: "paginationTable.price",
      key: "total_items_price",
      format: "isPrice",
    },
    {
      name: "paginationTable.status",
      key: "status.name",
    },
    {
      name: "paginationTable.createdAt",
      key: "created_at",
      format: "paginationTable.datetime",
      align: "right",
    },
    {
      name: "paginationTable.action",
      key: "action",
      align: "right",
      render: (data) => renderOrderAction(data),
    },
  ];

  const onClickPay = (id) => {
    setPayLoading(id);
    dispatch(
      payInvoice(
        id,
        {
          cancel_url: `${window.location.origin}/partner/invoices/${id}/cancel`,
          success_url: `${window.location.origin}/partner/invoices/${id}/success`,
        },
        (status, res) => {
          if (status) {
            const handleClick = async (id) => {
              // Get Stripe.js instance
              const stripe = await stripePromise;

              // When the customer clicks on the button, redirect them to Checkout.
              const result = await stripe?.redirectToCheckout({
                sessionId: id,
              });

              if (result && result.error && result.error.message) {
                setAlertType("payment");
                setAlertMsg(result.error.message as string);
                setAlertVisible(true);
              }
            };
            handleClick(res.id);
          } else {
            setAlertType("payment");
            setAlertMsg(res);
            setAlertVisible(true);
          }
        }
      )
    );
  };

  const download = (id) => {
    dispatch(
      downloadInvoice(id, (status, res) => {
        if (status && res.data.url) {
          window.open(res.data.url, "_blank");
        } else {
          setAlertType("download");
          setAlertMsg(res);
          setAlertVisible(true);
        }
      })
    );
  };

  const renderOrderAction = (data) => {
    return (
      <>
        {data.payable && (
          <Button
            onClick={() => onClickPay(data.id)}
            variant="contained"
            className="jr-btn bg-blue-grey text-white"
          >
            {payLoadingId == data.id ? (
              "loading..."
            ) : (
              <IntlMessages id="partnerSettings.payNow" />
            )}
          </Button>
        )}
        <Button
          onClick={() => download(data.id)}
          variant="contained"
          className="jr-btn bg-info text-white"
        >
          <IntlMessages id="partnerSettings.download" />
        </Button>
        <Button
          onClick={() => history.push(`/partner/invoices/${data.id}`)}
          variant="contained"
          className="jr-btn bg-warning text-white"
        >
          <IntlMessages id="partnerSettings.details" />
        </Button>
      </>
    );
  };

  const fetchData = (data) => {
    console.log(data);
  };

  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="supportTab.invoices" />}
      />
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => onClickPay("pay-all")}
          variant="contained"
          className="jr-btn bg-primary text-white"
        >
          {payLoadingId == "pay-all" ? (
            "loading..."
          ) : (
            <IntlMessages id="partnerSettings.payAll" />
          )}
        </Button>
      </div>
      <PaginationTable
        meta={meta}
        dataList={invoiceList}
        columns={subscriptionColumns}
        loading={loading}
        onChange={fetchData}
        error={error}
      />
      <AlertPopUp
        title={
          alertType === "download" ? (
            <IntlMessages id="sweetAlerts.downloadFail" />
          ) : (
            <IntlMessages id="sweetAlerts.paymentFail" />
          )
        }
        show={alertVisible}
        message={alertMsg}
        danger
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={() => setAlertVisible(false)}
      />
    </div>
  );
};

export default PartnerInvoices;
