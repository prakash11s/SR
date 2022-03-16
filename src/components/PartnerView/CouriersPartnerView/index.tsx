import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import {
  getPartnerViewData,
  getPartnerOrdersByStatus,
} from "../../../actions/Actions/PartnerViewActions";
import PaginationTable from "common/PaginationTable";
import { Button } from "@material-ui/core";

const CouriersPartnerView = (props: any): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [orderState, setOrderState] = useState("");
  const [orderData, setOrderData] = useState<any>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (orderState) {
      doApiCall();
    }
  }, [orderState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.match.path)
      setOrderState(
        props.match.path.split("/")[props.match.path.split("/").length - 1]
      );
  }, [props.match]);

  const doApiCall = (pageNumb = page, limitNumb = 25) => {
    if (
      orderState === "scheduled" ||
      orderState === "completed" ||
      orderState === "awaiting_completion" ||
      orderState === "cancelled"
    ) {
      dispatch(
        getPartnerOrdersByStatus(
          pageNumb,
          limitNumb,
          orderState,
          (status, res) => {
            if (status) {
              setOrderData(res.data);
              setMeta(res.meta);
              setError("");
            } else {
              setError(res);
            }
            setLoading(false);
          }
        )
      );
    } else {
      dispatch(
        getPartnerViewData((status, res) => {
          if (status) {
            setOrderData(res.data);
            setError("");
          } else {
            setError(res);
          }
          setLoading(false);
        })
      );
    }
  };

  const subscriptionColumns = [
    {
      name: "partnerUpcomingAssignment.id",
      key: "id",
    },
    {
      name: "partnerUpcomingAssignment.distance",
      key: "distance",
      render: (data) => renderDistance(data),
    },
    {
      name: "partnerUpcomingAssignment.address",
      key: "address",
      render: (data) => renderAddress(data),
    },
    {
      name: "partnerUpcomingAssignment.services",
      key: "services",
      render: (data) => renderServices(data),
    },
    {
      name: "orderDetailViewTable.totalPrice",
      key: "meta.total_price",
      format: "isPrice",
    },
    {
      name: "partnerUpcomingAssignment.orderDetails",
      key: "additional_data",
      render: (data) => renderDetails(data),
    },
    {
      name: "partnerUpcomingAssignment.createdAt",
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

  const renderOrderAction = (data) => {
    const orderDetailUrl =
      orderState === "processing"
        ? `/partner/orders/processing/${data.id}`
        : `/partner/orders/${data.id}`;
    return (
      <Button
        onClick={() => history.replace(orderDetailUrl)}
        variant="contained"
        className="jr-btn bg-warning text-white"
      >
        <IntlMessages id="partnerSettings.details" />
      </Button>
    );
  };

  const renderDistance = (data) => {
    return data.distance && data.distance / 1000;
  };

  const renderAddress = (data) => {
    return data.address && `${data.address.city}-${data.address.zip_code}`;
  };
  const renderServices = (data) => {
    const servicesList = data.services
      ? data.services.map((service: { name: any }) => (
          <div>{`- ${service.name}`}</div>
        ))
      : "";
    return servicesList;
  };

  const renderDetails = (data) => {
    return (
      data.additional_data &&
      data.additional_data.map((data) => {
        return (
          <>
            {data.key === "route_information" && (
              <h5>
                <b>
                  <IntlMessages id="fromLocation" />:{" "}
                </b>
                : {data.json_value["origin"]["full"]} <br />
                <b>
                  <IntlMessages id="toLocation" />:{" "}
                </b>
                : {data.json_value["destination"]["full"]} <br />
                <b>
                  <IntlMessages id="partnerOrders.distance" />
                </b>
                : {Number(data.json_value["distance"]) / 1000 + " KM"}
              </h5>
            )}
          </>
        );
      })
    );
  };

  const fetchData = (data) => {
    setPage(data.page + 1);
    doApiCall(data.page + 1, parseInt(data.limit));
  };

  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id={`partnerView.${orderState}`} />}
        textId={`partnerView.${orderState}`}
      />
      <div className="col-12 d-flex justify-content-between align-items-center">
        <h2 className="text-center mt-3 mb-3">
          <IntlMessages id={`partnerViewTableTitle.${orderState}`} />
        </h2>
        <div>
          <button
            type="button"
            className="btn btn-primary btn-sm mb-0"
            onClick={() => doApiCall()}
          >
            <IntlMessages id="partnerUpcomingAssignment.refreshData" />
          </button>
        </div>
      </div>

      <PaginationTable
        meta={meta}
        dataList={orderData}
        columns={subscriptionColumns}
        loading={isLoading}
        onChange={fetchData}
        error={error}
      />
    </div>
  );
};

export default CouriersPartnerView;
