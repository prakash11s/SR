import axios from "../../util/Api";
import {
	GET_SERVICE_CATEGORIES, 
	GET_SERVICE_PRICE_DRIVER,
	GET_SERVICES_LIST, 
	RESET_SERVICE_ERROR,
	SET_SERVICES_ERROR,
	START_SERVICES_LOADING
} from "../../constants/ActionTypes";
import {IServicesPayload} from "../../components/ServicesList/ServicesCreate/Interface/ServicesCreateInterface";
import * as H from 'history';

/**
 * get services list action
 */
export const getServicesAction = () => {
	return (dispatch: any) => {
		dispatch({type: START_SERVICES_LOADING});
		axios.get(`/services`)
			.then((response) => {
				dispatch({type: GET_SERVICES_LIST, payload: response.data.data})
			})
			.catch((error: any) => {
				console.log(error);
				dispatch({type: SET_SERVICES_ERROR, payload: 'Something Went Wrong'})
			})
	}
};

export const getServices = (id, page, limit, callBack) => {
  return (dispatch: any) => {
    axios
      .get(`/service-points/${id}/services`)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const enableService = (id, data, callBack) => {
  return (dispatch: any) => {
    axios
      .post(`/service-points/${id}/services`, data)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const updateService = (servicePointId, id, data, callBack) => {
  return (dispatch: any) => {
    axios
      .put(`/service-points/${servicePointId}/services/${id}`, data)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data : "Something went wrong."
        );
      });
  };
};

export const updateServiceComment = (servicePointId, id, data, callBack) => {
  return (dispatch: any) => {
    axios
      .put(`/service-points/${servicePointId}/services/${id}/comment`, data)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data : "Something went wrong."
        );
      });
  };
};

/**
 * get service categories list action
 */
export const getServiceCategories = () => {
	return (dispatch: any) => {
		dispatch({type: START_SERVICES_LOADING});
		axios.get(`/service-points/types`)
			.then((response) => {
				dispatch({type: GET_SERVICE_CATEGORIES, payload: response.data.data})
			})
			.catch((error: any) => {
				console.log(error);
				dispatch({type: SET_SERVICES_ERROR, payload: 'Something Went Wrong'})
			})
	}
};

/**
 * get service price drive list action
 */
export const getServicePriceDrive = () => {
	return (dispatch: any) => {
		dispatch({type: START_SERVICES_LOADING});
		axios.get(`/services/configuration/price-drivers`)
			.then((response) => {
				dispatch({type: GET_SERVICE_PRICE_DRIVER, payload: response.data})
			})
			.catch((error: any) => {
				console.log(error);
				dispatch({type: SET_SERVICES_ERROR, payload: 'Something Went Wrong'})
			})
	}
};

/**
 * get service price drive list action
 */
export const submitServiceAction = (payload: IServicesPayload, history: H.History) => {
	return (dispatch: any) => {
		dispatch({type: START_SERVICES_LOADING});
		axios.post(`/services`, payload)
			.then((response) => {
				console.log(response)
				history.goBack();
			})
			.catch((error: any) => {
				console.log(error.response.data.message);
				dispatch({type: SET_SERVICES_ERROR, payload: error.response.data.message})
			})
	}
};

export const resetServiceLoadingError = () => {
	return (dispatch: any) => {
		dispatch({type: RESET_SERVICE_ERROR});
	}
};