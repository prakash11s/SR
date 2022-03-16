import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { useParams } from "react-router";
import { getCampaign } from "../../actions/Actions/MarketingAction";
import ContainerHeader from "../ContainerHeader";
import IntlMessages from "../../util/IntlMessages";
import {Card, CardBody, CardText} from "reactstrap";
import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter, CircularProgress} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import "./styles/Marketing.css"
import {IMeta, ISelectedCampaign, IParam, IMarketingProps} from "./interface/MarketingInterface";
import { IRootReducer } from "../../reducers/Interface/RootReducerInterface";

const Campaign = (props:IMarketingProps) => {
  const param: IParam = useParams();
  const dispatch = useDispatch();
  const { campaignDetail } = useSelector((state: IRootReducer) => state.marketingState);
  const [selectedCampaign, setSelectedCampaign] = useState<[]>([]);
  const [ isTableLoading, setIsTableLoading ] = useState<boolean>(false);
  const [ meta, setMeta ] = useState<IMeta>({has_more_pages: false});
  const [ page, setPage ] = useState<number>(1);

  useEffect(() => {
    dispatch(getCampaign(param.id));
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(campaignDetail){
      setSelectedCampaign(campaignDetail.data)
      setMeta(campaignDetail.meta)
      setIsTableLoading(false)
    }
  },[campaignDetail])

  useMemo(() => {
    setIsTableLoading(true)
    dispatch(getCampaign(param.id,page))
  },[page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = () => {
    setPage(page + 1);
  }

  const tableLoading = isTableLoading && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));
  return (
    <div className="d-flex justify-content-center app-wrapper">
      <div className="col-12 table-container">
        <ContainerHeader title={<IntlMessages id="breadCrumb.emailOverview"/>} match={props.match}/>
        { selectedCampaign  && <Card className={`shadow border-0`}>
          <CardBody>
            <CardText>
              <div className="table-responsive-material">
                <InfiniteScroll
                  height="60vh"
                  loader={tableLoading}
                  dataLength={selectedCampaign && selectedCampaign.length}  //This is important field to render the next data
                  next={fetchData}
                  hasMore={meta && meta.has_more_pages}
                >
                <Table className="default-table table-unbordered table table-sm table-hover">
                  <TableHead className="th-border-b">
                    <TableRow>
                      <TableCell>Link</TableCell>
                      <TableCell>Unique Clicks</TableCell>
                      <TableCell>Total Clicks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { selectedCampaign && selectedCampaign.map((data:ISelectedCampaign,index:number) => {
                      return (
                        <TableRow key={index} className="pointer">
                          <TableCell>{data.url}</TableCell>
                          <TableCell>{data.unique_click_count}</TableCell>
                          <TableCell>{data.click_count}</TableCell>
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
        </Card>}
      </div>
    </div>
  );
}

export default Campaign;
