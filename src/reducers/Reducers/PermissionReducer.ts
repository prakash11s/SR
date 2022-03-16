import { GET_ALL_PERMISSION } from "../../constants/ActionTypes";
import { IPermissionReducer } from "../Interface/PermissionReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState:IPermissionReducer = {
    permissions: [],
};

export default (state:IPermissionReducer = initialState, { type, payload }: IAction) => {
    switch (type) {
        case GET_ALL_PERMISSION:
            return { ...state, permissions: payload };
        default:
            return state;
    }
};
