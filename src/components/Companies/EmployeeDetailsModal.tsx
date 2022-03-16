import React from "react";
import {Modal, ModalHeader} from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import IntlMessages from "../../util/IntlMessages";
import moment from "moment";
import {Button} from "@material-ui/core";

import { IDisplayCardProps, IEmployeeDetailsModalProps } from "./Interface/EmployeeDetailsModalInterface";

const EmployeeDetailsModal = (props: IEmployeeDetailsModalProps): JSX.Element => {

    /**
     * display data on DisplayCard
     * @param props
     * @returns {*}
     * @constructor
     */
    const DisplayCard = (props: IDisplayCardProps) =>
        <React.Fragment>
            <div className="col-md-4">
                <h5><b>{props.title}</b></h5>
                <h4 className={props.className}  onClick={props.onClick}>{props.value}</h4>
            </div>
        </React.Fragment>

    const  { employeeData } = props;
    return(
        <React.Fragment>
            <Modal className="modal-box modal-box-mail" toggle={props.toggle}  isOpen={props.isOpen} style={{zIndex: 2600}}>
                <ModalHeader className="modal-box-header bg-primary text-white">
                    <IntlMessages id="employee.detail" />
                    <IconButton className="text-white">
                        <CloseIcon onClick={props.toggle}/>
                    </IconButton>
                </ModalHeader>
                <div className="modal-box-content  d-flex flex-column">
                    <ul className="contact-list list-unstyled">
                        <li className="media ">
                                <span className="media-body">
                                    <Avatar className="size-80" alt="Remy Sharp" src={employeeData.avatar}/>
                                </span>
                        </li>

                        <li className="media">
                            <span className="media-body">
                                <DisplayCard title={<IntlMessages id="employee.first-name"/>}
                                             value={employeeData.first_name}/>
                            </span>
                            <span className="media-body">
                                <DisplayCard title={<IntlMessages id="employee.last-name"/>}
                                             value={employeeData.last_name}/>
                            </span>
                            <span className="media-body">
                                <DisplayCard title={<IntlMessages id="employee.role"/>} value={employeeData.role}/>
                            </span>
                            <span className="media-body">
                                <DisplayCard title={<IntlMessages id="employee.email"/>} value={employeeData.email}/>
                             </span>
                        </li>
                        <li className="media">
                             <span className="media-body">
                                <DisplayCard title={<IntlMessages id="employee.phone"/>} className="underlineElement"
                                             onClick={(e: React.MouseEvent<HTMLElement>) => props.callPhone(e, employeeData.id, employeeData.phone)}
                                             value={employeeData.phone}/>
                             </span>

                            <DisplayCard title={<IntlMessages id="employee.created-at"/>}
                                         value={moment(employeeData.created_at).format('MM-DD-YYYY HH:mm:ss')}/>


                            <DisplayCard title={<IntlMessages id="employee.updated-at"/>}
                                         value={moment(employeeData.updated_at).format('MM-DD-YYYY HH:mm:ss')}/>

                        </li>
                       <li>
                           <Button size="small"
                                   onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => props.deleteClick(event, employeeData.id)}
                                   className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
                                   color="primary">Delete account</Button>
                          {/*  <Button size="small"
                                   className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-light-green text-white"
                                   color="primary">Suspend account</Button>
                           <Button size="small"
                                   className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-info text-white"
                                   color="primary">Send password reset</Button> */}
                       </li>
                    </ul>

                </div>
            </Modal>
        </React.Fragment>
    )
}

export default EmployeeDetailsModal;
