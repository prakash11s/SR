export interface IMarketingReducer {
  campaignOverview:ICampaignOverview;
  campaign:undefined;
  errorMessage:string;
  emailsOpens:ICampaign;
  campaignDetail:ICampaign;
  emailUnsubscribes:ICampaign;
  outboxMessages:ICampaign,
  emailTemplates:[],
  status:[],
  deletedCampaign:IDeleteCampaign
}
export interface ICampaignOverview {
    data:[]
    meta:object
}
export interface ICampaign {
  data:[]
  meta:{
    has_more_pages:boolean
  }
}

interface IDeleteCampaign {
  status:undefined
}
