import axios from "../../util/Api";
import {
  // GET_PARTNER_EMPLOYEES,
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
export const getPartnerEmployees = (limit: number, page: number) => {
  return (dispatch: any) => {
    dispatch({ type: START_EMPLOYEE_LOADING });
    axios
      .get(`/employees?limit=${limit}&page=${page}`)
      .then((response) => {
        dispatch({ type: GET_EMPLOYEE_LIST, payload: response.data });
      })
      .catch(function(error) {
        if (!error.response) {
          dispatch({
            type: SET_EMPLOYEE_ERROR,
            payload:
              getCurrentLocale() === "en"
                ? "Network Error"
                : "Netwerk \n" + "Fout",
          });
        } else if (error.response.status === 403) {
          dispatch({
            type: SET_EMPLOYEE_ERROR,
            payload:
              getCurrentLocale() === "en" ? "Access denied" : "Geen Toegang",
          });
        } else {
          dispatch({
            type: SET_EMPLOYEE_ERROR,
            payload: "Something went wrong.",
          });
        }
      });
  };
};

/**
 * delete employee based on employeeId
 * @param employeeId
 * @returns {Function}
 */
export const deletePartnerEmployeeAction = (
  employeeId: number,
  callBack: (status, res) => void
) => {
  return (dispatch: any) => {
    axios
      .delete(`/employees/${employeeId}`)
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

export const notificationSettingPartnerEmployeeAction = (
  userId: number,
  status: boolean,
  callBack: (status, res) => void
) => {
  return (dispatch: any) => {
    axios
      .patch(`/employees/${userId}/notifications`, { status })
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

export const createPartnerEmployeeAction = (
  data: { email: string },
  callBack: (status: boolean, res) => void
) => {
  return () => {
    axios
      .post(`/employees`, data)
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

// export const getPartnerEmployees = (id: string) => {
//  return (dispatch: any) => {

//   axios.get(`/employees`)
//   .then((response) => {
//    response.data.data.map(a=>{
//     a.selected = false;
//     a.starred = false;
//    });
//    dispatch({type: GET_PARTNER_EMPLOYEES, payload: response.data.data});
//   })
//   .catch((error) => {
//    console.log(error.message)
//   })

//  }
// };
