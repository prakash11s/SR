import axios from "../../util/Api";
import { GET_ALL_PERMISSION } from "../../constants/ActionTypes";
/**
 * get permission list
 * @returns {Function}
 */
export const getAllPermission = () => {
    return (dispatch:any) => {
        axios.get(  `/system/authorization/permissions?limit=1000&page=0`).then((response) => {
            dispatch({ type: GET_ALL_PERMISSION , payload: response.data });
        }).catch(function (error) {

        });
    }
};
