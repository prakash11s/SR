import React, { useState, useEffect } from 'react'
import EmailTableCell from './EmailTableCell';
import IntlMessages from '../../util/IntlMessages';


const EmailTable: React.FC<any> = ({
  emailList
}) => {



  return (
    <>
      <div className="table-responsive-material">
        <table className="default-table table-unbordered table table-sm table-hover">
          <thead className="th-border-b ">
            <tr>
              <th style={{width: 200}}><IntlMessages id="subject" /></th>
              <th style={{width: 250}}><IntlMessages id="sender" /></th>
              <th style={{width: 400}}><IntlMessages id="recipients" /></th>
       
              <th><IntlMessages id="open_count" /></th>
              <th><IntlMessages id="driver" /></th>
              <th><IntlMessages id="status" /></th>
              <th><IntlMessages id="created_date" /></th>
            </tr>
          </thead>
          <tbody>
            {emailList.map((data, index) => {
              return (
                <EmailTableCell key={data.id} data={data} />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default EmailTable;