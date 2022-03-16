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
} from "../../constants/ActionTypes";
import { IAbilityReducer } from "../Interface/AbilityReducerInterface";
import { IAction } from "../Interface/ActionInterface";

const initialState:IAbilityReducer = {
 isRoleLoading: false,
 ability: null,
 description: null,
 isButtonDisabled: true,
 createAbilityPopup: false,
 message: null,
 warningValue: false,
 successValue: false,
 alertPopUpValue: false
};

export default (state:IAbilityReducer = initialState, action:IAction) => {
 switch (action.type) {

   case SET_ABILITY_INFO: {
     return {
       ...state,
       ability: action.payload
     }
   }

   case SET_ABILITY_DESCRIPTION: {
     return {
       ...state,
       description: action.payload
     }
   }

   case CHECK_ABILITY_SUBMIT_BUTTON_STATUS: {
     const tempState = {...state};
     if (state.isButtonDisabled && state.description && state.ability && state.description.length >= 30 && state.ability.length >= 2 ) {
       tempState.isButtonDisabled = false
     }
     if ((!state.isButtonDisabled && state.description.length < 30) || state.ability.length < 2) {
       tempState.isButtonDisabled = true
     }
     return tempState;
   }

   case SET_CREATE_ABILITY_POPUP_TRUE: {
    return {
       ...state,
       createAbilityPopup: true
     }
   }

   case SET_CREATE_ABILITY_POPUP_FALSE: {
     return {
       ...state,
       createAbilityPopup: false
     }
   }

   case SET_ABILITY_SUCCESS_VALUE_FALSE: {
     return {
       ...state,
       successValue: false
     }
   }

   case SET_ABILITY_SUCCESS_VALUE_TRUE: {
     return {
       ...state,
       successValue: true
     }
   }

   case SET_ABILITY_WARNING_VALUE_FALSE: {
     return {
       ...state,
       warningValue: true
     }
   }

   case SET_ABILITY_WARNING_VALUE_TRUE: {
     return {
       ...state,
       warningValue: true
     }
   }

   case SET_ABILITY_ALERT_POPUP_VALUE_FALSE: {
     return {
       ...state,
       alertPopUpValue: false
     }
   }

   case SET_ABILITY_ALERT_POPUP_VALUE_TRUE: {
     return {
       ...state,
       alertPopUpValue: true
     }
   }

   case SET_ABILITY_RESPONSE_ERROR_MESSAGE: {
     return {
       ...state,
       message: action.payload
     }
   }

   default:
     return state;
 }
};
