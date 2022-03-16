import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedBacks } from "../../actions/Actions/FeedbackActions";
import PaginationTable from "../../common/PaginationTable";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
import IntlMessages from "../../util/IntlMessages";
import { useHistory } from "react-router";
import { useIntl } from "react-intl";
import axios from "../../util/Api"
import Loader from 'containers/Loader/Loader';

/**
 * Component for FeedBackList
 * @returns {*}
 * @constructor
 */
const FeedBackList = ({id}) => {

    interface IState {
        emailList: any,
        orderId: any,
        metaData: any,
        limit: number,
        isLoading: boolean,
        page: number,
        total: string,
        tableLoading: boolean,
        search: string,
        error: string,
        addData: boolean,
        x: number, y: number,
        menuState: boolean,
        rowClick: boolean,
    }

    const [state, setState] = useState<IState>({
        emailList: [],
        orderId: "",
        metaData: { has_more_pages: false },
        limit: 10,
        isLoading: false,
        page: 1,
        total: "",
        tableLoading: false,
        search: "",
        error: "",
        addData: false,
        x: 0, y: 0,
        menuState: false,
        rowClick: true
    });

    const renderAction = (data) => {
      
        return (
            <Link to={`/support/reviews/${data?.id}`}>
                <Button variant="contained" className="jr-btn bg-blue-grey text-white m-1">
                    <IntlMessages id="paginationTable.openButton"/>
                </Button>
            </Link>
        );
    };

    const [callRecordColumns, setcallRecordColumns] = useState([
        {
            name: 'paginationTable.id',
            key: 'id'
        },
        {
            name: 'paginationTable.name',
            key: 'name'
        },
        {
            name: 'paginationTable.content',
            render: (data) => <Tooltip title={data?.content}>
                {data?.content?.length > 50 ? <p>{data?.content.slice(0, 50)} ....</p> : <p>{data?.content}</p>}
            </Tooltip>
        },
        {
            name: 'paginationTable.rating',
            render: (data) => data?.rating / 10,
        },
        {
            name: 'paginationTable.createdAt',
            key: 'created_at',
            format: 'paginationTable.datetime',
            align: 'right'
        },
        {
            name: 'paginationTable.action',
            render: (data) => renderAction(data),
            align: 'right'
        }

    ]);


    const fetchData = ({ page, limit }) => {

        setState(prevState => ({
            ...prevState,
            page: page + 1,
            limit: limit
        }))
    }

    const onInitAPICall = async (id) => {

        try {
            const params = { page: state.page, limit: state.limit };
            const response = await axios.get(`customers/${id}/feedbacks`, { params });

            setState(prevState => ({
                ...prevState,
                emailList: prevState.addData ? [...prevState.emailList, ...response.data.data] : response.data.data,
                metaData: response.data.meta,
                tableLoading: false
            }));

        } catch (error) {
            setState(prevState => ({
                ...prevState,
                error: error.message,
                tableLoading: false
            }));
        }

    }
    
    useEffect(() => {
        const orderId = id;
        onInitAPICall(orderId);
        setState(prevState => ({
            ...prevState,
            orderId: orderId
        }));
    }, [state.page, state.limit]);


    if (state.isLoading) {
        return <Loader />
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mt-2">
                    <IntlMessages id="feedbackList" />
                </h3>
            </div>
            <PaginationTable
                meta={state.metaData}
                dataList={state.emailList}
                columns={callRecordColumns}
                loading={state.isLoading}
                onChange={fetchData}
                error={state.error}
            />
        </>
    )
};

export default FeedBackList;
