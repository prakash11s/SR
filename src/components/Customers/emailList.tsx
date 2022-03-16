import React, { Component, useState, useEffect } from 'react';
import ContainerHeader from '../../components/ContainerHeader/index';
import IntlMessages from '../../util/IntlMessages';
import axios from "../../util/Api"
import Loader from 'containers/Loader/Loader';
import CircularProgress from '@material-ui/core/CircularProgress';
import PaginationTable from "common/PaginationTable";
import { useIntl } from "react-intl";
import { readableDateTimeLocale } from "../../util/helper";
import { useHistory } from "react-router";
import CardMenuEmail from 'components/dashboard/Common/CardMenuEmail/CardMenuEmail';

const EmailsList: React.FC<any> = (props) => {


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
        rowClick: boolean
    }

    const history = useHistory();
    const intl = useIntl();



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

    const RecipientCell = ({ recipients }) => {
        const obj = recipients;

        const toTitle = obj?.to ? `${obj?.to.name} <${obj.to.email}>` : '-';
        const bccTitles = obj?.bcc?.length > 0 ? obj?.bcc : [];

        return (
            <ul className="table_recipient_cell m-0 p-0">
                <li><span><IntlMessages id="toTitle" />:</span> {toTitle} </li>
                <li><span><IntlMessages id="bccEmail" />:</span>
                    {bccTitles.length > 0 ? bccTitles.map((bccObj, i) => {
                        return (
                            `${bccObj?.name} <${bccObj?.email}>`
                        )
                    }) : '-'}
                </li>
            </ul>
        )
    }


    const dateTimeCell = (datetime) => {

        const localDateTimeFormat = intl.formatMessage({ id: 'localeDateTime', defaultMessage: "DD-MM-YYYY hh:mm:ss" });
        const formattedOrderDate = (datetime && readableDateTimeLocale(datetime, localDateTimeFormat));
        return formattedOrderDate;
    }

    const createdDate = (obj) => {
        return dateTimeCell(obj.created_at);
    }

    const updatedDate = (obj) => {
        return dateTimeCell(obj.updated_at);
    }

    const redirectToEmailDetailPage = (emailId) => {
        const emailDetailRedirectURL = `/support/orders/${props.id}/emails/${emailId}`
        history.replace(emailDetailRedirectURL);
    }

    const senderCell = (obj) => {
        return `${obj.sender.name} <${obj.sender.email}>`;
    }


    const [callRecordColumns, setcallRecordColumns] = useState([
        {
            name: "subject",
            key: "subject",
        },
        {
            name: "sender",
            key: "sender",
            render: (data) => senderCell(data),
        },
        {
            name: "recipients",
            key: "recipients",
            render: (data) => RecipientCell(data),
        },
        {
            name: "open_count",
            key: "opens_counts"
        },
        {
            name: "driver",
            key: "driver"
        },
        {
            name: "status",
            key: "status"
        },
        {
            name: "created_date",
            key: "created_at",
            render: (data) => createdDate(data),
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
            const response = await axios.get(`customers/${id}/emails`, { params });

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

    const handleContextMenu = (event, emailId) => {

        if (state.menuState) {
            setState(prevState => ({
                ...prevState,
                x: 0, y: 0,
                rowClick: true,
                menuState: false
            }))
        } else {

            let xCordinate = event.clientX;
            let yCordinate = event.clientY;
            setState(prevState => ({
                ...prevState,
                menuState: true,
                rowClick: false,
                x: xCordinate, y: yCordinate
            }))
        }

    }

    const handleRequestClose = (event, path) => {

        event.stopPropagation();
        if (path !== 'backdropClick') {
            history.push(path);
        }
        setState(prevState => ({
            ...prevState,
            x: 0, y: 0,
            menuState: false
        }))
    }

    const handleRowClickState = (val) => {
        setState(prevState => ({
            ...prevState,
            rowClick: val
        }))
    }



    useEffect(() => {
        const orderId = props.id;
        onInitAPICall(orderId);
        setState(prevState => ({
            ...prevState,
            orderId: orderId
        }));
    }, [state.page, state.limit]);


    // useEffect(() => {

    //     console.log('state', state);
    //     if(state.x && state.y) {
    //         setState(prevState => ({
    //             ...prevState,
    //             menuState: true
    //         }))
    //     }
    // },[state.x, state.y])

    if (state.isLoading) {
        return <Loader />
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mt-2">
                    <IntlMessages id="orderDetailViewTable.emailList" />
                </h3>
            </div>  
            <PaginationTable
                meta={state.metaData}
                dataList={state.emailList}
                columns={callRecordColumns}
                loading={state.isLoading}
                onChange={fetchData}
                onRowClick={redirectToEmailDetailPage}
                isContextMenu={true}
                handleOnRightClick={handleContextMenu}
                rowClick={state.rowClick}
                handleRowClickState={handleRowClickState}
                orderId={state.orderId}
                error={state.error}
            />
        </>
    )
}

export default EmailsList;