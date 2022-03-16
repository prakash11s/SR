import { FETCH_ERROR, FETCH_START, FETCH_SUCCESS, HIDE_MESSAGE, SHOW_MESSAGE } from '../../constants/ActionTypes'
import { ICommon } from "../Interface/CommonInterface";
import {IAction} from "../Interface/ActionInterface";

const INIT_STATE:ICommon = {
    error: "",
    loading: false,
    message: ''
};

export default (state:ICommon = INIT_STATE, action:IAction) => {
    switch (action.type) {
        case FETCH_START: {
            return { ...state, error: '', message: '', loading: true };
        }
        case FETCH_SUCCESS: {
            return { ...state, error: '', message: '', loading: false };
        }
        case SHOW_MESSAGE: {
            return { ...state, error: '', message: action.payload, loading: false };
        }
        case FETCH_ERROR: {
            return { ...state, loading: false, error: action.payload, message: '' };
        }
        case HIDE_MESSAGE: {
            return { ...state, loading: false, error: '', message: '' };
        }
        default:
            return state;
    }
}
