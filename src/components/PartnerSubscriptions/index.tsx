import React, { useEffect, useState } from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import { useDispatch } from "react-redux";
import { getPartnerSubscriptions } from "actions/Actions/PartnerSubscriptionActions";
import PaginationTable from "common/PaginationTable";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";

export const PartnerSubscriptions = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(
      getPartnerSubscriptions((status, res) => {
        if (status) {
          setSubscriptionList(res.data);
          setMeta(res.meta);
          setError("");
        } else {
          setError(res);
        }
        setLoading(false);
      })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const subscriptionColumns = [
    {
      name: "paginationTable.id",
      key: "id",
    },
    {
      name: "paginationTable.planName",
      key: "plan.name",
    },
    {
      name: "paginationTable.periodStart",
      key: "active_from",
      format: "paginationTable.datetime",
    },
    {
      name: "paginationTable.periodEnd",
      key: "active_until",
      format: "paginationTable.datetime",
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

  const renderOrderAction = (data) => {
    return (
      <Button
        onClick={() => history.push(`/partner/subscriptions/${data.id}`)}
        variant="contained"
        className="jr-btn bg-warning text-white"
      >
        <IntlMessages id="partnerSettings.details" />
      </Button>
    );
  };

  const fetchData = (data) => {
    console.log(data);
  };

  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="partner.subscriptions" />}
      />
      <PaginationTable
        meta={meta}
        dataList={subscriptionList}
        columns={subscriptionColumns}
        loading={loading}
        onChange={fetchData}
        error={error}
      />
    </div>
  );
};

export default PartnerSubscriptions;
