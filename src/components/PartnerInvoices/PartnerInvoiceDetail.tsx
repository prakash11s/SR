import React, { useEffect, useState } from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import { formatPrice } from "util/helper";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Alert, Spinner } from "reactstrap";
import moment from "moment";
import {
  downloadInvoice,
  getPartnerInvoiceDetail,
  payInvoice,
} from "actions/Actions/PartnerInvoicesActions";
import { Button } from "@material-ui/core";
import { loadStripe } from "@stripe/stripe-js";
import AlertPopUp from "common/AlertPopUp";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
);
const renderLoading = <Spinner color="primary" className={"spinner"} />;

export const PartnerInvoiceDetail = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams() as any;
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [payLoadingId, setPayLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && !invoiceData) {
      dispatch(
        getPartnerInvoiceDetail(id, (status, res) => {
          if (status) {
            setInvoiceData(res.data);
          } else {
            setError(res);
          }
        })
      );
    }
  }, [id, invoiceData]);

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

  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="partner.invoiceDetails" />}
        textId="partner.invoiceDetails"
      />
      {!invoiceData && !error ? (
        renderLoading
      ) : error ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        <>
          {invoiceData && (
            <>
              <div className="jr-card">
                <div>
                  <b>
                    <IntlMessages id="paginationTable.name" />:{" "}
                  </b>
                  {invoiceData.reference}
                </div>
                <div>
                  <b>
                    <IntlMessages id="paginationTable.currency_code" />:{" "}
                  </b>
                  {invoiceData.currency_code}
                </div>
                <div>
                  <b>
                    <IntlMessages id="paginationTable.price" />:{" "}
                  </b>
                  {formatPrice(invoiceData.total_items_price)}
                </div>
                <div>
                  <b>
                    <IntlMessages id="paginationTable.status" />:{" "}
                  </b>
                  {invoiceData.status.name}
                </div>
                <div>
                  <b>
                    <IntlMessages id="paginationTable.dueAt" />:{" "}
                  </b>
                  {moment(invoiceData.due_at).format("MM-DD-YYYY HH:mm:ss")}
                </div>
                <div>
                  <b>
                    <IntlMessages id="paginationTable.createdAt" />:{" "}
                  </b>
                  {moment(invoiceData.created_at).format("MM-DD-YYYY HH:mm:ss")}
                </div>
                <div className="text-center mt-4 mb-2">
                  {invoiceData.payable && (
                    <Button
                      onClick={() => onClickPay(invoiceData.id)}
                      variant="contained"
                      className="jr-btn bg-blue-grey text-white"
                    >
                      {payLoadingId == invoiceData.id ? (
                        "loading..."
                      ) : (
                        <IntlMessages id="partnerSettings.payNow" />
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={() => download(invoiceData.id)}
                    variant="contained"
                    className="jr-btn bg-info text-white"
                  >
                    <IntlMessages id="partnerSettings.download" />
                  </Button>
                </div>
              </div>

              {(!invoiceData.items || invoiceData.items.length <= 0) && (
                <div className="jr-card">
                  <h3 className="mb-0">No items found</h3>
                </div>
              )}
              {invoiceData.items && invoiceData.items.length > 0 && (
                <h2>Items</h2>
              )}
              {invoiceData.items &&
                invoiceData.items.length > 0 &&
                invoiceData.items.map((item) => (
                  <div className="jr-card">
                    <div>
                      <b>
                        <IntlMessages id="services.description" />:{" "}
                      </b>
                      {item.description}
                    </div>
                    <div>
                      <b>
                        <IntlMessages id="paginationTable.quantity" />:{" "}
                      </b>
                      {item.quantity}
                    </div>
                    <div>
                      <b>
                        <IntlMessages id="paginationTable.price" />:{" "}
                      </b>
                      {formatPrice(item.price)}
                    </div>
                    <div>
                      <b>
                        <IntlMessages id="paginationTable.tax" />:{" "}
                      </b>
                      {item.tax}
                    </div>
                    <div>
                      <b>
                        <IntlMessages id="paginationTable.priceWithTax" />:{" "}
                      </b>
                      {formatPrice(item.calculated_price_inc_tax)}
                    </div>
                    <div>
                      <b>
                        <IntlMessages id="paginationTable.createdAt" />:{" "}
                      </b>
                      {moment(item.created_at).format("MM-DD-YYYY HH:mm:ss")}
                    </div>
                  </div>
                ))}
            </>
          )}

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
        </>
      )}
    </div>
  );
};

export default PartnerInvoiceDetail;
