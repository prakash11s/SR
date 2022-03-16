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

const Emails: React.FC<any> = (props) => {


    interface IState {
        emailList: any,
        metaData: any,
        limit: number,
        isLoading: boolean,
        page: number,
        total: string,
        tableLoading: boolean,
        search: string,
        error: string,
        addData: boolean,
        menuState: boolean,
        rowClick: boolean
    }

    const history = useHistory();
    const intl = useIntl();



    const [state, setState] = useState<IState>({
        emailList: [],
        metaData: { has_more_pages: false },
        limit: 25,
        isLoading: false,
        page: 1,
        total: "",
        tableLoading: false,
        search: "",
        error: "",
        addData: false,
        menuState: false,
        rowClick: true
    });

    const RecipientCell = ({recipients}) => {
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
        const emailDetailRedirectURL = `/support/emails/${emailId}`
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
        },
    ]);


 

    const fetchData = ({ page, limit }) => {

        setState(prevState => ({
            ...prevState,
            page: page + 1,
            limit:limit
        }))
    }

    const onInitAPICall = async () => {
      
        try {
            const params = { page: state.page, limit: state.limit };
            const response = await axios.get(`/mail/system/automated-emails`, { params });

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


    const handleRowClickState = (val) => {
        setState(prevState => ({
            ...prevState,
            rowClick: val
        }))
    }

    

    useEffect(() => {
        onInitAPICall();
    }, [state.page, state.limit]);


    if (state.isLoading) {
        return <Loader />
    }


    const tableLoadingComponent = state.tableLoading && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));
    return (
        <>
            <ContainerHeader title={<IntlMessages id="sidebar.emails.system" />} match={props.match} />
    
            <PaginationTable
                meta={state.metaData}
                dataList={state.emailList}
                columns={callRecordColumns}
                loading={state.isLoading}
                onChange={fetchData}
                onRowClick={redirectToEmailDetailPage}
                error={state.error}
                isContextMenu={true}
                isSystemEmail={true}
                handleOnRightClick={handleContextMenu}
                rowClick={state.rowClick}
                handleRowClickState={handleRowClickState}
            />
            

        </>
    )
}

export default Emails;