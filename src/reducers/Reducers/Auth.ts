import {INIT_URL, SIGNOUT_USER_SUCCESS, USER_DATA, USER_TOKEN_SET, SOCKET_CONNECTED} from "../../constants/ActionTypes";
import { IAuth } from "../Interface/AuthInterface";
import {IAction} from "../Interface/ActionInterface";

/**
 * @type {{alertMessage: string, loader: boolean, showMessage: boolean, authUser: string, initURL: string}}
 */
const INIT_STATE:IAuth = {
    token: JSON.parse(<string>localStorage.getItem('token')),
    authUser: JSON.parse(<string>localStorage.getItem('user')),
    isWebsocketConnected: 2,
    initURL: '',
};


export default (state:IAuth = INIT_STATE, action:IAction) => {
    switch (action.type) {


        case INIT_URL: {
            return {...state, initURL: action.payload};
        }

        case SIGNOUT_USER_SUCCESS: {
            return {
                ...state,
                token: null,
                authUser: null,
                initURL: '/auth/logout'
            }
        }

        case USER_DATA: {
            return {
                ...state,
                authUser: action.payload,
            };
        }

        case SOCKET_CONNECTED: {
            return {
                ...state,
                isWebsocketConnected: action.payload,
            };
        }

        case USER_TOKEN_SET: {
            return {
                ...state,
                token: action.payload,
            };
        }

        default:
            return state;
    }
}
