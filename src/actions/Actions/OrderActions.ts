import axios from "../../util/Api";
import {
	GET_ORDER_OVERVIEW,
	CANCEL_ORDER,
	CANCEL_ORDER_FAIL,
	CLEAR_CANCEL_ORDER,
	GET_SERVICE,
	GET_SERVICE_FAIL,
	SET_SELECTED_SERVICE,
	SUBMIT_ORDER_SUCCESS,
	SET_SERVICE_PRICE,
	SET_ORDER_DETAIL,
	SET_COURIER_TYPE,
	SET_SERVICE_DATA,
	SUBMIT_ORDER_FAIL,
	GET_AUTOCOMPLETE_DATA_SUCCESS,
	GET_AUTOCOMPLETE_DATA_FAIL,
	RESET_AUTOCOMPLETE_DATA,
	SET_DIMENSION_DATA,
	SET_SELECTED_COURIER_VEHICLE,
	GET_COURIER_VEHICLELIST,
	SET_SELECTED_SHIPMENT,
	GET_PAYMENT_OPTION,
	GET_DELIVERY_OPTION,
	UPDATE_ORDER_SUCCESS,
	UPDATE_ORDER_FAIL,
	GET_NEARBY_SERVICE_POINT,
	CLEAR_ORDER_OVERVIEW,
	UPDATE_SERVICE,
	GET_SERVICE_POINT_DETAILS,
	GET_ORDER_LIST,
	GET_SERVICE_POINT_DISSOCIATION_REASON_SUCCESS,
	GET_SERVICE_POINT_DISSOCIATION_REASON_REQUEST,
	GET_SERVICE_POINT_DISSOCIATION_REASON_ERROR,
	GET_PREFERRED_DATES,
	UPDATE_PREFERRED_DATE,
	DELETE_PREFERRED_DATE_REQUEST,
	DELETE_PREFERRED_DATE_SUCCESS,
	DELETE_PREFERRED_DATE_ERROR,
	CREATE_PREFERRED_DATE,
	SET_SERVICE_POINT_DISSOCIATION_SUCCESS,
	SET_SERVICE_POINT_DISSOCIATION_REQUEST,
	SET_SERVICE_POINT_DISSOCIATION_ERROR, SET_INVOICE_ERROR,
	UPDATE_SERVICE_PRICE, SET_CUSTOM_DESCRIPTION
} from "../../constants/ActionTypes";
import { ICreatePreferredDate } from "reducers/Interface/OrderInterface";

/**
 * Get order overview action
 * @returns {Function}
 */
export const getOrderOverView = (orderId: string, callBack: (msg: string) => void) => {
	return (dispatch: any) => {
		axios.get(`/orders/${orderId}`).then((response) => {
			callBack('')
			dispatch({ type: GET_ORDER_OVERVIEW, payload: response.data });
		}).catch((error: any) => {
			callBack(error.response && error.response.data.message || 'Something went wrong');
		});
	}
};

export const getOrderPreferredDates = (orderId: string, callBack: (msg: string) => void) => {
	callBack('');
	return (dispatch: any) => {
		axios.get(`/orders/${orderId}/preferred-dates`)
			.then((response) => {
				callBack('success');
				dispatch({ type: GET_PREFERRED_DATES, payload: response.data });
			}).catch(function (error) {
				callBack(error.response.data.message);
			});
	}
};

export const getOrderComments = (orderId: string, callBack: (status: boolean,data: any) => void) => {
	return (dispatch: any) => {
		axios.get(`/orders/${orderId}/comments`)
			.then((response) => {
				callBack(true, response.data);
			}).catch(function (error) {
				callBack(false, error.response.data.message);
			});
	}
};

export const getOrderPayments = (orderId: string, callBack: (status: boolean, data: any) => void) => {
	return () => {
		axios.get(`/orders/${orderId}/payments`)
			.then((response) => {
				callBack(true, response.data);
			}).catch(function (error) {
				callBack(false, error.response ? error.response.data.message : "Something went wrong.");
			});
	}
};

export const getOrderRejections = (orderId: string, callBack: (status: boolean, data: any) => void) => {
	return () => {
		axios.get(`/orders/${orderId}/rejections`)
			.then((response) => {
				callBack(true, response.data);
				// dispatch({ type: GET_PREFERRED_DATES, payload: response.data });
			}).catch(function (error) {
				callBack(false, error.response ? error.response.data.message : "Something went wrong.");
			});
	}
};

export const createNewRejection = (orderId: string, data: any, callBack: (status: string, data: string) => void) => {
	return () => {
		axios.put(`/orders/${orderId}/rejections`, data)
			.then((response) => {
				callBack('success', '');
			}).catch(function (error) {
				callBack('danger', error.response ? error.response.data.message : "Something went wrong.");
			});
	}
};

export const createPreferredDate = (orderId: string, data: ICreatePreferredDate, callBack: (msg: string) => void) => {
	callBack('');
	return (dispatch: any) => {
		axios.post(`/orders/${orderId}/preferred-dates`, data)
			.then((response) => {
				callBack('success');
				dispatch({ type: CREATE_PREFERRED_DATE, payload: response.data });
			}).catch(function (error) {
				callBack(error.response.data.message);
			});
	}
}

export const updatePreferredDate = (orderId: string, preferredDateId: number, data: ICreatePreferredDate, callBack: (msg: string) => void) => {
	return (dispatch: any, useState: any) => {
		const state = useState();
		const preferredDates = state.orderState.preferredDates.slice();
		axios.patch(`/orders/${orderId}/preferred-dates/${preferredDateId}`, data)
			.then((response) => {
				callBack('success');
				const dateToBeUpdated = preferredDates.find(date => date.id === preferredDateId)
				const dateIndex = preferredDates.indexOf(dateToBeUpdated);
				preferredDates[dateIndex] = response.data.data;
				dispatch({ type: UPDATE_PREFERRED_DATE, payload: preferredDates });
			}).catch(function (error) {
				callBack(error.response.data.message);
			});
	}
}

export const deletePreferredDate = (orderId: string, preferredDateId: number, callBack: (msg: string) => void) => {
	return (dispatch: any) => {
		dispatch({ type: DELETE_PREFERRED_DATE_REQUEST });
		axios.delete(`/orders/${orderId}/preferred-dates/${preferredDateId}`)
			.then((response) => {
				callBack('success');
				dispatch({ type: DELETE_PREFERRED_DATE_SUCCESS, payload: { preferredDateId } });
			}).catch(function (error) {
				dispatch({ type: DELETE_PREFERRED_DATE_ERROR });
				callBack(error.response.data.message);
			});
	}
}

export const getServicePointDetails = (servicePointId: string, callBack: (msg: string) => void) => {
	return (dispatch: any) => {
		axios.get(`service-points/${servicePointId}`).then((response) => {
			callBack('');
			dispatch({ type: GET_SERVICE_POINT_DETAILS, payload: response.data });
		}).catch((error: any) => {
			callBack(error.response.data.message)
		});
	}
};

export const getServicePointDissociationReason = (type: string) => {
	return (dispatch: any) => {
		dispatch({ type: GET_SERVICE_POINT_DISSOCIATION_REASON_REQUEST });
		axios.get(`/statuses?type=${type}`).then((response) => {
			dispatch({ type: GET_SERVICE_POINT_DISSOCIATION_REASON_SUCCESS, payload: response.data });
		}).catch((error: any) => {
			dispatch({ type: GET_SERVICE_POINT_DISSOCIATION_REASON_ERROR, payload: error.response.data.message });
		});
	}
};

export const requestServicePointDissociationReason = (orderId: string, data: any, callBack: (msg: string) => void) => {
	return (dispatch: any) => {
		callBack('');
		dispatch({ type: SET_SERVICE_POINT_DISSOCIATION_REQUEST });
		axios.put(`/orders/${orderId}/dissociate-service-point`, data).then((response) => {
			callBack('dissociation_success');
			dispatch({ type: SET_SERVICE_POINT_DISSOCIATION_SUCCESS });
		}).catch((error: any) => {
			callBack(error.response.data.message)
			dispatch({ type: SET_SERVICE_POINT_DISSOCIATION_ERROR, payload: error.response.data.message });
		});
	}
};

export const clearOrderOverview = () => {
	return (dispatch: any) => {
		dispatch({ type: CLEAR_ORDER_OVERVIEW });
	}
};

export const getNearByServicePointAction = (orderId: string, selectedDistance: string, selectedLimit: any, selectedPlans: any, activeSubscriptions: boolean, callBack: (type: string, msg: string) => void) => {
	return (dispatch: any) => {
		callBack('loading', '');
		axios.get(`/orders/${orderId}/search-available-service-points?with-performance-stats=true&max_distance=${selectedDistance}&limit=${selectedLimit}${activeSubscriptions ? "&with-active-subscriptions=true" : ""}${selectedPlans.length ? `&plan_ids=${selectedPlans.join()}`: ""}`)
			.then((response) => {
				dispatch({ type: GET_NEARBY_SERVICE_POINT, payload: response.data.data });
				callBack('success', "");
			}).catch((error: any) => {
				if (!error.response) {
					callBack('fail', "Network Error!!");
				} else {
					callBack('fail', error.response.data && error.response.data.message as string);
				}
			});
	}
};

export const getAdditionalDataAction = (department: string, licenseNo: string, vehicleId: string, constructionYear: string, callBack: (status: string, data: any) => void) => {
	return (dispatch: any) => {
		if (department === 'vehicles') {
			let URL: string = `vehicle-information-service/information?`
			URL += licenseNo ? `license-plate=${licenseNo}` : `vehicle_id=${vehicleId}`;
			URL += constructionYear ? `&construction_year=${constructionYear}` : "";
			axios.get(URL)
				.then((response) => {
					callBack('success', response.data)
				}).catch((error: any) => {
					callBack('fail', {})
				});
		}
	}
};

export const orderAction = (id: string, endpoint: string, callBack: (status: string, message: string) => void) => {
	return () => {
		axios.put(`/orders/${id}/${endpoint}`)
			.then(response => callBack('success', response.data.message as string))
			.catch((error: any) => {
				callBack('danger', error.response && error.response.data && error.response.data.message as string)
			});
	}
};

export const sendPaymentLinkAction = (id: string, callBack: (status: string, message: string) => void) => {
	return () => {
		axios.put(`/orders/${id}/send-paymentlink`)
			.then(response => callBack('success', response.data.message as string))
			.catch((error: any) => {
				callBack('danger', error.response ? error.response.data.message as string : "Er ging iets mis bij het opnieuw versturen van de betaallink probeer het later opnieuw")
			});
	}
};

export const cancelOrder = (orderId: number, selected: boolean) => {
	return (dispatch: any) => {
		axios.put(`/orders/${orderId}/cancel?with_cancellation_costs=${+selected}`).then((response) => {
			dispatch({ type: CANCEL_ORDER, payload: response.data });
		}).catch(function (error) {
			dispatch({ type: CANCEL_ORDER_FAIL, payload: error });
		});
	}
};

export const clearCancelOrder = () => {
	return (dispatch: any) => {
		dispatch({ type: CLEAR_CANCEL_ORDER });
	}
}


export const getServiceList = (payload: string, dataType: string) => {
	return (dispatch: any) => {
		axios.get(`services/prices?data=${payload}`)
			.then(response => response.data)
			.then(res => {
				if (dataType === 'new') {
					dispatch({ type: GET_SERVICE, payload: res.data })
				}
				else {
					dispatch({ type: UPDATE_SERVICE, payload: res.data })
				}
			})
			.catch(error =>{
				dispatch({ type: GET_SERVICE_FAIL, payload: error.response && error.response.data.message || "something went wrong" })
			}
			);
	}
};

export const setSelectedService = (selectedServiceId: number | undefined) => {
	return (dispatch: any) => {
		dispatch({ type: SET_SELECTED_SERVICE, payload: selectedServiceId })
	}
}

export const setCustomDescriptionService = (selectedService: any, description: string) => {
	return (dispatch: any) => {
		dispatch({ type: SET_CUSTOM_DESCRIPTION, payload: {selectedService, description} })
	}
}

export const setServicePrice = (selectedServiceId: number, price: number) => {
	return (dispatch: any) => {
		dispatch({ type: SET_SERVICE_PRICE, payload: { id: selectedServiceId, price } })
	}
}

export const setServiceData = (data: object) => {
	return (dispatch: any) => {
		dispatch({ type: SET_SERVICE_DATA, payload: { shipmentData: data } })
	}
};

export const setDimensionData = (data: object) => {
	return (dispatch: any) => {
		dispatch({ type: SET_DIMENSION_DATA, payload: { shipmentData: data } })
	}
};

/**
 * Handle submit order action
 * @param {ISubmitOrder} data
 */
export const submitOrderAction = (data: object) => {
	return (dispatch: any) => {
		data['user_id'] = null;

		// We dispatch action here to show loading and on fail we set loading to false
		axios.post("/orders", data, {
			headers: { "X-Idempotency": localStorage.getItem('uuid') },
			params: data
		})   
			.then((response: any) => {
				dispatch({ type: SUBMIT_ORDER_SUCCESS, payload: response.data });
				localStorage.removeItem("secret");
				localStorage.removeItem("uuid");
			})
			.catch((err: any) => {
				dispatch({ type: SUBMIT_ORDER_FAIL, payload: err.response.data })
			})
			.then((res: any) => {
				if (Object.keys(data).indexOf("vehicle_id") !== -1) {
					localStorage.removeItem("vehicles-credentials");
					localStorage.removeItem("vehicles-externalId");
				} else {
					localStorage.removeItem("couriers-credentials");
					localStorage.removeItem("couriers-externalId");
					localStorage.removeItem("locationData");
				}
				//window.location.href = res.redirect_location;
			})
			.catch((err: any) => {
				console.log(err)
			});
	};
};

/**
 * Handle update order action
 * @param {ISubmitOrder} data
 */
export const updateOrderAction = (id: number, data: object) => {
	return (dispatch: any) => {
		axios.patch(`/orders/${id}`, data, {
			params: data
		})
			.then((response: any) => {
				dispatch({ type: UPDATE_ORDER_SUCCESS, payload: response.data.data })
				localStorage.removeItem("secret");
				localStorage.removeItem("uuid");
			})
			.catch((err: any) => {
				//dispatch({type: UPDATE_ORDER_FAIL, payload: err.response.data})
				dispatch({ type: UPDATE_ORDER_FAIL, payload: 'Something Went Wrong' })
			})
			.then((res: any) => {
				if (Object.keys(data).indexOf("vehicle_id") !== -1) {
					localStorage.removeItem("vehicles-credentials");
					localStorage.removeItem("vehicles-externalId");
				} else {
					localStorage.removeItem("couriers-credentials");
					localStorage.removeItem("couriers-externalId");
					localStorage.removeItem("locationData");
				}
				//window.location.href = res.redirect_location;
			})
			.catch((err: any) => {
				console.log(err)
			});
	};
};

/**
 * get autocomplete data for postla code and house number
 * @param houseNumber
 * @param postalCode
 */
export const getAutocompleteDataAction = (
	houseNumber?: string,
	postalCode?: string
) => {
	return (dispatch: any) => {
		axios.get(`location-service/autocomplete/zip-code?street_number=${houseNumber}&zip_code=${postalCode}`)
			.then((response: any) => {
				return dispatch({
					type: GET_AUTOCOMPLETE_DATA_SUCCESS,
					payload: response.data.data
				});
			})
			.catch((error: any) => {
				dispatch({
					type: GET_AUTOCOMPLETE_DATA_FAIL,
					payload: error.response.data
				});
			});
	};
};

export const resetAutoCompleteAddressAction = () => {
	return (dispatch: any) => {
		dispatch({ type: RESET_AUTOCOMPLETE_DATA })
	}
};

export const setOrderDetail = (data: object) => {
	return (dispatch: any) => {
		dispatch({ type: SET_ORDER_DETAIL, payload: data })
	}
};

export const setSelectedCourierVehicle = (id: any) => {
	return (dispatch: any) => {
		dispatch({ type: SET_SELECTED_COURIER_VEHICLE, payload: id })
	}
};

export const setSelectedShipmentAction = (id: any) => {
	return (dispatch: any) => {
		dispatch({ type: SET_SELECTED_SHIPMENT, payload: id })
	}
};

export const getCourierVehicleAction = (data: string) => {
	return (dispatch: any) => {
		axios.get(`services/transportation-vehicles?data=${data}`)
			.then(res => {
				const data = {
					vehicleList: res.data.data,
					transportation_time: res.data.meta.transportation_time
				};
				dispatch({
					type: GET_COURIER_VEHICLELIST,
					payload: data
				});
			});
	}
};

export const getCouriersAction = () => {
	return (dispatch: any) => {
		axios.get('services/cargo-types')
			.then((response: any) => response.data.data)
			.then((res: any) => {
				return dispatch({ type: SET_COURIER_TYPE, payload: res })
			})
	};
};

export const getPaymentOptionAction = (base64: string, isPaymentUrl: boolean, callback: (result: boolean, response: any) => void) => {
	let urlBaseUrl = isPaymentUrl ? `/booking-service/payment/options?data=${base64}` : `/booking-service/delivery/options?data=${base64}`
	return (dispatch: any) => {
		axios.get(urlBaseUrl)
			.then(response => {
				callback(true, response.data.data);
				if (isPaymentUrl) {
				return dispatch({ type: GET_PAYMENT_OPTION, payload: response.data.data })
				} else {
					return dispatch({ type: GET_DELIVERY_OPTION, payload: response.data.data })
				}
			}).catch((error: any) => {
				callback(false, error.response?.data);
			})
	}
};

export const getOrderList = (companyId: string, page: number, limit: number, Callback: Function) => {
	return (dispatch: any) => {
		axios.get(`/service-points/${companyId}/orders?limit=${limit}&page=${page}`)
			.then((response) => {
				dispatch({ type: GET_ORDER_LIST, payload: response.data });
				Callback("success", response.data);
			}).catch(function (error) {
				if (!error.response) {
					Callback("fail", getCurrentLocale() === 'en' ? 'Network Error' : 'Netwerk \n' + 'Fout');
				} else if (error.response.status === 403) {
					Callback("fail", getCurrentLocale() === 'en' ? 'Access denied' : 'Geen Toegang');
				} else {
					Callback("fail", error.response.data.message);
				}
			});
	}
};

export const submitOrderComment = (orderId: string, data: Object, callback: (result: string, response: any) => void) => {
	return (dispatch: any) => {
		axios.post(`/orders/${orderId}/comments`, data)
			.then((response) => {
				callback('success', response.data);
			}).catch(function (error) {
				callback('failed', error.response?.data);
			});
	}
};

export const updateOrderComment = (orderId: string, commentId: string, data: Object, callback: (result: string, response: any) => void) => {
	return (dispatch: any) => {
		axios.patch(`/orders/${orderId}/comments/${commentId}`, data)
			.then((response) => {
				callback('success', response.data);
			}).catch(function (error) {
				callback('failed', error.response?.data);
			});
	}
};

export const deleteOrderComment = (orderId: string, commentId: string, callback: (result: string, response: any) => void) => {
	return (dispatch: any) => {
		axios.delete(`/orders/${orderId}/comments/${commentId}`)
			.then((response) => {
				callback('success', response.data);
			}).catch(function (error) {
				callback('failed', error.response?.data);
			});
	}
};

export const getAvaiableDates = (payload: string, callback: (result: string, response: any) => void) => {
	return (dispatch: any) => {
		axios.get(`/booking-service/availabilities?data=${payload}`)
			.then((response) => {
				callback('success', response.data);
			}).catch(function (error) {
				callback('failed', error.response && error.response.data.message || 'something went wrong');
			});
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

export const getDeliveryId = (id: string | number, callback: (status: string, response: any)=>void) => {
	return (dispatch : any) => {
		axios.get(`/booking-service/delivery/options/${id}`).then((res : any)=> {
			callback('success', res && res.data && res.data.data || {})
		}).catch((error: any)=> console.log(error))
	}
}