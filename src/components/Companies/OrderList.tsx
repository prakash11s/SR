import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import IntlMessages from "../../util/IntlMessages";
import PaginationTable from "../../common/PaginationTable";
import { getOrderList } from "../../actions/Actions/OrderActions";
import { injectIntl } from "react-intl";
import { currencyConventor } from "util/helper";

/**
 * Component for OrderList
 * @returns {*}
 * @constructor
 */
const OrderList = (props: any) => {

    /**
     * handle State for OrderList
     */
    const [meta, setMeta] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [dataLoading, setLoading] = useState<boolean>(true);

    /**
     * Created dispatch for to dispatch actions
     */
    const dispatch = useDispatch();

    /**
     * get order list state from redux
     * */
    const orderList = useSelector((state: any) => state.orderState.order);
    /**
     * handle for order list
     */
    useEffect(() => {
        fetchData({ page: 0, limit: 10 });
    }, [dispatch]);

    /**
     * handle Call back
     * @param status
     * @param data
     */
    const callBackOrder = (status, data) => {
        setLoading(false);
        if (status == "success") {
            setMeta(data.meta);
        }
        else {
            setError(data);
        }
    };

    /**
     *
     * @param page
     * @param limit
     */
    const fetchData = ({ page, limit }) => {
        setLoading(true);
        dispatch(getOrderList(props.match.params.id, (page + 1), limit, callBackOrder));
    };

    /**
     * Order columns
     */
    const ordersColumns = [
        {
            name: 'paginationTable.name',
            key: 'name'
        },
        {
            name: 'paginationTable.orderId',
            key: 'id'
        },
        {
            name: 'paginationTable.status',
            key: 'status.name',
            align: 'right'
        },
        {
            name: 'paginationTable.phone',
            key: 'phone',
            align: 'right'
        },
        {
            name: 'paginationTable.totalPrice',
            key: 'meta.total_price',
            align: 'right'
        },
        {
            name: 'paginationTable.total_payment',
            key: 'total_payments',
            align: 'right'
        },
        {
            name: 'paginationTable.createdAt',
            key: 'created_at',
            format: 'paginationTable.datetime',
            align: 'right'
        },
        {
            name: 'paginationTable.updatedAt',
            key: 'updated_at',
            format: 'paginationTable.datetime',
            align: 'right'
        },
        {
            name: 'paginationTable.action',
            render: (data) => renderOrderAction(data),
            align: 'right'
        }
    ];

    /**
     * Order Action Element
     * @param data
     */
    const renderOrderAction = (data) => {
        return (
            <Link to={`/support/orders/${data.id}`}>
                <Button variant="contained" className="jr-btn bg-blue-grey text-white m-1">
                    <IntlMessages id="paginationTable.open-order" />
                </Button>
            </Link>
        );
    };
    const clone = [...orderList]
    let order = clone.map(p => {
        const totalPayments = p.payments.reduce((prev, next) => prev + next.price, 0);
        return {
            ...p,
            meta: {
                total_price: currencyConventor(p.meta.total_price === 0 ? 0 : p.meta.total_price / 100)
            },
            total_payments: currencyConventor(totalPayments == 0 ? 0 : totalPayments / 100)
        }
    })

    return (
        <React.Fragment>
            <PaginationTable
                meta={meta}
                error={error}
                dataList={order}
                columns={ordersColumns}
                loading={dataLoading}
                onChange={fetchData}
            />
        </React.Fragment>
    );
};

export default injectIntl(OrderList);
