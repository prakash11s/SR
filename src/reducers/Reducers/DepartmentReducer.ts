import {
  DEPARTMENT_DATA,
  SELECTED_DEPARTMENT,
  DEPARTMENT_ERROR,
} from "../../constants/ActionTypes";
import {
  IDepartmentList,
  IDepartmentReducer,
} from "../Interface/DepartmentReducerInterface";
import { IAction } from "../Interface/ActionInterface";

const initialState: IDepartmentReducer = {
  departmentsList: [],
  selectedDepartment: undefined,
  error: "",
};

export default (
  state: IDepartmentReducer = initialState,
  { type, payload }: IAction
) => {
  switch (type) {
    case DEPARTMENT_DATA:
      return { ...state, departmentsList: payload };
    case SELECTED_DEPARTMENT:
      return {
        ...state,
        selectedDepartment: state.departmentsList.find(
          (list: IDepartmentList) => list.slug === payload
        ),
      };
    case DEPARTMENT_ERROR:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};
