import React, { useEffect, useState } from "react";
import { ICampaignOverviewList, IMarketingProps } from "./interface/MarketingInterface";
import { IRootReducer } from "../../reducers/Interface/RootReducerInterface";
import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Button,
        FormControl, TextField, MenuItem, Select } from "@material-ui/core";
import {Card, CardBody, CardText} from 'reactstrap';
import {useSelector, useDispatch} from "react-redux";
import {getCampaignOverview, addCampaigns,getEmailTemplates,deleteCampaign} from "../../actions/Actions/MarketingAction";
import IntlMessages from "../../util/IntlMessages";
import ContainerHeader from "../ContainerHeader";
import { useHistory } from "react-router";
import Loader from 'containers/Loader/Loader';
import SweetAlert from "react-bootstrap-sweetalert";
import "./styles/Marketing.css"

const CampaignOverView = (props:IMarketingProps) => {
  const [campaignOverviewList, setCampaignOverViewList] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCreatePopup, setShowCreatePopup] = useState<boolean>(false);
  const [successPopup, setSuccessPopup] = useState<boolean>(false);
  const [deletePopUp, setDeletePopUp] = useState<boolean>(false);
  const [errorPopup, setErrorPopupPopup] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [templateId, setTemplateId] = useState<string | number | any>("");
  const [campaignId, setCampaignId] = useState<number>(0);

  const {campaignOverview, errorMessage, emailTemplates, campaign, deletedCampaign} = useSelector((state: IRootReducer) => state.marketingState);

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true)
    dispatch(getCampaignOverview());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoading(false);
    if (campaignOverview.data) {
      setCampaignOverViewList(campaignOverview.data)
    }
  }, [campaignOverview])

  useEffect(() => {
    if(campaign) {
      setShowCreatePopup(false);
      setSuccessPopup(true)
    }
  },[campaign])

  useEffect(() => {
    if(errorMessage) {
      setShowCreatePopup(false);
      setErrorPopupPopup(true);
    }
  },[errorMessage])

  useEffect(() => {
    if(campaignId) {
      setDeletePopUp(true);
    }
  },[campaignId])

  const onRowClick = (id: number) => {
    history.push(`/marketing/campaigns/${id}`)
  }

  const createCampaign = () => {
    dispatch(getEmailTemplates());
    setShowCreatePopup(true);
  }

  const loadCampaignList = (popUp?:boolean) => {
    dispatch(getCampaignOverview());
    setName("");
    setTemplateId("");
    popUp ? setSuccessPopup(false) : setErrorPopupPopup(false);
  }

  const addCampaign = () => {
    dispatch(addCampaigns(name, templateId))
  }

  const createPopupCancel = () => {
    setName("");
    setTemplateId("");
    setShowCreatePopup(false)
  }

  const onDelete = (e,campaignId: number) => {
      e.stopPropagation();
      setCampaignId(campaignId);
  }
  const deleteCampaigns = (id:number) => {
    dispatch(deleteCampaign(id))
    setDeletePopUp(false);
  }

  useEffect(() => {
    if(deletedCampaign.status) {
      if(deletedCampaign.status === 200) {
        setSuccessPopup(true);
      } else {
        setErrorPopupPopup(true);
      }
    }
  },[deletedCampaign])

  return (
    <div className="d-flex justify-content-center app-wrapper">
      {isLoading ? <Loader/> :

        <div className="col-12 table-container">
          <ContainerHeader title={<IntlMessages id="breadCrumb.campaignOverview"/>} match={props.match}/>
          <div>
            <Button variant="contained" className="jr-btn bg-white text-dark float-right" onClick={createCampaign} id="create_campaign"><i
              className="zmdi zmdi-plus text-dark font-size-20"/> Create Campaign</Button>
          </div>
          <br/>
          <br/>
          <Card className={`shadow border-0`}>
            <CardBody>
              <CardText>
                <div className="table-responsive-material">

                  <Table className="default-table table-unbordered table table-sm table-hover">
                    <TableHead className="th-border-b">
                      <TableRow >
                        <TableCell id="name">Name</TableCell>
                        <TableCell id="emails">Emails</TableCell>
                        <TableCell id="unique_opens">Unique Opens</TableCell>
                        <TableCell id="unique_clicks">Unique Clicks</TableCell>
                        <TableCell id="sent">Sent</TableCell>
                        <TableCell id="action">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaignOverviewList && campaignOverviewList.map((data: ICampaignOverviewList, index: number) => {
                        return (
                          <TableRow key={index} id={"cy-table-row_"+index} onClick={() => onRowClick(data.id)} className="pointer">
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.from_email}</TableCell>
                            <TableCell>{data.unique_open_count}</TableCell>
                            <TableCell>{data.unique_click_count}</TableCell>
                            <TableCell>{data.sent_to_number_of_subscribers}</TableCell>
                            <TableCell>
                              <Button variant="contained" id={"delete_"+index} className="jr-btn bg-white text-dark" onClick={(e) => onDelete(e,data.id)}>Delete</Button>
                              <Button variant="contained" id={"duplicate_"+index}className="jr-btn bg-white text-dark">Duplicate</Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                    <TableFooter>
                    </TableFooter>

                  </Table>
                </div>
              </CardText>
            </CardBody>
          </Card>
        </div>}
      <SweetAlert show={showCreatePopup}
                  info
                  id="create_alert"
                  showCancel
                  confirmBtnText="Save"
                  cancelBtnText="cancel"
                  cancelBtnBsStyle="default"
                  onConfirm={() => addCampaign()}
                  onCancel={createPopupCancel}
                  title="New Campaign">
                  Add New Campaign
        <form className="row" autoComplete="off">
          <div className="col-12">
            <FormControl className="w-100 mb-2">
              <TextField
                autoFocus margin="dense" id="name" label="Name" type="text" fullWidth value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                displayEmpty
                className="mt-3">
                <MenuItem value="">
                  -- None --
                </MenuItem>
                {emailTemplates && emailTemplates.map((data: string,index:number) => {
                  return (<MenuItem value={data} key={index}>{data}</MenuItem>)
                })}
              </Select>
            </FormControl>
          </div>
        </form>
      </SweetAlert>
      <SweetAlert show={successPopup}
                  success
                  id="success_alert"
                  confirmBtnText="Done"
                  onConfirm={() => loadCampaignList(true)}
                  title="Created">
        Added Successfully
      </SweetAlert>
      <SweetAlert show={errorPopup}
                  id="error_alert"
                  warning
                  confirmBtnText="Ok"
                  confirmBtnBsStyle="danger"
                  onConfirm={loadCampaignList}
                  title="Error">
                  Something went wrong !
      </SweetAlert>
      <SweetAlert show={deletePopUp}
                  warning
                  id="delete_alert"
                  showCancel
                  confirmBtnText="Delete"
                  cancelBtnText="cancel"
                  confirmBtnBsStyle="danger"
                  cancelBtnBsStyle="default"
                  title="Delete"
                  onCancel ={() => setDeletePopUp(false)}
                  onConfirm ={() => deleteCampaigns(campaignId)}
                  >
        Are you sure want to delete campaign ?
      </SweetAlert>
    </div>
  );
}

export default CampaignOverView;
