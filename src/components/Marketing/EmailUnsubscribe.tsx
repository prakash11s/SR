import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {getEmailUnsubscribe} from "../../actions/Actions/MarketingAction";
import ContainerHeader from "../ContainerHeader";
import IntlMessages from "../../util/IntlMessages";
import {Card, CardBody, CardText} from "reactstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TableFooter} from "@material-ui/core";
import moment from "moment";
import "./styles/Marketing.css"
import {IEmailUnsubscribe, IMarketingProps, IMeta, IParam} from "./interface/MarketingInterface";
import {IRootReducer} from "../../reducers/Interface/RootReducerInterface";

const EmailUnsubscribe = (props:IMarketingProps) => {
  const [ emailUnsubscribe,setEmailUnsubscribe ] = useState<[]>([]);
  const [ isTableLoading, setIsTableLoading ] = useState<boolean>(false);
  const [ meta, setMeta ] = useState<IMeta>({has_more_pages:false});
  const [ page, setPage ] = useState<number>(1);
  const param: IParam = useParams();
  const dispatch = useDispatch();

  const { emailUnsubscribes } = useSelector((state: IRootReducer) => state.marketingState);

  useEffect(() => {
    dispatch(getEmailUnsubscribe(param.id));
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(emailUnsubscribes){
      setEmailUnsubscribe(emailUnsubscribes.data);
      setMeta(emailUnsubscribes.meta);
      setIsTableLoading(false);
    }
  },[emailUnsubscribes]);

  useMemo(() => {
    setIsTableLoading(true);
    dispatch(getEmailUnsubscribe(param.id,page))
  },[page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = () => {
    setPage(page + 1);
  };

  const tableLoading = isTableLoading && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));
    return(
      <div className="d-flex justify-content-center app-wrapper">
        <div className="col-12 table-container">
          <ContainerHeader title={<IntlMessages id="breadCrumb.emailUnsubscribe"/>} match={props.match} />
          {emailUnsubscribe && <Card className={`shadow border-0`}>
            <CardBody>
              <CardText>
                <div className="table-responsive-material">
                  <InfiniteScroll
                    height="60vh"
                    loader={tableLoading}
                    dataLength={emailUnsubscribe && emailUnsubscribe.length}  //This is important field to render the next data
                    next={fetchData}
                    hasMore={meta && meta.has_more_pages}>
                    <Table className="default-table table-unbordered table table-sm table-hover">
                      <TableHead className="th-border-b">
                        <TableRow >
                          <TableCell>Email</TableCell>
                          <TableCell>First Name</TableCell>
                          <TableCell>Last Name</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { emailUnsubscribe && emailUnsubscribe.map((data:IEmailUnsubscribe,index:any) => {
                          return (
                            <TableRow key={index} className="pointer">
                              <TableCell>{data.subscriber.email}</TableCell>
                              <TableCell>{data.subscriber.first_name}</TableCell>
                              <TableCell>{data.subscriber.last_name}</TableCell>
                              <TableCell>{data.subscriber.unsubscribed_at  && moment(data.subscriber.unsubscribed_at).format('MM-DD-YYYY HH:mm:ss')}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                      <TableFooter>
                      </TableFooter>
                    </Table>
                  </InfiniteScroll>
                </div>
              </CardText>
            </CardBody>
          </Card> }
        </div>
      </div>
    )
}

export default EmailUnsubscribe

