import {
    GET_FEEDBACK,
    START_FEEDBACK_LOADING,
    SET_FEEDBACK_ERROR,
    FEEDBACK_ACTION_SUCCESS,
	STOP_FEEDBACK_LOADING,

	GET_REPORT,
	START_REPORT_LOADING,
	SET_REPORT_ERROR,
} from "../../constants/ActionTypes";
import axios from "../../util/Api";

export const getOpenQuotes = (page: number, limit: number) => {
	return (dispatch: any) => {
		dispatch({type: START_REPORT_LOADING});
		axios.get(`/analytics/orders/open-quotes?limit=${limit}&page=${page}`)
			.then((response: any) => {
				dispatch({type: GET_REPORT, payload: response.data})
			})
			.catch((error: any) => {
				dispatch({type: SET_REPORT_ERROR, payload: "Something went wrong."})
			})
	}
}

export const downloadOpenQuotes = (callback: (status: boolean, response: any) => void) => {
	return (dispatch: any) => {
		axios.get('/analytics/orders/open-quotes?download=1')
		.then((response: any) => {
			callback(true, response.data);
		})
		.catch((error: any) => {
			callback(false, {message: "Something went wrong."})
		})
	}
}

export const getAssignedOrders = (page: number, limit: number) => {
	return (dispatch: any) => {
		dispatch({type: START_REPORT_LOADING});
		axios.get(`/analytics/orders/assigned-orders?limit=${limit}&page=${page}`)
			.then((response: any) => {
				dispatch({type: GET_REPORT, payload: response.data})
			})
			.catch((error: any) => {
				dispatch({type: SET_REPORT_ERROR, payload: "Something went wrong."})
			})
	}
}

export const downloadAssignedOrders = (callback: (status: boolean, response: any) => void) => {
	return (dispatch: any) => {
		axios.get('/analytics/orders/assigned-orders?download=1')
		.then((response: any) => {
			callback(true, response.data);
		})
		.catch((error: any) => {
			callback(false, {message: "Something went wrong."})
		})
	}
}

export const getCanceledOrders = (page: number, limit: number) => {
	return (dispatch: any) => {
		dispatch({type: START_REPORT_LOADING});
		axios.get(`/analytics/orders/canceled-orders?limit=${limit}&page=${page}`)
			.then((response: any) => {
				dispatch({type: GET_REPORT, payload: response.data})
			})
			.catch((error: any) => {
				dispatch({type: SET_REPORT_ERROR, payload: "Something went wrong."})
			})
	}
}

export const downloadCanceledOrders = (callback: (status: boolean, response: any) => void) => {
	return (dispatch: any) => {
		axios.get('/analytics/orders/canceled-orders?download=1')
		.then((response: any) => {
			callback(true, response.data);
		})
		.catch((error: any) => {
			callback(false, {message: "Something went wrong."})
		})
	}
}

export const getFeedbackAction = (page: number, limit: number, status: string, search: string, sort: string) => {
	return (dispatch: any) => {
		dispatch({type: START_FEEDBACK_LOADING});
		axios.get(`/feedback-service/feedbacks?limit=${limit}&page=${page}&status=${status}&query=${search}&data=${sort}`)
			.then((response: any) => {
				dispatch({type: GET_FEEDBACK, payload: response.data});
			})
			.catch((error: any) => {
				dispatch({type: SET_FEEDBACK_ERROR, payload: 'Something went wrong.'});
			})
	}
}


export const getStatusAction = (callback: (response: string[]) => void) => {
	return (dispatch: any) => {
		axios.get(`/feedback-service/feedbacks/statuses`)
			.then((response: any) => {
				callback(response.data)
			})
			.catch((error: any) => {
				console.log(error.response)
			})
	}
}

export const updateOpenQuoteAction = (feedbackId: string, actionType: string, callback: (response: string, status: number) => void) => {
	
}

export const updateAssignedOrderAction = (feedbackId: string, actionType: string, callback: (response: string, status: number) => void) => {
	
}

export const updateCanceledOrderAction = (feedbackId: string, actionType: string, callback: (response: string, status: number) => void) => {
	
}