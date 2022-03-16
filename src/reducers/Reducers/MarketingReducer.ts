import {
  GET_CAMPAIGN_OVERVIEW,
  ADD_CAMPAIGN,
  ERROR_ADD_CAMPAIGN,
  GET_EMAIL_OPENS,
  GET_CAMPAIGN, GET_EMAIL_UNSUBSCRIBE,
  GET_OUTBOX_MESSAGE,
  GET_EMAIL_TEMPLATES,
  GET_STATUS, DELETE_CAMPAIGN

} from "../../constants/ActionTypes";
import { IAction } from "../Interface/ActionInterface";
import { IMarketingReducer} from "../Interface/MarketingReducerInterface";

const initialState: IMarketingReducer = {
  campaignOverview: {
    data: [],
    meta:{}
  },
  campaign: undefined,
  deletedCampaign: {
    status: undefined
  },
  errorMessage: "",
  emailsOpens: {
    data: [],
    meta: {
      has_more_pages: false
    }
  },
  campaignDetail: {
    data: [],
    meta: {
      has_more_pages: false
    }
  },
  emailUnsubscribes: {
    data: [],
    meta: {
      has_more_pages: false
    }
  },
  outboxMessages: {
    data: [],
    meta: {
      has_more_pages: false
    }
  },
  emailTemplates: [],
  status: [],
}

const Types = [
  {
    id: 1,
    name: "Pending",
    orders_count: 0
  },
  {
    id: 2,
    name: "Failed",
    orders_count: 0
  },
  {
    id: 3,
    name: "Sent",
    orders_count: 0
  },
  {
    id: 4,
    name: "Bounced",
    orders_count: 0
  },
  {
    id: 5,
    name: "Complaints",
    orders_count: 0
  }
];

export default (state:IMarketingReducer = initialState, { type, payload }:IAction) => {
  switch (type) {
    case GET_CAMPAIGN_OVERVIEW:
      return {
        ...state,
        campaignOverview: payload,
        errorMessage: "",
      };
    case GET_CAMPAIGN:
      return { ...state, campaignDetail: payload };
    case ADD_CAMPAIGN:
      return { ...state, campaign: payload };
    case DELETE_CAMPAIGN:
      return { ...state, deletedCampaign: payload };
    case ERROR_ADD_CAMPAIGN:
      return { ...state, errorMessage: payload };
    case GET_EMAIL_OPENS:
      return { ...state, emailsOpens: payload };
    case GET_EMAIL_UNSUBSCRIBE:
      return { ...state, emailUnsubscribes: payload };
    case GET_OUTBOX_MESSAGE:
      return { ...state, outboxMessages: payload };
    case GET_EMAIL_TEMPLATES:
      return { ...state, emailTemplates: payload };
    case GET_STATUS:
      return { ...state, status: Types };
    default:
      return state;
  }
};
