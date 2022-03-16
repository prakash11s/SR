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
} from "../../constants/ActionTypes";
import { IRoleReducer } from "../Interface/RoleReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState:IRoleReducer = {
  roleTableData: {
    data: [],
    meta: {}
  },
  isRoleLoading: false,
  role: null,
  description: null,
  isButtonDisabled: true,
  createRolePopup: false,
  message: null,
  warningValue: false,
  successValue: false,
  alertPopUpValue: false
};

export default (state:IRoleReducer = initialState, action:IAction) => {
  switch (action.type) {

    case SET_ROLE_INFO: {
      return {
        ...state,
        role: action.payload
      }
    }

    case SET_DESCRIPTION: {
      return {
        ...state,
        description: action.payload
      }
    }

    case CHECK_SUBMIT_BUTTON_STATUS: {
      const tempState = {...state};
      if (state.isButtonDisabled && state.description && state.description.length >= 30) {
        tempState.isButtonDisabled = false
      }
      if ((!state.isButtonDisabled && state.description.length < 30) || state.role.length < 5) {
        tempState.isButtonDisabled = true
      }
      return tempState;
    }

    case SET_CREATEROLE_POPUP_TRUE: {
      return {
        ...state,
        createRolePopup: true
      }
    }

    case SET_CREATEROLE_POPUP_FALSE: {
      return {
        ...state,
        createRolePopup: false
      }
    }

    case SET_SUCCESS_VALUE_FALSE: {
      return {
        ...state,
        successValue: false
      }
    }

    case SET_SUCCESS_VALUE_TRUE: {
      return {
        ...state,
        successValue: true
      }
    }

    case SET_WARNING_VALUE_FALSE: {
      return {
        ...state,
        warningValue: true
      }
    }

    case SET_WARNING_VALUE_TRUE: {
      return {
        ...state,
        warningValue: true
      }
    }

    case SET_ALERT_POPUP_VALUE_FALSE: {
      return {
        ...state,
        alertPopUpValue: false
      }
    }

    case SET_ALERT_POPUP_VALUE_TRUE: {
      return {
        ...state,
        alertPopUpValue: true
      }
    }

    case SET_RESPONSE_ERROR_MESSAGE: {
      return {
        ...state,
        message: action.payload
      }
    }

    case SET_ROLE_LOADING_TRUE: {
      return {
        ...state,
        isRoleLoading: true
      }
    }

    case SET_ROLE_LOADING_FALSE: {
      return {
        ...state,
        isRoleLoading: false
      }
    }

    case SET_ROLE_TABLE_DATA: {
      return {
        ...state,
        roleTableData: action.payload
      }
    }

    case ADD_ROLE_TABLE_DATA: {
      return {
        ...state,
        roleTableData: {
          data: [...state.roleTableData.data, ...action.payload.data],
          meta: action.payload.meta
        }
      }
    }

    case DELETE_ROLE_TABLE_DATA: {
      let removeIndex = state.roleTableData.data.map((item:any) => item.id ).indexOf(action.payload);
      state.roleTableData.data.splice(removeIndex, 1)
      return state;
  }

    default:
      return state;
  }
};
