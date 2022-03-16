import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PaginationTable from "../../common/PaginationTable";
import { getBackAccountsList } from "actions/Actions/ComapaniesActions";

/**
 * Component for BankAccountList
 * @returns {*}
 * @constructor
 */
const BankAccountList = (props: any) => {
  /**
   * Created dispatch for to dispatch actions
   */
  const dispatch = useDispatch();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    fetchData({ page: 0, limit: 25 });
  }, [dispatch]);

  const fetchData = ({ page, limit }) => {
    setLoading(true);
    dispatch(
      getBackAccountsList(
        page + 1,
        limit,
        props.match.params.id,
        (status, res) => {
          setLoading(false);
          if (status) {
            setBankAccounts(res.data);
            setMeta(res.meta);
          } else {
            setError(res);
          }
        }
      )
    );
  };

  const bankColumns = [
    {
      name: "paginationTable.name",
      key: "name",
      width: "20%",
    },
    {
      name: "partnerSettings.iban",
      key: "iban_formatted",
      width: "30%",
    },
    {
      name: "partnerSettings.bic",
      key: "bic",
      width: "20%",
    },
    {
      name: "paginationTable.active",
      key: "activated",
      render: (data) => renderBooleanLabel(data, "activated"),
    },
    {
      name: "paginationTable.default",
      key: "is_default",
      render: (data) => renderBooleanLabel(data, "is_default"),
    },
  ];

  const renderBooleanLabel = (data, key) => {
    if (data[key]) {
      return <span className="text-success">True</span>;
    } else {
      return <span className="text-danger">False</span>;
    }
  };

  return (
    <React.Fragment>
      <PaginationTable
        meta={meta}
        dataList={bankAccounts}
        columns={bankColumns}
        loading={loading}
        error={error}
        onChange={fetchData}
      />
    </React.Fragment>
  );
};

export default BankAccountList;
