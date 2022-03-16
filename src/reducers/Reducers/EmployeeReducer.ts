import {
  GET_EMPLOYEE_LIST,
  START_EMPLOYEE_LOADING,
  SET_EMPLOYEE_ERROR,
} from "../../constants/ActionTypes";
import { IEmployeeReducer } from "../Interface/EmployeeReducerInterface";
import { IAction } from "../Interface/ActionInterface";

const initialState: IEmployeeReducer = {
  employee: [],
  loading: false,
  error: "",
};

export default (
  state: IEmployeeReducer = initialState,
  { type, payload }: IAction
) => {
  switch (type) {
    case START_EMPLOYEE_LOADING:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case GET_EMPLOYEE_LIST:
      return {
        ...state,
        employee: payload.data,
        meta: payload.meta,
        loading: false,
        error: "",
      };
    case SET_EMPLOYEE_ERROR:
      return {
        ...state,
        employee: [],
        meta: [],
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};
