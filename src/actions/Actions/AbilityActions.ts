import axios from '../../util/Api';
import { store } from "../../store";
import {IAbilityProps} from "../Interface/AbilityInterfaceProps";
import {
 SET_ABILITY_INFO,
 SET_ABILITY_DESCRIPTION,
 CHECK_ABILITY_SUBMIT_BUTTON_STATUS,
 SET_CREATE_ABILITY_POPUP_TRUE,
 SET_CREATE_ABILITY_POPUP_FALSE,
 SET_ABILITY_SUCCESS_VALUE_FALSE,
 SET_ABILITY_WARNING_VALUE_FALSE,
 SET_ABILITY_WARNING_VALUE_TRUE,
 SET_ABILITY_ALERT_POPUP_VALUE_FALSE,
 SET_ABILITY_SUCCESS_VALUE_TRUE,
 SET_ABILITY_ALERT_POPUP_VALUE_TRUE,
 SET_ABILITY_RESPONSE_ERROR_MESSAGE
} from "constants/ActionTypes";

export const setAbility = (payload:string) => ({
 type: SET_ABILITY_INFO,
 payload: payload
});

export const setDescription = (payload:string) => ({
 type: SET_ABILITY_DESCRIPTION,
 payload: payload
});

export const checkSubmitButtonStatus = () => ({
 type: CHECK_ABILITY_SUBMIT_BUTTON_STATUS
});

export const createAbilityPopUpTrue = () => ({
 type: SET_CREATE_ABILITY_POPUP_TRUE
});

export const createAbilityPopUpFalse = () => ({
 type: SET_CREATE_ABILITY_POPUP_FALSE
});

export const successValueFalse = () => ({
 type: SET_ABILITY_SUCCESS_VALUE_FALSE
});

export const warningValueFalse = () => ({
 type: SET_ABILITY_WARNING_VALUE_FALSE
});

export const warningValueTrue = () => ({
 type: SET_ABILITY_WARNING_VALUE_TRUE
});

export const alertPopUpValueFalse = () => ({
 type: SET_ABILITY_ALERT_POPUP_VALUE_FALSE
});

export const successValueTrue = () => ({
 type: SET_ABILITY_SUCCESS_VALUE_TRUE
})

export const alertPopUpValueTrue = () => ({
 type: SET_ABILITY_ALERT_POPUP_VALUE_TRUE
})

export const errorMessage = (payload:any) => ({
 type: SET_ABILITY_RESPONSE_ERROR_MESSAGE,
 payload: payload
})


export const triggerSubmitForm = () => {
 const { ability, description } = store.getState().abilityState;
 return (dispatch:any) => {
  axios.post('/system/authorization/permissions', {
   "name": ability,
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
