import axios from "../../util/Api";
import {
  GET_EMPLOYEE_LIST,
  SET_EMPLOYEE_ERROR,
  START_EMPLOYEE_LOADING,
} from "../../constants/ActionTypes";

const getCurrentLocale = () => {
  const data = localStorage.getItem("locale");
  if (data) {
    return JSON.parse(data && data).locale;
  } else {
    return "en";
  }
};

/**
 * get employee list
 * @returns {Function}
 */
export const getEmployeeList = (
  companyId: string,
  limit: number,
  page: number,
  callBack?: (status: boolean, response: any) => void, 
) => {
  return (dispatch: any) => {
    dispatch({ type: START_EMPLOYEE_LOADING });
    axios
      .get(`/service-points/${companyId}/employees?limit=${limit}&page=${page}`)
      .then((response) => {
        if (callBack) callBack(true, response.data.data);
        dispatch({ type: GET_EMPLOYEE_LIST, payload: response.data });
      })
      .catch(function(error) {
        if (!error.response) {
          let err = getCurrentLocale() === "en"
          ? "Network Error"
          : "Netwerk \n" + "Fout"
          if (callBack) callBack(true, err);
          dispatch({
            type: SET_EMPLOYEE_ERROR,
            payload: err,
          });
        } else if (error.response.status === 403) {
          let err = getCurrentLocale() === "en" ? "Access denied" : "Geen Toegang";
          if (callBack) callBack(true, err);
          dispatch({
            type: SET_EMPLOYEE_ERROR,
            payload: err,
          });
        } else {
          if (callBack) callBack(true, "Something went wrong.");
          dispatch({
            type: SET_EMPLOYEE_ERROR,
            payload: "Something went wrong.",
          });
        }
      });
  };
};

/**
 * Create new employee
 * @param companyId
 * @returns {Function}
 */
export const createEmployeeAction = (
  companyId: string,
  data: { email: string },
  callBack: (status: boolean, res) => void
) => {
  return () => {
    axios
      .post(`/service-points/${companyId}/employees`, data)
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

/**
 * delete employee based on employeeId
 * @param employeeId
 * @returns {Function}
 */
export const deleteEmployeeAction = (
  companyId: string,
  employeeId: number,
  callBack: (status, res) => void
) => {
  return (dispatch: any) => {
    axios
      .delete(`/service-points/${companyId}/employees/${employeeId}`)
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const employeeNotificationSettingsAction = (
  companyId: string,
  userId: number,
  status: boolean,
  callBack: (status, res) => void
) => {
  return (dispatch: any) => {
    axios
      .patch(`/service-points/${companyId}/employees/${userId}/notifications`, {
        status,
      })
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};
