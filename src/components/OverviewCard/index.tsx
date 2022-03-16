import React from 'react';
import {Badge} from 'reactstrap';
import moment from "moment";
import { Button } from '@material-ui/core';

const OverviewCard = (props: any) => {
 return (
  <div className="jr-card p-0">

  <div className="jr-card-1header card-img-top mb-0 p-4 bg-grey lighten-4">
     <h3 className="card-heading"><b> Name : </b>{props.name}</h3>
  </div>

 <div className="card-body">
     <ul className="contact-list list-unstyled">
         <li className="media">
             <span className="media-body">
                 <b> Id : </b>{props.id}
             </span>
             <span className="media-body">

             <b> Phone : </b>
                 {props.phone}
             </span>
             <span className="media-body">
                <b> Email : </b> {props.email}
             </span>
             <span className="media-body">
            <b> Department : </b> {props.department}
         </span>
             <span className="media-body">
             <b> Salutation : </b> {props.salutation}
         </span>
         </li>
         <li className="media">
             <span className="media-body">
                 <b> Address :</b> {props.address && `${props.street_number}, ${props.street},  ${props.zip_code}, ${props.city}, ${props.country} `}
                 <br/>
         </span>
             <span className="media-body">
                 <b> Status :</b> <Badge color="success"
                                         pill>{props.status && props.toUpperCase()}</Badge>
             <br/>
         </span>
         </li>
         <li className="media">
             <span className="media-body">
                 <b>Created at:</b> {moment(props.created_at).format('MM-DD-YYYY HH:mm:ss')}
             </span>
             <span className="media-body">
                 <b>Updated at:</b> {moment(props.updated_at).format('MM-DD-YYYY HH:mm:ss')}
             </span>
             <span className="media-body">
                {props.execution_date && <div><b>Execution date
                    :</b> {moment(props.execution_date).format('MM-DD-YYYY HH:mm:ss')}</div>}
             </span>
             <span className="media-body">
                 {props.deleted_at && <div><b>Deleted at
                     :</b> {moment(props.deleted_at).format('MM-DD-YYYY HH:mm:ss')}</div>}
             </span>
         </li>
     </ul>

  <Button size="small" onClick={props.editButton}
          className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-warning text-white"
          color="primary">Edit order</Button>
     <Button size="small" onClick={() => props.deleteButton}
             className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
             color="primary">Delete order</Button>
     <Button size="small"
             className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn  bg-light-green text-white"
             color="primary" onClick={() => props.cancelButton}>Cancel order</Button>
     <Button size="small"
             className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
             color="primary">Send-callback-request</Button>
 </div>
</div>
 )
}

export default OverviewCard
