    import axios from "../../util/Api";

import { SERVICEPOINT_DATA, SELECTED_SERVICEPOINT, SERVICEPOINT_ACCESS_CHECK } from "constants/ActionTypes";
import { SYSTEM_SERVICEPOINT } from "../../constants/apiEndpoints";
import { getUser } from "./Auth";

export const setServicepoints = (payload:any) => {
    return  {
    type: SERVICEPOINT_DATA,
    payload
}};

export const addSelectedServicepoint = (payload:any) => {
    return (dispatch:any) => {
        localStorage.setItem("servicepoint", payload.id);
        dispatch({
            type: SELECTED_SERVICEPOINT,
            payload: payload.id
        });
        dispatch(getUser());
    };
};

export const setSelectedServicepoint = (servicePoint = null) => {
    return (dispatch:any) => {
        let servicepointId = localStorage.getItem('servicepoint');
        if (servicePoint) {
            servicepointId = servicePoint
        }
        if (servicepointId) {
            dispatch({
                type: SELECTED_SERVICEPOINT,
                payload: servicepointId
            });
        }
    }
}

export const setServicepointStartAsync = (history) => {
    return (dispatch:any) => {
        axios
            .get(SYSTEM_SERVICEPOINT)
            .then(response => {
                dispatch(setServicepoints(response.data));
                let foundId = false;
                for (var i = 0; i < response.data.data.length; i++) {
                    if (localStorage.getItem('servicepoint') == response.data.data[i].id) {
                        foundId = true;
                        break;
                    }
                }
                if (!localStorage.getItem('servicepoint') || !foundId) {
                    localStorage.setItem("servicepoint", response.data.data[0].id);
                    dispatch(setSelectedServicepoint(response.data.data[0].id));
                } else {
                    dispatch(setSelectedServicepoint());
                }
                dispatch({type: SERVICEPOINT_ACCESS_CHECK, payload: 'show'})
            })
            .catch(error => {
                dispatch({type: SERVICEPOINT_ACCESS_CHECK, payload: 'hide'})
                if (error.response && error.response.status === 403) {
                    history.replace('/partner/error/403');
                }   
            });
    };
};
