import {
 GET_PARTNER_EMPLOYEES
} from "constants/ActionTypes";
import {IAction} from "../Interface/ActionInterface";
import { IPartnerEmployeesReducer } from "../Interface/PartnerEmployeesReducerInterface";

const initialState : IPartnerEmployeesReducer = {
 partnerEmployees: [],
};

export default (state:any = initialState, { type, payload } : IAction) => {
 
 switch (type) {
     case GET_PARTNER_EMPLOYEES:
         return { ...state, partnerEmployees: payload };
             
     default:
         return state;
 }
};