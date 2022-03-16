import React, {useEffect, useMemo, useState} from "react";
import ContainerHeader from "../ContainerHeader";
import IntlMessages from "../../util/IntlMessages";
import {Card, CardBody, CardText} from "reactstrap";
import { Table, TableHead, TableRow, TableCell, TableBody, CircularProgress} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {getEmailOpens} from "../../actions/Actions/MarketingAction";
import {useParams} from "react-router";
import moment from "moment";
import InfiniteScroll from 'react-infinite-scroll-component';
import "./styles/Marketing.css"
import {IEmailOpens, IMarketingProps, IMeta, IParam} from "./interface/MarketingInterface";
import {IRootReducer} from "../../reducers/Interface/RootReducerInterface";

const EmailsOpen = (props:IMarketingProps) => {
  const dispatch = useDispatch();
  const params:IParam = useParams();
  const [ emailsOpened, setEmailOpened ] = useState<[]>([]);
  const [ isTableLoading, setIsTableLoading ] = useState<boolean>(false);
  const [ meta, setMeta ]:any = useState<IMeta>({has_more_pages:false});
  const [ page, setPage ] = useState<number>(1);

  const { emailsOpens } = useSelector((state: IRootReducer) => state.marketingState);

  useEffect(() => {
    dispatch(getEmailOpens(params.id));
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (emailsOpens) {
      setEmailOpened(emailsOpens.data)
      setMeta(emailsOpens.meta)
      setIsTableLoading(false)
    }
  }, [emailsOpens])


  useMemo(() => {
    setIsTableLoading(true)
    dispatch(getEmailOpens(params.id,page))
  },[page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = () => {
    setPage(page + 1);
  }

  const tableLoading = isTableLoading && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));

  return(
    <div className="d-flex justify-content-center app-wrapper">
        <div className="col-12 table-container">
          <ContainerHeader title={<IntlMessages id="breadCrumb.emailOpens"/>} match={props.match} />
           <Card className={`shadow border-0`}>
            <CardBody>
              <CardText>
                <div className="table-responsive-material">
                  <InfiniteScroll
                    height="60vh"
                    loader={tableLoading}
                    dataLength={emailsOpened && emailsOpened.length}  //This is important field to render the next data
                    next={fetchData}
                    hasMore={meta && meta.has_more_pages}

                  >
                  <Table className="default-table table-unbordered table table-sm table-hover">
                    <TableHead className="th-border-b">
                      <TableRow >
                        <TableCell>Emails</TableCell>
                        <TableCell>Opens</TableCell>
                        <TableCell>First Opened at</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emailsOpened && emailsOpened.map((data: IEmailOpens, index: number) => {
                        return (
                          <TableRow key={index} className="pointer">
                            <TableCell>{data.subscriber_email}</TableCell>
                            <TableCell>{data.open_count}</TableCell>
                            <TableCell>{moment(data.first_opened_at).format('MM-DD-YYYY HH:mm:ss')}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  </InfiniteScroll>
                </div>
              </CardText>
            </CardBody>
          </Card>
        </div>
    </div>
  );
}

export default EmailsOpen
