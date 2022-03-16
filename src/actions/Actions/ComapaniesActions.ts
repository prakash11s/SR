import axios from "../../util/Api";
import {
    GET_COMPANY_DETAILS,
    GET_QUEUE_ENTRIES,
    SEARCH_QUEUE_ENTRIES,
    CLEAR_DATA,
    GET_SUBSCRIPTION_LIST,
    START_SUBSCRIPTION_LOADING,
    STOP_SUBSCRIPTION_LOADING,
    SET_SUBSCRIPTION_ERROR,
    CLEAR_COMPANY_DATA,
    START_LOADING,
    GET_QUEUE_ENTRIES_ERROR,
    SEARCH_QUEUE_ENTRIES_ERROR,
    START_INVOICE_LOADING,
    GET_INVOICE_LIST,
    SET_INVOICE_ERROR,
    STOP_INVOICE_LOADING,
	GET_INVOICE_META
} from "../../constants/ActionTypes";

export const getCompanyDetails = (companyId: number | string, history, callBack: (msg: string) => void) => {
	return (dispatch: any) => {
		axios.get(`/service-points/${companyId}`)
			.then((response) => {
				dispatch({type: GET_COMPANY_DETAILS, payload: response.data.data});
			}).catch((error) => {
			if (error.response && error.response.status === 404) {
				callBack(error.response?.data.message)
				//history.push('/support/companies/error/404');
			} else {
				callBack(error.response?.data.message)
			}
		});
	}
};

export const clearCompanyData = () => {
	return (dispatch: any) => {
		dispatch({type: CLEAR_COMPANY_DATA});
	}
};

export const getQueueEntries = (limit: number, page: number, addData?:boolean, deleted?:boolean) => {
	return (dispatch: any) => {
		dispatch({type: START_LOADING});
		axios.get(`/service-points?limit=${limit}&page=${page}${deleted ? "&deleted=true" : "" }`)
			.then((response) => {
				dispatch({type: GET_QUEUE_ENTRIES, payload: {data: response.data , addData}});
			})
			.catch((error: any) => {
				dispatch({type: GET_QUEUE_ENTRIES_ERROR, payload: error.response.data.message});
			})
	}
};

export const createRecognition = (servicePoint: string, recognitionId: number, data: {valid_until: string}, callBack:(response: string, msg: string) => void) => {
	return (dispatch: any) => {
		dispatch({type: START_LOADING});
		axios.post(`service-points/${servicePoint}/recognitions/${recognitionId}`, data)
			.then((response) => {
				callBack('success', response.data)
			})
			.catch((error: any) => {
				console.log("err",error)
				callBack('danger', error.response.data.message)
			})
	}
};

export const updateRecognition = (servicePoint: string, recognitionId: number, data: {valid_until: string}, callBack:(response: string, msg: string) => void) => {
	return (dispatch: any) => {
		dispatch({type: START_LOADING});
		axios.put(`service-points/${servicePoint}/recognitions/${recognitionId}`, data)
			.then((response) => {
				callBack('success', response.data)
			})
			.catch((error: any) => {
				console.log("err",error)
				callBack('danger', error.response.data.message)
			})
	}
};

export const deleteRecognition = (servicePoint: string, recognitionId: number, callBack:(response: string, msg: string) => void) => {
	return (dispatch: any) => {
		dispatch({type: START_LOADING});
		axios.delete(`service-points/${servicePoint}/recognitions/${recognitionId}`)
			.then((response) => {
				callBack('success','')
				// dispatch({type: DELETE_RECOGNITION, payload: response.data});
			})
			.catch((error: any) => {
				console.log("err",error)
				callBack('danger',error.response.data.message)
				// dispatch({type: DELETE_RECOGNITION, payload: error.response.data.message});
			})
	}
};

export const sendBacklikedServicePoint = (servicePointId: string, callBack: (response: string, msg: string) => void) => {
	return (dispatch: any) => {
		dispatch({ type: START_LOADING });
		axios.put(`service-points/${servicePointId}/send-recognition-backlink`)
			.then((response) => {
				callBack('success', '')
			})
			.catch((error: any) => {
				console.log("err", error)
				callBack('danger', error.response ? error.response.data.message: "Something went wrong")
			})
	}
};

export const deleteServicePoint = (servicePointId: string, callBack: (response: string, msg: string) => void) => {
	return (dispatch: any) => {
		dispatch({ type: START_LOADING });
		axios.delete(`service-points/${servicePointId}`)
			.then((response) => {
				callBack('success', '')
			})
			.catch((error: any) => {
				console.log("err", error)
				callBack('danger', error.response.data.message)
			})
	}
};

export const getSearchData = (limit: number, page: number, searchData: string, addData?:boolean, deleted?:boolean) => {
	return (dispatch: any) => {
		!addData && dispatch({type: CLEAR_DATA});
		dispatch({type: START_LOADING});
		axios.get(`/service-points?query=${searchData}&limit=${limit}&page=${page}${deleted ? "&deleted=true" : "" }`)
			.then((response) => {
				if (response.data.data.length > 0) {
					dispatch({type: SEARCH_QUEUE_ENTRIES, payload: {...response.data, addData}});
				} else {
					dispatch({type: SEARCH_QUEUE_ENTRIES_ERROR, payload: 'No Data Found'});
				}
			})
			.catch((error: any) => {
				dispatch({type: SEARCH_QUEUE_ENTRIES_ERROR, payload: error.response.data.message});
			})
	}
};

export const clearReducerData = () => {
	return (dispatch: any) => {
		dispatch({type: CLEAR_DATA});
	}
}

export const toggleLoader = () => {
	return (dispatch: any) => {
		dispatch({type: START_LOADING});
	}
};

/**
 * get subscription list
 */
export const getSubscription = (id: string, page: number, limit: number) => {
	return (dispatch: any) => {
		dispatch({type: START_SUBSCRIPTION_LOADING});
		axios.get(`/service-points/${id}/subscriptions?page=${page}&limit=${limit}`)
			.then(response => {
				dispatch({type: GET_SUBSCRIPTION_LIST, payload: response.data})
			})
			.catch((error: any) => {
                if (!error.response) {
                    dispatch({
                        type: SET_SUBSCRIPTION_ERROR,
                        payload: getCurrentLocale() === 'en' ? 'Network Error' : 'Netwerk \n' + 'Fout'
                    })
                }else if (error.response.status === 403) {
                    dispatch({
                        type: SET_SUBSCRIPTION_ERROR,
                        payload: getCurrentLocale() === 'en' ? 'Access denied' : 'Geen Toegang'
                    })
                }else{
                    dispatch({
                        type: SET_SUBSCRIPTION_ERROR,
                        payload: error.response.data.message
                    })
                }
            })
			.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}

};

/**
 * get invoices list
 */
export const getInvoices = (id: string, page: number, limit: number, data: any = null) => {
	return (dispatch: any) => {
		dispatch({type: START_INVOICE_LOADING});
		axios.get(`/service-points/${id}/invoices?page=${page}&limit=${limit}${data ? `&data=${data}` : ""}`)
			.then(response => {
				dispatch({type: GET_INVOICE_META, payload: response.data.meta});
				dispatch({type: GET_INVOICE_LIST, payload: response.data.data});
			})
			.catch((error: any) => {
                if (!error.response) {
                    dispatch({
                        type: SET_INVOICE_ERROR,
                        payload: getCurrentLocale() === 'en' ? 'Network Error' : 'Netwerk \n' + 'Fout'
                    })
                }else if (error.response.status === 403) {
                    dispatch({
                        type: SET_INVOICE_ERROR,
                        payload: getCurrentLocale() === 'en' ? 'Access denied' : 'Geen Toegang'
                    })
                }else{
                    dispatch({
                        type: SET_INVOICE_ERROR,
                        payload: error.response.data.message
                    })
                }
			})
			.finally(() => dispatch({type: STOP_INVOICE_LOADING}))
	}
};

/**
 * get invoices list
 */
export const getInvoiceById = (id: string, invoiceId:string, callback: (status, res) => void) => {
	return () => {
		axios.get(`/service-points/${id}/invoices/${invoiceId}`)
			.then(response => {
				callback(true, response.data.data);
			})
			.catch((error: any) => {
				callback(false,error.response ? error.response.data.message : "Something went wrong.");
			})
	}
};

export const resumeInvoice = (servicePoint, invoiceId, callBack:any) => {
	return (dispatch: any) => {
		axios.put(`/invoices/${invoiceId}/resume?service_point_id=${servicePoint}`)
			.then(response => {
				callBack("success", response.data)
			})
			.catch((error: any) => {
				callBack("danger", error.response ? error.response.data.message : "Something went wrong.")
			})
	}
};

export const pauseInvoice = (servicePoint, invoiceId, callBack:any) => {
	return (dispatch: any) => {
		axios.put(`/invoices/${invoiceId}/pause?service_point_id=${servicePoint}`)
			.then(response => {
				callBack("success", response.data)
			})
			.catch((error: any) => {
				callBack("danger", error.response ? error.response.data.message : "Something went wrong.")
			})
	}
};

export const downloadInvoice = (servicePoint, invoiceId, callBack:any) => {
	return (dispatch: any) => {
		axios.get(`/service-points/${servicePoint}/invoices/${invoiceId}/download`)
			.then(response => {
				callBack(true, response.data)
			})
			.catch((error: any) => {
				callBack(false, error.response ? error.response.data.message : "Something went wrong.")
			})
	}
};

export const getBackAccountsList = (page: number, limit: number, id: string, callback: (status, res) => void) => {
	return () => {
		axios.get(`/service-points/${id}/payout-methods?limit=${limit}&page=${page}`)
			.then(response => {
				callback(true, response.data);
			})
			.catch((error: any) => {
				callback(false,error.response ? error.response.data.message : "Something went wrong.");
			})
	}
};

const getCurrentLocale = () => {
	const data = localStorage.getItem('locale');
	if (data) {
		return JSON.parse(data && data).locale
	} else {
		return 'en';
	}
};

/**
 * cancel subscription
 */
export const cancelSubscriptionPlan = (servicePoint, subscriptionId, callBack:any) => {
	return (dispatch: any) => {
		axios.patch(`/service-points/${servicePoint}/subscriptions/${subscriptionId}/cancel`)
			.then(response => {
				callBack(true, response.data)
			})
			.catch((error: any) => {
				console.log("error",error)
				callBack(false,error.response ? error.response.data.message : "Something went wrong.")
			})
			.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}
};

/**
 * delete subscription
 */
 export const deleteSubscriptionPlan = (servicePoint, subscriptionId, callBack:any) => {
	return (dispatch: any) => {
		axios.delete(`/service-points/${servicePoint}/subscriptions/${subscriptionId}`)
			.then(response => {
				callBack(true, response.data)
			})
			.catch((error: any) => {
				console.log("error",error)
				callBack(false, error.response ? error.response.data.message : "Something went wrong.")
			})
			.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}
};

/**
 * get subscription list
 */
export const getSubscriptionPlans = (callBack:any) => {
	return (dispatch: any) => {
		axios.get(`/subscriptions/plans`)
			.then(response => {
				callBack(true,response.data)
			})
			.catch((error: any) => {
				console.log("error",error)
				callBack(false,error.response ? error.response.data.message : "Something went wrong.")
			})
			.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}
};

export const getSubscriptionPlanDetail = (id:any,callBack:any) => {
	return (dispatch: any) => {
		axios.get(`/subscriptions/plans/${id}/items`)
			.then(response => {
				callBack(true,response.data)
			})
			.catch((error: any) => {
				console.log("error",error)
                callBack(false, error.response ? error.response.data.message : "Something went wrong.")
			})
			.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}

};

export const createSubscription = (data:any, callBack:any, isExtend?: boolean) => {

	return (dispatch: any) => {
		const payloadData: any = {
			plan_id:data.planId,
			period_start:data.period_start,
			period_end:data.period_end,
			discount:data.discount
		}
	
		if(isExtend) {
			payloadData.extension_of = data.extension_of
		}

		axios.post(`/service-points/${data.id}/subscriptions`,payloadData)
			.then(response => {
				callBack(true,response.data)
			})
			.catch((error: any) => {
                callBack(false,error?.response ? error?.response?.data : "Something went wrong.")
			})
			.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}

};

export const getStatistiscsSubscriptionPlanDetail = (servicePointId: string, subscriptionId: string,callBack:any) => {
	return (dispatch: any) => {
		axios.get(`/service-points/${servicePointId}/subscriptions/${subscriptionId}`)
			.then(response => {
				callBack(true,response.data)
			})
			.catch((error: any) => {
				callBack(false,error.data ? error.data.message : "Something went wrong.")
			})
			.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}

};

export const getStatistiscsAllData = (servicePointId: string,callBack:any) => {
	return (dispatch: any) => {
		axios.get(`/service-points/${servicePointId}/statistics/orders`)
			.then(response => {
				callBack(true,response.data)
			})
			.catch((error: any) => {
				callBack(false,error.data ? error.data.message : "Something went wrong.")
			})
			.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}

};

export const setSalesNotes = (servicePointId: string, data: {sales_notes: string}, callBack: any) => {
	return (dispatch: any) => {
		axios.patch(`/service-points/${servicePointId}/salesnotes`, data)
		.then(response => {
			callBack(true, response.data);
		})
		.catch((error: any) => {
			callBack(false,error.data ? error.data.message : "Something went wrong.");
		})
		.finally(() => dispatch({type: STOP_SUBSCRIPTION_LOADING}))
	}
}

export const recoverServicePoint = (servicePointId: string, callBack: any) => {
	return () => {
		axios.patch(`/service-points/${servicePointId}/recover`)
		.then(response => {
			callBack("success", response.data);
		})
		.catch((error: any) => {
			callBack("danget", error.data ? error.data.message : "Something went wrong.");
		})
	}
}
