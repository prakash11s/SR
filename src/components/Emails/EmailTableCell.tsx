import { getEmailOpens } from 'actions/Actions/MarketingAction';
import React, { useState, useEffect } from 'react'
import { useIntl } from "react-intl";
import { readableDateTimeLocale } from "../../util/helper";
import CardMenuEmail from '../dashboard/Common/CardMenuEmail/CardMenuEmail'
import IntlMessages from '../../util/IntlMessages';
import {
    Tooltip, 
} from "@material-ui/core";
import { useHistory } from "react-router";
import ResendEmailModal from './ResendEmailModal';
import Menu from "@material-ui/core/Menu";
import axios from "../../util/Api"; 
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardText, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Avatar, Chip, Input, MenuItem, Select, TextField, Grid, FormControl, Button } from '@material-ui/core';


const EmailTableCell: React.FC<any> = ({ 
    data, 
    key
}) => {

    const [emailState, setEmailState] = React.useState({
        x: 0, y: 0,
        menuState: false
    });

    const [showModal, setShowModal] = useState(false);
    const history = useHistory();
    const intl = useIntl();

    const RecipientCell = ({
        obj
    }) => {

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

    const redirectToEmailDetailPage = (emailId) => {
  
        const emailDetailRedirectURL = `/support/emails/${emailId}`
        history.replace(emailDetailRedirectURL);
    }

    const toggleModal = () => {
        setShowModal(!showModal)
    }

    const ContextMenu = ({ emailId }) => {
        return (
            <Menu
                keepMounted
                anchorReference="anchorPosition"
                anchorPosition={{ left: emailState.x, top: emailState.y }}
                open={emailState.menuState}
                onClose={handleRequestClose}
                MenuListProps={{
                    style: {
                        width: "auto",
                        paddingTop: 0,
                        paddingBottom: 0,

                    },
                }}
            >
                <MenuItem
                    onClick={(e) =>
                        redirectToEmailDetailPage(emailId)
                    }
                >
                    Open Email
                </MenuItem>
                <MenuItem
                    onClick={() => toggleModal()}
                >
                    Resend Email
                </MenuItem>
            </Menu>
        )
    }

    /*
    * Table row context menu handler
    */
    const onRightClick = (event, id) => {

console.log('yesssssssssssssss');

        event.preventDefault();
        if (emailState.menuState) {
     
            setEmailState(prevState => ({
                ...prevState,
                x: 0, y: 0,
                menuState: false
            }))

        } else {

            let xCordinate = event.clientX;
            let yCordinate = event.clientY;
      
            setEmailState(prevState => ({
                ...prevState,
                menuState: true,
                x: xCordinate, y: yCordinate
            }))
        }
    }

    const handleRequestClose = (event, path) => {

        event.stopPropagation();
        if (path !== 'backdropClick') {
            history.push(path);
        }
        setEmailState(prevState => ({
            ...prevState,
            x: 0, y: 0,
            rowClick: true,
            menuState: false
        }))
    }


    return (
        <>
            <tr key={key} style={{ cursor: 'pointer' }}
                onClick={(event) => { event.preventDefault(); redirectToEmailDetailPage(data.id); }}
                onContextMenu={(e) => onRightClick(e, data.id) }
                tabIndex={-1}
            >
                <td>
                    {data.subject}
                </td>
                <td> {`${data.sender.name} <${data.sender.email}>`} </td>
                <td> <RecipientCell obj={data.recipients} /> </td>
                <td>  {data.opens_counts} </td>
                <td> {data.driver} </td>
                <td> {data.status}  </td>
                <td> {dateTimeCell(data.created_at)} </td>
                {/* <td>{dateTimeCell(data.updated_at)}</td> */} 
                <td>
                    <ContextMenu emailId={data.id}/>
                </td>
            </tr> 
            {showModal && <ResendEmailModal toggleModal={toggleModal} showModal={showModal} id={data.id}/>}
        </>
    ) 
} 

export default EmailTableCell;