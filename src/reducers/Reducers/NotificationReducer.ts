import { SET_SHOW_MESSAGE_URL, SET_NOTIFICATION_HIDE, SET_SNACKBAR_SHOW } from "../../constants/ActionTypes";
import { INotificationReducer} from "../Interface/NotificationReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState:INotificationReducer = {
    show: false,
    message: null,
    url: null,
};

export default (state:INotificationReducer = initialState, action:IAction) => {
    switch (action.type) {
        case SET_SHOW_MESSAGE_URL:
            return {
                ...state,
                show: true,
                message: action.payload.message,
                url: action.payload.url
            };
        case SET_NOTIFICATION_HIDE:
            return {
                ...state,
                show: false,
                message: null,
                url: null,
            }
        case SET_SNACKBAR_SHOW:
            return {
                ...state,
                show: false,
            }

        default:
            return state;
    }
};
