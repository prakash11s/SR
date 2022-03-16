import axios from "../../util/Api";

import { DEPARTMENT_DATA, SELECTED_DEPARTMENT, DEPARTMENT_ERROR } from "constants/ActionTypes";
import { SYSTEM_DEPARTMENTS } from "../../constants/apiEndpoints";
import { getUser } from "./Auth";
import { IAddSelectedDepartment } from "../Interface/DepartmentActionInterface";

const getCurrentLocale = () => {
  const data = localStorage.getItem("locale");
  if (data) {
    return JSON.parse(data && data).locale;
  } else {
    return "en";
  }
};

export const setDepartments = (payload: []) => ({
  type: DEPARTMENT_DATA,
  payload,
});

export const addSelectedDepartment = (payload: IAddSelectedDepartment) => {
  return (dispatch: any) => {
    if (payload.slug != null) {
      localStorage.setItem("department", payload.slug);
    }
    dispatch({
      type: SELECTED_DEPARTMENT,
      payload: payload.slug,
    });
    dispatch(getUser());
  };
};

export const setSelectedDepartment = () => {
  return (dispatch: any) => {
    const departmentName = localStorage.getItem("department");
    if (departmentName) {
      dispatch({
        type: SELECTED_DEPARTMENT,
        payload: departmentName,
      });
    }
  };
};

export const setDepartmentStartAsync = () => {
  return (dispatch: any) => {
    axios
      .get(SYSTEM_DEPARTMENTS)
      .then((response) => {
        const defaultDepartment = response.data.data[0].slug;
        !localStorage.getItem("department") &&
          localStorage.setItem("department", defaultDepartment);
        dispatch(setDepartments(response.data.data));
        dispatch(setSelectedDepartment());
      })
      .catch((error) => {
        // TODO: Handle error in a nicer way
        console.log(error);
      });
  };
};

export const setPartnerDepartmentStartAsync = () => {
  return (dispatch: any) => {
    axios
      .get("/departments")
      .then((response) => {
        const defaultDepartment = response.data.data[0].slug;
        !localStorage.getItem("department") &&
          localStorage.setItem("department", defaultDepartment);
        dispatch(setDepartments(response.data.data));
        dispatch(setSelectedDepartment());
      })
      .catch((error) => {
        dispatch({
          type: DEPARTMENT_ERROR, 
          payload: getCurrentLocale() === "en" ? "We are sorry, but you do not have access to this service." : "Het spijt ons, maar u heeft geen toegang tot deze dienst."
        })
      });
  };
};
