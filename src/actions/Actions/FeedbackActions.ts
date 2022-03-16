import {
    GET_FEEDBACK,
    START_FEEDBACK_LOADING,
    SET_FEEDBACK_ERROR,
    FEEDBACK_ACTION_SUCCESS, STOP_FEEDBACK_LOADING
} from "../../constants/ActionTypes";
import axios from "../../util/Api";

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
export const getFeedBacks = (companyId: string, page: number, limit: number) => {
	return (dispatch: any) => {
		dispatch({type: START_FEEDBACK_LOADING});
		axios.get(`/service-points/${companyId}/feedback?limit=${limit}&page=${page}`)
			.then((response: any) => {
				dispatch({type: GET_FEEDBACK, payload: response.data});
			})
			.catch((error: any) => {
                dispatch({type: GET_FEEDBACK, payload: {data:[], meta:null}});
                if (!error.response) {
                    dispatch({type: SET_FEEDBACK_ERROR, payload: getCurrentLocale() === 'en' ? 'Network Error' : 'Netwerk \n' + 'Fout'});
                }else if (error.response.status === 403) {
                    dispatch({type: SET_FEEDBACK_ERROR, payload: getCurrentLocale() === 'en' ? 'Access denied' : 'Geen Toegang'});
                }else{
                    dispatch({type: SET_FEEDBACK_ERROR, payload: 'Something went wrong.'});
                }
			})
	}
};

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
const getCurrentLocale = () => {
    const data = localStorage.getItem('locale');
    if (data) {
        return JSON.parse(data && data).locale
    } else {
        return 'en';
    }
};
/**
 * Feedback action
 */
export const updateFeedbackAction = (feedbackId: string, actionType: string, callback: (response: string, status: number) => void) => {
	return (dispatch: any) => {
		if (actionType === 'accept') {
			axios.put(`/feedback-service/feedbacks/${feedbackId}/approve`)
				.then((response) => {
					if (response.status === 200 || response.status === 204) {
						dispatch({ type: FEEDBACK_ACTION_SUCCESS, payload: feedbackId })
						callback('success', 0)
					}
				})
				.catch((error: any) => {
					callback('danger', error.response.status)
				})
		} else if (actionType === 'reject') {
			axios.delete(`/feedback-service/feedbacks/${feedbackId}`)
				.then((response) => {
					if (response.status === 200 || response.status === 204) {
						dispatch({ type: FEEDBACK_ACTION_SUCCESS, payload: feedbackId })
						callback('success', 0)
					}
				})
				.catch((error: any) => {
					callback('danger', error.response.status)
				})
		} else if (actionType === 'recover') {
			axios.put(`/feedback-service/feedbacks/${feedbackId}/recover`)
				.then((response) => {
					if (response.status === 200) {
						dispatch({ type: FEEDBACK_ACTION_SUCCESS, payload: feedbackId })
						callback('success', 0)
					}
				})
				.catch((error: any) => {
					callback('danger', error.response.status)
				})
		}
	}
};


//----------------------------------------- Partner feedback start-------------------------------//

export const getPartnerFeedbackAction = (page: number, limit: number, search: string, ) => {
	return (dispatch: any) => {
		dispatch({type: START_FEEDBACK_LOADING});
		axios.get(`/reviews?limit=${limit}&page=${page}&query=${search}`)
			.then((response: any) => {
				dispatch({type: GET_FEEDBACK, payload: response.data});
			})
			.catch((error: any) => {
				if (error.response && error.response.status === 403) {
                    dispatch({type: SET_FEEDBACK_ERROR, payload: 'No Data Found.'});
					return;
				
                }
				dispatch({type: SET_FEEDBACK_ERROR, payload: 'Something went wrong.'});
			})
			.finally(() => {
				dispatch({type: STOP_FEEDBACK_LOADING});
			})
			
	}
}


export const getPartnerStatusAction = (callback: (response: string[]) => void) => {
	return (dispatch: any) => {
		axios.get(`/reviews/statuses`)
			.then((response: any) => {
				callback(response.data)
			})
			.catch((error: any) => {
				console.log(error.response)
			})
	}
}

export const updatePartnerFeedbackAction = (feedbackId: string, actionType: string, callback: (response: string, status: number) => void) => {
	return (dispatch: any) => {
		if (actionType === 'accept') {
			axios.put(`/reviews/${feedbackId}/approve`)
				.then((response) => {
					if (response.status === 200 || response.status === 204) {
						dispatch({ type: FEEDBACK_ACTION_SUCCESS, payload: feedbackId })
						callback('success', 0)
					}
				})
				.catch((error: any) => {
					callback('danger', error.response.status)
				})
		} else if (actionType === 'reject') {
			axios.delete(`/reviews/${feedbackId}`)
				.then((response) => {
					if (response.status === 200 || response.status === 204) {
						dispatch({ type: FEEDBACK_ACTION_SUCCESS, payload: feedbackId })
						callback('success', 0)
					}
				})
				.catch((error: any) => {
					callback('danger', error.response.status)
				})
		} else if (actionType === 'recover') {
			axios.put(`/reviews/${feedbackId}/recover`)
				.then((response) => {
					if (response.status === 200) {
						dispatch({ type: FEEDBACK_ACTION_SUCCESS, payload: feedbackId })
						callback('success', 0)
					}
				})
				.catch((error: any) => {
					callback('danger', error.response.status)
				})
		}
	}
};

//----------------------------------------- Partner feedback end---------------------------------//
