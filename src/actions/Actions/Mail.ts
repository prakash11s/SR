import {
    FETCH_ALL_USER_ASSOCIATED_MAILS,
    FETCH_FOLDERS,
    FETCH_START,
    FETCH_ERROR,
    FETCH_SUCCESS,
    FETCH_FOLDER_EMAILS,
    FETCH_START_EMAILS,
    FETCH_MAIL_ERROR,
    SET_RESPONSE_OBJECT
} from '../../constants/ActionTypes';

import axios from '../../util/Api';
import {AxiosRequestConfig} from "axios";
interface IMailResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
  error? :any
}
export const getInitValues = () => {
    const responseObject:any = {}

    return (dispatch:any) => {
        axios.get('system/mail-service/accounts')
            .then((response) => {
                if (response.data) {
                  if (response.data.data.length) {
                    responseObject.fetch_all_usr_associated_emails = response.data.data;
                    responseObject.acc_id = response.data.data[0].id;
                    axios.get(`/system/mail-service/accounts/${response.data.data[0].id}/folders`)
                      .then((response) => {
                        if (response.data) {
                          responseObject.fetch_folders = response.data.data

                          axios.get(`/system/mail-service/accounts/${responseObject.acc_id}/folders/${response.data.data[0].id}`)
                            .then((response:IMailResponse) => {
                              if (response.data) {
                                responseObject.fetch_emails_folders = response.data.data
                                dispatch({ type: SET_RESPONSE_OBJECT, payload: responseObject });
                              }
                            }).catch(function (error) {
                            console.log(error.response.message)
                          });
                        }
                      }).catch(function (error) {
                      dispatch({ type: FETCH_ERROR, payload: error.response.message });
                    });
                  }
                }
            }).catch(function (error) {
                console.log(error.response.message)
            });
    }
};


export const getUserAssociatedEmail = (data?:any) => {
    return (dispatch:any) => {
        dispatch({ type: FETCH_START_EMAILS });
        axios.get('system/mail-service/accounts')
            .then((response) => {
                if (response.data) {
                    dispatch({ type: FETCH_ALL_USER_ASSOCIATED_MAILS, payload: response.data.data });
                    dispatch(getUserAssociatedFolder(response.data.data[0].id));
                } else {
                    // dispatch({type: FETCH_ERROR, payload: response.error});
                }
            }).catch(function (error) {
                // dispatch({type: FETCH_ERROR, payload: error.message});
            });
    }
};

export const getUserAssociatedFolder = (account_id:any) => {
    debugger
    return (dispatch:any) => {
        dispatch({ type: FETCH_START });
        dispatch({ type: FETCH_START_EMAILS });
        axios.get(`/system/mail-service/accounts/${account_id}/folders`)
            .then((response) => {
                if (response.data) {
                    dispatch({ type: FETCH_SUCCESS });
                    dispatch({ type: FETCH_FOLDERS, payload: response.data.data });
                    dispatch(getFolderAssociatedMails(account_id, response.data.data[0].id));
                } else {
                    // dispatch({type: FETCH_ERROR, payload: response.error});
                }
            }).catch(function (error) {
                dispatch({ type: FETCH_ERROR, payload: error.message });
            });
    }
};

export const getFolderAssociatedMails = (account_id:any, folder_id:any) => {
    return (dispatch:any) => {
        dispatch({ type: FETCH_START_EMAILS });
        axios.get(`/system/mail-service/accounts/${account_id}/folders/${folder_id}`)
            .then((response:IMailResponse) => {
                if (response.data) {
                    dispatch({ type: FETCH_FOLDER_EMAILS, payload: response.data.data });
                } else {
                    dispatch({ type: FETCH_ERROR, payload: response.error });
                }
            }).catch(function (error) {
                dispatch({ type: FETCH_MAIL_ERROR, payload: error.response.status });
            });
    }
};
