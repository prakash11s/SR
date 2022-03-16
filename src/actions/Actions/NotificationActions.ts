import { SET_SHOW_MESSAGE_URL, SET_NOTIFICATION_HIDE, SET_SNACKBAR_SHOW } from "constants/ActionTypes";

export const setShowMessageUrl = (payload:string) => ({
    type: SET_SHOW_MESSAGE_URL,
    payload: payload
});

export const setNotificationHide = () => ({
    type: SET_NOTIFICATION_HIDE
});

export const setSnackbarShow = () => ({
    type: SET_SNACKBAR_SHOW
});
