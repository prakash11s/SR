import axios from "util/Api";
import {
  GET_DASHBOARD_ORDER,
  START_DASHBOARD_LOADING,
} from "../../constants/ActionTypes";
import { IDashboardOrder } from "../../reducers/Interface/DashboardReducerInterface";

export function startLoading() {
  return {
    type: START_DASHBOARD_LOADING,
  };
}

export function getDashboardOrder(data: IDashboardOrder[]) {
  return {
    type: GET_DASHBOARD_ORDER,
    payload: data,
  };
}

export const getDebts = (callBack: (status, res) => void) => {
  return () => {
    axios
      .get("/invoices/has-debts")
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
