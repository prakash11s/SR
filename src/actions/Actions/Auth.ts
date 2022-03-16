import {
    INIT_URL,
    USER_DATA,
    FETCH_SUCCESS,
    FETCH_ERROR,
    SIGNOUT_USER_SUCCESS,
    FETCH_START,
    USER_TOKEN_SET,
    SOCKET_CONNECTED
} from '../../constants/ActionTypes';
import { callDisconnect } from './SoftPhoneActions';
import axios from '../../util/Api'

import ReactGA from 'react-ga';
import { AxiosRequestConfig } from "axios";

interface IAuthResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request?: any;
    error?: any
}

export const setInitUrl = (url: string) => {
    return {
        type: INIT_URL,
        payload: url
    };
};

export const setUserOnline = (status: number) => {
    return (dispatch: any) => {
        dispatch({ type: SOCKET_CONNECTED, payload: status });
    }
};

export const getUser = () => {
    return (dispatch: any) => {
        dispatch({ type: FETCH_START });
        axios.get('profile')
            .then((response: IAuthResponse) => {
                if (response.data) {
                    ReactGA.set({ userId: response.data.id });
                    dispatch({ type: FETCH_SUCCESS });
                    dispatch({ type: USER_DATA, payload: response.data });
                } else {
                    dispatch({ type: FETCH_ERROR, payload: response.error });
                }
            }).catch(function (error) {
                dispatch({ type: FETCH_ERROR, payload: error.message });
            });
    }
};

export const userSignOut = () => {
    return (dispatch: any) => {
        dispatch({ type: FETCH_START });
        axios.delete('oauth/token',
        ).then((response: IAuthResponse) => {

            //disconnect the phone connection
            dispatch(callDisconnect());
            // remove the token
            localStorage.removeItem('token');
            // remove phoneAgent
            localStorage.removeItem('softPhoneAgent');

            if ((response.status as any) === true) {
                dispatch({ type: FETCH_SUCCESS });
            } else {
                dispatch({ type: FETCH_ERROR, payload: response.error });
            }

            dispatch({ type: SIGNOUT_USER_SUCCESS });
        }).catch(function (error) {
            dispatch({ type: FETCH_ERROR, payload: error.message });

            //disconnect the phone connection
            dispatch(callDisconnect());
            // remove the token
            localStorage.removeItem('token');
            // remove phoneAgent
            localStorage.removeItem('softPhoneAgent');
            dispatch({ type: SIGNOUT_USER_SUCCESS });

            console.log("Error****:", error.message);
        });
    }
};

export const redirectUserToLogin = () => ({
    type: USER_TOKEN_SET,
    payload: null
});



