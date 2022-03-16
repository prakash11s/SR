import React, {useEffect, useState} from "react";
import ContainerHeader from "../ContainerHeader";
import IntlMessages from "../../util/IntlMessages";
import {Card, CardBody, CardText} from "reactstrap";
import { getEmailTemplates } from "../../actions/Actions/MarketingAction";
import InfiniteScroll from "react-infinite-scroll-component";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducer} from "../../reducers/Interface/RootReducerInterface";

const EmailTemplate = (props:any) => {
  const [emailTemplate,setEmailTemplate] = useState([]);
  const dispatch = useDispatch();
  const { emailTemplates } = useSelector((state: IRootReducer) => state.marketingState);

  useEffect(() => {
    dispatch(getEmailTemplates())
  },[])

  useEffect(() => {
    if(emailTemplates){
      setEmailTemplate(emailTemplates);
    }
  },[emailTemplates]);

  return (
    <div className="d-flex justify-content-center app-wrapper">
      <div className="col-12 table-container">
        <ContainerHeader title={<IntlMessages id="breadCrumb.emailTemplate"/>} match={props.match} />
        <Card className={`shadow border-0`}>
          <CardBody>
            <CardText>
              <div className="table-responsive-material">
                {/*<InfiniteScroll*/}
                {/*  height="60vh"*/}
                {/*  loader={tableLoading}*/}
                {/*  dataLength={emailsOpened && emailsOpened.length}  //This is important field to render the next data*/}
                {/*  next={fetchData}*/}
                {/*  hasMore={meta && meta.has_more_pages}*/}

                {/*>*/}
                  <Table className="default-table table-unbordered table table-sm table-hover">
                    <TableHead className="th-border-b">
                      <TableRow >
                        <TableCell>Emails</TableCell>
                        <TableCell>Opens</TableCell>
                        <TableCell>First Opened at</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/*{emailsOpened && emailsOpened.map((data: IEmailOpens, index: number) => {*/}
                      {/*  return (*/}
                      {/*    <TableRow key={index} className="pointer">*/}
                      {/*      <TableCell>{data.subscriber_email}</TableCell>*/}
                      {/*      <TableCell>{data.open_count}</TableCell>*/}
                      {/*      <TableCell>{moment(data.first_opened_at).format('MM-DD-YYYY HH:mm:ss')}</TableCell>*/}
                      {/*    </TableRow>*/}
                      {/*  )*/}
                      {/*})}*/}
                    </TableBody>
                  </Table>
                {/*</InfiniteScroll>*/}
              </div>
            </CardText>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default EmailTemplate
