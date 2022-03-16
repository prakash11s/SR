export interface ICampaignOverviewList {
  id:number;
  name:string;
  from_email:string | null;
  unique_open_count:number;
  unique_click_count:number;
  sent_to_number_of_subscribers:number;
}

export interface IMeta {
  has_more_pages:boolean
}

export interface IParam {
  id:string
}
export interface IEmailOpens{
  subscriber_email:string;
  open_count:number;
  first_opened_at:string;
}

export interface ISelectedCampaign {
  url:string;
  unique_click_count:number;
  click_count:number
}


export interface IEmailUnsubscribe {
  subscriber:ISubscribe
}

interface ISubscribe {
  email:string;
  first_name:string;
  last_name:string;
  unsubscribed_at:string;
}

export interface IMarketingProps {
  match: match<MatchParams>;
}

interface MatchParams {
  name: string;
}

interface match<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}
