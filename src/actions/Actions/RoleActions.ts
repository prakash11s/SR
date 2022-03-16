import axios from '../../util/Api';
import { store } from "../../store";

import {
    SET_ROLE_INFO,
    SET_DESCRIPTION,
    CHECK_SUBMIT_BUTTON_STATUS,
    SET_CREATEROLE_POPUP_TRUE,
    SET_CREATEROLE_POPUP_FALSE,
    SET_SUCCESS_VALUE_FALSE,
    SET_SUCCESS_VALUE_TRUE,
    SET_WARNING_VALUE_FALSE,
    SET_WARNING_VALUE_TRUE,
    SET_ALERT_POPUP_VALUE_FALSE,
    SET_ALERT_POPUP_VALUE_TRUE,
    SET_RESPONSE_ERROR_MESSAGE,
    SET_ROLE_LOADING_TRUE,
    SET_ROLE_LOADING_FALSE,
    SET_ROLE_TABLE_DATA,
    ADD_ROLE_TABLE_DATA,
    DELETE_ROLE_TABLE_DATA
} from "constants/ActionTypes";

export const setRole = (payload:string) => ({
    type: SET_ROLE_INFO,
    payload: payload
});

export const setDescription = (payload:string) => ({
 type: SET_DESCRIPTION,
 payload: payload
});

export const checkSubmitButtonStatus = () => ({
    type: CHECK_SUBMIT_BUTTON_STATUS
})

export const createRolePopUpTrue = () => ({
    type: SET_CREATEROLE_POPUP_TRUE
})

export const createRolePopUpFalse = () => ({
    type: SET_CREATEROLE_POPUP_FALSE
})

export const successValueFalse = () => ({
    type: SET_SUCCESS_VALUE_FALSE
})

export const successValueTrue = () => ({
    type: SET_SUCCESS_VALUE_TRUE
})

export const warningValueFalse = () => ({
    type: SET_WARNING_VALUE_FALSE
})

export const warningValueTrue = () => ({
    type: SET_WARNING_VALUE_TRUE
})

export const alertPopUpValueFalse = () => ({
    type: SET_ALERT_POPUP_VALUE_FALSE
})

export const alertPopUpValueTrue = () => ({
    type: SET_ALERT_POPUP_VALUE_TRUE
})

export const errorMessage = (payload:string) => ({
    type: SET_RESPONSE_ERROR_MESSAGE,
    payload: payload
})

export const setisRoleLoadingFalse = () => ({
    type: SET_ROLE_LOADING_FALSE
})

export const setisRoleLoadingTrue = () => ({
    type: SET_ROLE_LOADING_TRUE
})

export const setRoleTableData = (payload:object) => ({
    type: SET_ROLE_TABLE_DATA,
    payload: payload
})

export const addRoleTableData = (payload:any) => ({
    type: ADD_ROLE_TABLE_DATA,
    payload: payload
})

export const deleteRoleTableData = (payload:string) => {
    return  {
    type: DELETE_ROLE_TABLE_DATA,
    payload: payload
}}

export const triggerSubmitForm = () => {
    const { role, description } = store.getState().roleState;
    return (dispatch:any) => {
        axios.post('/system/authorization/roles', {
            "name": role,
            "description": description,
        })
            .then((response) => {
                dispatch(alertPopUpValueTrue());
                dispatch(successValueTrue());
            })
            .catch((error) => {
                dispatch(alertPopUpValueTrue());
                dispatch(warningValueTrue());
                dispatch(errorMessage(error.response.data.message))
            })
    };
};

export const getRoleTable = (limit:number, page:number) => {
    return (dispatch:any) => {
        dispatch(setisRoleLoadingTrue());
        axios.get(`/system/authorization/roles?limit=${limit}&page=${page}`)
            .then(response => response.data)
            .then((response) => {
                dispatch(setRoleTableData(response));
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                dispatch(setisRoleLoadingFalse());
            });
    };
};


export const fetchRoleTable = (limit:number, page:number) => {
    return (dispatch:any) => {
        dispatch(setisRoleLoadingTrue());
        axios.get(`/system/authorization/roles?limit=${limit}&page=${page}`)
            .then(response => response.data)
            .then((response) => {
                dispatch(addRoleTableData(response));
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                dispatch(setisRoleLoadingFalse());
            });
    }
}
