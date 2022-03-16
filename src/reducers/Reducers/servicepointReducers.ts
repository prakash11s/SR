import { SERVICEPOINT_DATA, SELECTED_SERVICEPOINT } from "../../constants/ActionTypes";
import { IServicePointReducer } from "../Interface/ServicePointReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState:IServicePointReducer = {
    servicepointsList: [],
    selectedServicepoint: ""   
};

export default (state:IServicePointReducer = initialState, { type, payload }: IAction) => {
    switch (type) {
        case SERVICEPOINT_DATA:
            return {
                ...state, servicepointsList: payload
            };

        case SELECTED_SERVICEPOINT:
            return {
                ...state,
                selectedServicepoint: state.servicepointsList.data.find(
                    (list:any) => list.id === payload
                )
            };

        default:
            return state;
    }
};
