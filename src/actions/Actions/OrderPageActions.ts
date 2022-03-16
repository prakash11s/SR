import {
 SET_DATA_LIST
} from "constants/ActionTypes";

export const setDataList = (payload:[]) => {
 return  {
 type: SET_DATA_LIST,
 payload: payload
}};
