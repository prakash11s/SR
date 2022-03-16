import {
  GET_CAMPAIGN_OVERVIEW,
  ADD_CAMPAIGN,
  ERROR_ADD_CAMPAIGN, GET_EMAIL_OPENS,
  GET_CAMPAIGN, GET_EMAIL_UNSUBSCRIBE,
  GET_OUTBOX_MESSAGE,
  GET_EMAIL_TEMPLATES, GET_STATUS, DELETE_CAMPAIGN
} from '../../constants/ActionTypes';
import axios from "../../util/Api";


/**
 * Get Campaign overview action
 * @returns {Function}
 */
export const getCampaignOverview = (page?:number) => {
  return (dispatch:any) => {
    axios.get(  `marketing/campaigns`).then((response) => {
      dispatch({ type: GET_CAMPAIGN_OVERVIEW , payload: response.data });
    }).catch(function (error) {

    });
  }
};
/**
 * Add Campaign  action
 * @returns {Function}
 */
export const addCampaigns = (name:string,templateId:string) => {
  return (dispatch:any) => {
    axios.post(  `marketing/campaigns`,{ name:name, template_id:templateId }).then((response) => {
      dispatch({ type: ADD_CAMPAIGN , payload: response.data });
    }).catch(function (error) {
      dispatch({ type: ERROR_ADD_CAMPAIGN , payload: error });
    });
  }
};

/**
 * Delete campaign
 */
export const deleteCampaign = (id:number) => {
  return (dispatch: any) => {
    axios.delete(`/marketing/campaigns/${id}`).then((response) => {
      dispatch({type: DELETE_CAMPAIGN, payload: response});
    }).catch(function (error) {
        console.log(error);
    });
  };
}

/**
 * Get Email Opens action
 * @param id
 * @param page
 */
export const getEmailOpens = (id:string,page?:number) => {
  return (dispatch: any) => {
    axios.get(`marketing/campaigns/${id}/opens?limit=25&page=${page}`).then((response) => {
      dispatch({type: GET_EMAIL_OPENS, payload: response.data});
    }).catch(function (error) {

    });
  };
}

/**
 * get particular campaign click
 * @param id
 * @param page
 */

export const getCampaign = (id:string,page?:number) => {
  return (dispatch: any) => {
    axios.get(`marketing/campaigns/${id}/clicks?limit=25&page=${page}`).then((response) => {
      dispatch({type: GET_CAMPAIGN, payload: response.data});
    }).catch(function (error) {
    });
  };
}
/**
 * Get unsubscribed email
 * @param id
 * @param page
 */
export const getEmailUnsubscribe = (id:string,page?:number) => {
  return (dispatch: any) => {
    axios.get(`marketing/campaigns/${id}/unsubscribes?limit=25&page=${page}`).then((response) => {
      dispatch({type: GET_EMAIL_UNSUBSCRIBE, payload: response.data});
    }).catch(function (error) {

    });
  };
}
/**
 * Get outbox messages
 * @param id
 * @param page
 * @param type
 */
export const getOutboxMessage = (id:string,page?:number,type?:string) => {
  type = type !== undefined ? type : "all";
  return (dispatch: any) => {
    axios.get(`marketing/campaigns/${id}/outbox?type=${type}`).then((response) => {
      dispatch({type: GET_OUTBOX_MESSAGE, payload: response.data});
    }).catch(function (error) {

    });
  };
}
export const getEmailTemplates = () => {
  return (dispatch: any) => {
    axios.get(`marketing/email-templates`).then((response) => {
      dispatch({type: GET_EMAIL_TEMPLATES, payload: response.data});
    }).catch(function (error) {

    });
  };
}

export const getStatus = () => {
  return (dispatch: any) => {
      dispatch({type: GET_STATUS});
  };
}


