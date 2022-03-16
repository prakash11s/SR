import React, { useEffect, useState } from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import { useDispatch } from "react-redux";
import { getPartnerSubscriptionDetails } from "actions/Actions/PartnerSubscriptionActions";
import { useParams } from "react-router-dom";
import { Alert, Spinner } from "reactstrap";
import moment from "moment";

const renderLoading = <Spinner color="primary" className={"spinner"} />;
export const PartnerSubscriptions = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams() as any;
  const [staticsData, setStaticsData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id && !staticsData) {
      dispatch(
        getPartnerSubscriptionDetails(id, (status, res) => {
          if (status) {
            setStaticsData(res.data);
          } else {
            setError(res);
          }
        })
      );
    }
  }, [dispatch, id, staticsData]);

  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="partner.subscriptionsDetails" />}
        textId="partner.subscriptionsDetails"
      />
      {!staticsData && !error ? (
        renderLoading
      ) : error ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        <>
          {staticsData.plan && (
            <>
              <div className="jr-card">
                <div>
                  <b>
                    <IntlMessages id="orderDetailViewTable.subscriptionId" />:{" "}
                  </b>
                  {staticsData.plan.id}
                </div>
                <div>
                  <b>
                    <IntlMessages id="orderDetailViewTable.attachmentsName" />:{" "}
                  </b>
                  {staticsData.plan.name}
                </div>
              </div>

              <div className="jr-card">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <b>
                      <IntlMessages id="subscription.PeriodStart" />:{" "}
                    </b>
                    {moment(staticsData.active_from).format(
                      "MM-DD-YYYY HH:mm:ss"
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <b>
                      <IntlMessages id="subscription.PeriodEnd" />:{" "}
                    </b>
                    {moment(staticsData.active_until).format(
                      "MM-DD-YYYY HH:mm:ss"
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="jr-card">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "20px",
              }}
            >
              <div style={{ flex: 1 }}>
                <b>
                  <IntlMessages id="subscription.averagePrice" />:{" "}
                </b>
                {staticsData.statistics &&
                  (staticsData.statistics.average_price / 100).toFixed(2)}
              </div>
              <div style={{ flex: 1 }}>
                <b>
                  <IntlMessages id="paginationTable.totalPrice" />:{" "}
                </b>
                {staticsData.statistics &&
                  (staticsData.statistics.total_price / 100).toFixed(2)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <b>
                  <IntlMessages id="subscription.Amount" />:{" "}
                </b>
                {staticsData.statistics && staticsData.statistics.amount}
              </div>
              <div style={{ flex: 1 }}>
                <b>
                  <IntlMessages id="subscription.totalOrders" />:{" "}
                </b>
                {staticsData.statistics && staticsData.statistics.total_orders}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PartnerSubscriptions;
