import {
    FETCH_ALL_USER_ASSOCIATED_MAILS,
    FETCH_FOLDERS,
    FETCH_FOLDER_EMAILS,
    FETCH_START_EMAILS,
    FETCH_MAIL_ERROR,
    SET_RESPONSE_OBJECT
} from "../../constants/ActionTypes";
import _ from 'lodash';
import {IMailReducer} from "../Interface/MailReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState:IMailReducer = {}


export default (state:IMailReducer = initialState, { type, payload }:IAction) => {
    switch (type) {
        case FETCH_ALL_USER_ASSOCIATED_MAILS:
            return { ...state, associatedEmails: payload }
        case FETCH_FOLDERS:
            return { ...state, associatedFolder: payload }
        case FETCH_START_EMAILS:
            return { ...state, loader: true }
        case FETCH_MAIL_ERROR:
            return { ...state, loader: false, error: payload }
        case FETCH_FOLDER_EMAILS:
            const emailData = _.values(payload)
            return { ...state, associatedFolderEmails: emailData, loader: false, error: '' }
        case SET_RESPONSE_OBJECT:
            const emailInfo = _.values(payload.fetch_emails_folders)
            return {
                ...state,
                associatedEmails: payload.fetch_all_usr_associated_emails,
                associatedFolder: payload.fetch_folders,
                associatedFolderEmails: emailInfo
            }
        default:
            return state
    }
}
