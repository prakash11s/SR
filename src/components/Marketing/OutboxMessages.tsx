import React, {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {getOutboxMessage,getStatus} from "../../actions/Actions/MarketingAction";
import ContainerHeader from "../ContainerHeader";
import IntlMessages from "../../util/IntlMessages";
import {Card, CardBody, CardText} from "reactstrap";
import { Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TableFooter} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import "./styles/Marketing.css"
import {IEmailUnsubscribe, IMarketingProps, IMeta, IParam} from "./interface/MarketingInterface";
import {IRootReducer} from "../../reducers/Interface/RootReducerInterface";


const OutboxMessages = (props:IMarketingProps) => {
  const param: IParam = useParams();
  const dispatch = useDispatch();
  const [ outboxMessage,setOutboxMessage ] = useState<[]>([]);
  const [ isTableLoading, setIsTableLoading ] = useState<boolean>(false);
  const [ meta, setMeta ] = useState<IMeta>({has_more_pages:false});
  const [ page, setPage ] = useState<number>(1);
  const [ selectedFilter, setSelectedFilter ] = useState<[]>([]);
  const [ statuses, setStatuses ] = useState<[]>([]);
  const { outboxMessages,status } = useSelector((state: IRootReducer) => state.marketingState);

  useEffect(() => {
    dispatch(getOutboxMessage(param.id));
    dispatch(getStatus());
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(outboxMessages){
      setOutboxMessage(outboxMessages.data)
      setMeta(outboxMessages.meta)
      setIsTableLoading(false)
    }
  },[outboxMessages]);

  useEffect(() => {
    if(status){
      setStatuses(status)
    }
  },[status]);

  useMemo(() => {
    setIsTableLoading(true)
    dispatch(getOutboxMessage(param.id,page))
  },[page]); // eslint-disable-line react-hooks/exhaustive-deps

   const fetchData = () => {
    setPage(page + 1);
  }
  const toggleSelectedFilters = (type:any) => {
    // @ts-ignore
    setSelectedFilter(selectedFilter.includes(type) ? selectedFilter.filter((curr:any) => curr !== type) : [...selectedFilter,type]);
    dispatch(getOutboxMessage(param.id,page,type));
  }


  const tableLoading = isTableLoading && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));

  return (
    <div className="d-flex justify-content-center app-wrapper">
      <div className="col-12 table-container">
        <ContainerHeader title={<IntlMessages id="breadCrumb.outboxMessages"/>} match={props.match} statuses={statuses}  toggleSelectedFilters={toggleSelectedFilters}  selectedFilters={selectedFilter as any}/>
        {outboxMessage && <Card className={`shadow border-0`}>
          <CardBody>
            <CardText>
              <div className="table-responsive-material">
                <InfiniteScroll
                  height="60vh"
                  loader={tableLoading}
                  dataLength={outboxMessage && outboxMessage.length}  //This is important field to render the next data
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
                      { outboxMessage && outboxMessage.map((data:IEmailUnsubscribe,index:any) => {
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

export default OutboxMessages;
