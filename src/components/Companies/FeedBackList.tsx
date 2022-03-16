import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getFeedBacks} from "../../actions/Actions/FeedbackActions";
import PaginationTable from "../../common/PaginationTable";
import {Link} from "react-router-dom";
import {Button, Tooltip} from "@material-ui/core";
import IntlMessages from "../../util/IntlMessages";

/**
 * Component for FeedBackList
 * @returns {*}
 * @constructor
 */
const FeedBackList = (props: any) => {

    /**
     * Created dispatch for to dispatch actions
     */
    const dispatch = useDispatch();

    /**
     * get feedback list state from redux store
     * */
    const feedback = useSelector((state:any) => state.feedbackState.feedbackList);
    const loading = useSelector((state:any) => state.feedbackState.loading);
    const meta = useSelector((state:any) => state.feedbackState.meta);
    const error = useSelector((state:any)=>state.feedbackState.error);
    /**
     * handle for feedback list
     */
    useEffect(() => {
        fetchData({page: 0, limit: 10});
    }, [dispatch]);


    const fetchData = ({page, limit}) => {
        dispatch(getFeedBacks(props.match.params.id, (page + 1), limit));
    };

    const feedbackColumns = [
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
            render: (data) => <Tooltip title={data.content}>
                {data.content.length > 50 ? <p>{data.content.slice(0, 50)} ....</p> : <p>{data.content}</p>}
            </Tooltip>
        },
        {
            name: 'paginationTable.rating',
            render: (data) => data.rating / 10,
        },
        {
            name: 'paginationTable.accepted',
            key: 'accepted',
            format: 'paginationTable.datetime'
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
    ];

    const renderAction = (data) => {
        return (
            <Link to={`/support/reviews/${data.id}`}>
                <Button variant="contained" className="jr-btn bg-blue-grey text-white m-1">
                    <IntlMessages id="paginationTable.openButton"/>
                </Button>
            </Link>
        );
    };

    const getAlertClass = ()=>{
        if(meta && meta.avarage){
            if((meta.avarage / 10) > 5){
                return "alertbox alert-success"
            }else if((meta.avarage / 10) > 4) {
                return "alertbox alert-info"
            }else if((meta.avarage / 10) > 3){
                return "alertbox alert-warning"
            }else {
                return "alertbox alert-danger"
            }
        }else{
            return "alertbox alert-danger"
        }
    };

    return(
        <React.Fragment>
            {
                meta && meta.total > 0 && (
                    <div className="alertbox-main">
                        <div className={getAlertClass()}>
                            <label>
                                <IntlMessages id="feedbackTable.Total" />: {meta.total}
                                { meta.avarage && " - " }
                                { meta.avarage && <IntlMessages id="feedbackTable.Average" /> }
                                { meta.avarage && `: ${meta.avarage / 10}` }
                            </label>
                        </div>
                    </div>
                )
            }
            <PaginationTable
                meta={meta}
                dataList={feedback}
                columns={feedbackColumns}
                loading={loading}
                error = {error}
                onChange={fetchData}
            />
        </React.Fragment>
    );
};

export default FeedBackList;
