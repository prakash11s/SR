import {
    SET_EMPLOYEES_TABLE_DATA,
    SET_IS_EMPLOYEE_TABLE_LOADING_TRUE,
    SET_IS_EMPLOYEE_TABLE_LOADING_FALSE,
    SET_ROLES,
    SET_COUNTRY_CODES,
    SET_FIRST_NAME,
    SET_LAST_NAME,
    SET_EMAIL,
    SET_PHONE_COUNTRY,
    SET_PHONE,
    SET_ROLE,
    RESET_EMPLOYEE_DETAILS,
    SET_SUBMIT_DISABLE,
    SET_SUBMIT_ENABLE,
    SET_SUCCESS_TRUE,
    SET_WARNING_TRUE,
    SET_ERROR_MESSAGE,
    SET_WARNING_FALSE,
    SET_SUCCESS_FALSE,
    SET_POPUP_TRUE,
    HIDE_ALERT_POPUP,
    DELETE_EMPLOYEE_RECORD,
    ADD_EMPLOYEES_TABLE_DATA
} from "../../constants/ActionTypes";
import { IEmployeesReducer } from "../Interface/EmployeesReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState:IEmployeesReducer = {
    employeesTableData: {
        data: [],
        meta: {}
    },
    isTableLoading: false,
    roles: [],
    countryCodes: [],
    first_name: null,
    last_name: null,
    email: null,
    phoneCountry: null,
    phone: null,
    selectedRole: [],
    isSubmitButtonDisabled: true,
    alertPopUp: false,
    success: false,
    warning: false,
    errorMessage: null
};

export default (state:IEmployeesReducer = initialState, action:IAction) => {
    switch (action.type) {
        case SET_EMPLOYEES_TABLE_DATA: {
            return {
                ...state,
                employeesTableData: action.payload
            }
        }

        case ADD_EMPLOYEES_TABLE_DATA: {
            return {
                ...state,
                employeesTableData: {
                    data: [...state.employeesTableData.data, ...action.payload.data],
                    meta: action.payload.meta
                }
            }
        }

        case SET_ROLES: {
            return {
                ...state,
                roles: action.payload
            }
        }

        case SET_COUNTRY_CODES: {
            return {
                ...state,
                countryCodes: action.payload
            }
        }

        case SET_FIRST_NAME: {
            return {
                ...state,
                first_name: action.payload
            }
        }

        case SET_LAST_NAME: {
            return {
                ...state,
                last_name: action.payload
            }
        }

        case SET_EMAIL: {
            return {
                ...state,
                email: action.payload
            }
        }

        case SET_PHONE_COUNTRY: {
            return {
                ...state,
                phoneCountry: action.payload
            }
        }

        case SET_PHONE: {
            return {
                ...state,
                phone: action.payload
            }
        }

        case SET_ROLE: {
            return {
                ...state,
                selectedRole: action.payload
            }
        }

        case SET_IS_EMPLOYEE_TABLE_LOADING_TRUE: {
            return {
                ...state,
                isTableLoading: true
            }
        }

        case SET_IS_EMPLOYEE_TABLE_LOADING_FALSE: {
            return {
                ...state,
                isTableLoading: false
            }
        }

        case RESET_EMPLOYEE_DETAILS: {
            return {
                ...state,
                first_name: null,
                last_name: null,
                email: null,
                phone: null,
                selectedRole: []
            }
        }

        case SET_SUBMIT_DISABLE: {
            return {
                ...state,
                isSubmitButtonDisabled: true
            }
        }

        case SET_SUBMIT_ENABLE: {
            return {
                ...state,
                isSubmitButtonDisabled: false
            }
        }

        case SET_SUCCESS_TRUE: {
            return {
                ...state,
                success: true
            }
        }

        case SET_WARNING_TRUE: {
            return {
                ...state,
                warning: true
            }
        }

        case SET_ERROR_MESSAGE: {
            return {
                ...state,
                errorMessage: action.payload
            }
        }

        case SET_SUCCESS_FALSE: {
            return {
                ...state,
                success: false
            }
        }

        case SET_WARNING_FALSE: {
            return {
                ...state,
                warning: false
            }
        }

        case SET_POPUP_TRUE: {
            return {
                ...state,
                alertPopUp: true
            }
        }

        case HIDE_ALERT_POPUP: {
            return {
                ...state,
                alertPopUp: false
            }
        }

        case DELETE_EMPLOYEE_RECORD: {
            let removeIndex = state.employeesTableData.data.map((item:any) => item.id ).indexOf(action.payload);
            state.employeesTableData.data.splice(removeIndex, 1)
            return state;
        }

        default:
            return state;
    }
};
