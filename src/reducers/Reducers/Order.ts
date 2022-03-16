import {
	GET_ORDER_OVERVIEW,
	CANCEL_ORDER,
	CANCEL_ORDER_FAIL,
	CLEAR_CANCEL_ORDER,
	SET_NEW_ORDER,
	GET_SERVICE,
	GET_SERVICE_FAIL,
	SET_SELECTED_SERVICE,
	SET_SERVICE_PRICE,
	SET_ORDER_DETAIL,
	SET_COURIER_TYPE,
	SET_SERVICE_DATA,
	SUBMIT_ORDER_SUCCESS,
	RESET_ORDER,
	SUBMIT_ORDER_FAIL,
	SET_SUPPORTCODE_DATA,
	RESET_AUTOCOMPLETE_DATA,
	GET_AUTOCOMPLETE_DATA_SUCCESS,
	GET_AUTOCOMPLETE_DATA_FAIL,
	SET_DIMENSION_DATA,
	SET_SELECTED_COURIER_VEHICLE,
	SET_ORDER_PREFILL_DATA,
	SET_SELECTED_SHIPMENT,
	GET_COURIER_VEHICLELIST,
	GET_PAYMENT_OPTION,
	UPDATE_ORDER_SUCCESS,
	UPDATE_ORDER_FAIL, GET_NEARBY_SERVICE_POINT, CLEAR_ORDER_OVERVIEW, UPDATE_SERVICE, GET_SERVICE_POINT_DETAILS,
	GET_ORDER_LIST,
	GET_SERVICE_POINT_DISSOCIATION_REASON_REQUEST,
	GET_SERVICE_POINT_DISSOCIATION_REASON_SUCCESS,
	GET_SERVICE_POINT_DISSOCIATION_REASON_ERROR,
	SET_SERVICE_POINT_DISSOCIATION_SUCCESS,
	GET_PREFERRED_DATES,
	UPDATE_PREFERRED_DATE,
	CREATE_PREFERRED_DATE,
	DELETE_PREFERRED_DATE_SUCCESS,
	SET_SERVICE_POINT_DISSOCIATION_ERROR,
	SET_SERVICE_POINT_DISSOCIATION_REQUEST,
	UPDATE_SERVICE_PRICE,
    SET_CUSTOM_DESCRIPTION,
	UPDATE_CLIENT_DETIALS,
	UPDATE_SENDER_DETIALS,
	UPDATE_RECIEVER_DETIALS,
	UPDATE_OTHER_DETIALS,
	UPDATE_RECIEVER,
	UPDATE_SENDER,
	UPDATE_CLIENT,
	UPDATE_ALL_DETAILS,
	SET_SELECTED_SERVICES,
	GET_DELIVERY_OPTION,
} from "constants/ActionTypes";
import { IOrder, IOrderCreateService } from "../Interface/OrderInterface";
import { IAction } from "../Interface/ActionInterface";
import ActivePhoneCall from "components/Phone/ActivePhoneCall";

const initialState: IOrder = {
	order: [],
	cancelOrder: {
		message: undefined,
		success: false
	},
	service_points: [],
	service_point_details: {},
	service_point_dissociation: {
		message: undefined,
		success: false,
		loading: false,
		reason: null
	},
	orderCreate: {
		order: null,
		services: null,
		orderDetails: null,
		supportCodeData: null,
		autoCompleteAddress: null,
		orderPrefillData: null,
		selectedServices: [],
		isUpdated: false,
		isUpdatingPrice: false,
		serviceError: '',
		receiverDetails: { title: 'mr. mrs.' },
		senderDetails: { title: 'mr. mrs.' },
		clientDetails: { title: 'mr. mrs.' },
		others: {}
	},
	preferredDates: []
};

export default (state: IOrder = initialState, { type, payload }: IAction) => {
	switch (type) {
		case GET_ORDER_OVERVIEW:
			return { ...state, order: payload };
		case GET_SERVICE_POINT_DETAILS:
			return { ...state, service_point_details: payload.data };
		case GET_SERVICE_POINT_DISSOCIATION_REASON_REQUEST:
			return {
				...state, service_point_dissociation: {
					...state.service_point_dissociation,
					loading: true,
					success: false
				}
			};
		case GET_SERVICE_POINT_DISSOCIATION_REASON_SUCCESS:
			return {
				...state, service_point_dissociation: {
					...state.service_point_dissociation,
					loading: false,
					success: true,
					reason: payload
				}
			};
		case GET_PREFERRED_DATES:
			return {
				...state,
				preferredDates: payload.data
			};
		case CREATE_PREFERRED_DATE:
			let preferredDatesClone: any = state.preferredDates.slice();
			preferredDatesClone.push(payload.data)
			return {
				...state,
				preferredDates: preferredDatesClone
			};
		case UPDATE_PREFERRED_DATE:
			return {
				...state,
				preferredDates: payload
			};
		case DELETE_PREFERRED_DATE_SUCCESS:
			const preferredDatesList: any = state.preferredDates.slice();
			const dateToBeDeleted = preferredDatesList.find(date => date.id === payload.preferredDateId)
			const index = preferredDatesList.indexOf(dateToBeDeleted);
			preferredDatesList.splice(index, 1);
			return {
				...state,
				preferredDates: preferredDatesList
			}
		case SET_SERVICE_POINT_DISSOCIATION_REQUEST:
			return {
				...state,
				service_point_dissociation: {
					...state.service_point_dissociation,
					loading: true,
					success: false,
				}
			};
		case SET_SERVICE_POINT_DISSOCIATION_SUCCESS:
			return {
				...state,
				service_point_details: {},
				service_point_dissociation: {
					...state.service_point_dissociation,
					loading: false,
					success: true,
				}
			};
		case SET_SERVICE_POINT_DISSOCIATION_ERROR:
			return {
				...state,
				service_point_dissociation: {
					...state.service_point_dissociation,
					loading: false,
					success: false,
				}
			};

		case GET_SERVICE_POINT_DISSOCIATION_REASON_ERROR:
			return {
				...state,
				service_point_dissociation: {
					...state.service_point_dissociation,
					loading: false,
					success: false,
				}
			};
		case GET_NEARBY_SERVICE_POINT:
			return { ...state, service_points: payload };
		case CLEAR_ORDER_OVERVIEW:
			return {
				...state,
				service_points: [],
				order: [],
				service_point_details: {},
				service_point_dissociation: {
					message: undefined,
					success: false,
					loading: false,
					reason: null
				}
			};
		case CANCEL_ORDER:
			return { ...state, cancelOrder: payload };
		case CANCEL_ORDER_FAIL:
			return { ...state, cancelOrder: { message: payload.message } };
		case CLEAR_CANCEL_ORDER:
			return { ...state, cancelOrder: initialState.cancelOrder };
		case SET_NEW_ORDER:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: payload,
					services: null,
					orderDetails: window.location.href.indexOf('/create') > 0 ? state.orderCreate.orderDetails : null,
				}
			};
		case SET_SUPPORTCODE_DATA:
			return {
				...state,
				orderCreate: {
					order: null,
					services: null,
					orderDetails: null,
					supportCodeData: payload
				}
			};
		case SET_SELECTED_SERVICES:
			return {
				...state,
				orderCreate:{
					...state.orderCreate,
					selectedServices: payload
				}
			}
		case SET_CUSTOM_DESCRIPTION:
			return {
					...state,
					orderCreate: {
							...state.orderCreate,
							selectedServices: state.orderCreate.selectedServices?.map(service => {
									if (payload.selectedService.id === service.id) {
											service.custom_description = payload.description
									}
									return service
							})
					}
			};
		case GET_SERVICE:
			let supportServices = state.orderCreate.supportCodeData && state.orderCreate.supportCodeData.selected_services;
			let preSelect = state.orderCreate && state.orderCreate.selectedServices || [];
			let preFill = state.orderCreate.orderPrefillData && state.orderCreate.orderPrefillData.services && state.orderCreate.orderPrefillData.services.map((item) => { item.id = item.service_id; return item }) || [];
			if (!(state.orderCreate.isUpdated) && supportServices) {
				supportServices.forEach((i) => {
					let supportService = payload.find((item) => item.id === i.id)
					if (supportService) {
						preSelect.push(supportService)
					}
				})
			}
			if (!(state.orderCreate.isUpdated) && preFill.length) {
				preSelect = [...preFill, ...preSelect];
			}
			
			let hasSelectedServices = (id: number) => {
				if (Array.isArray(preSelect) && preSelect.length) {
					return Boolean(preSelect.find((order: any) => order.id === id))
				}
				return false
			}

			const services = payload.map((service: any) => {
				if (!service.hasOwnProperty('checked')) {
					service.checked = hasSelectedServices(service.id);
				}
				preSelect.forEach((order: any) => {
					if (order.id === service.id) {
						service.service_price = {
							...service.service_price,
							price: order.total_price ? order.total_price : order.service_price ? order.service_price.price : order.price,
							// for edit an order get selected service's price from prefill data's services
						}
					}
					;
				})
				if (!service.service_price) {
					service.service_price = { price: 0 }
				}
				return service;
			});
			let updatedServices: any[] = [];
			services.forEach((service: any)=>{
				let hasNot = !Boolean(updatedServices.find((item: any) => item.id === service.id)) && (Boolean(preSelect.find(item => item.id === service.id)))
				if(hasNot){
					service['price'] = (service.service_price && service.service_price.price) || service.price;
					service.amount = 1;
					updatedServices.push(service)
				}
			})
            state.orderCreate.selectedServices?.forEach(service => {
                const updateSelectedService = updatedServices.findIndex((update) => update.id === service.id);
                if(service.custom_description) {
                    updatedServices[updateSelectedService].custom_description = service.custom_description
                }
            })
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					services: services,
					selectedServices: updatedServices,
					isUpdatingPrice: false,
				}
			};
		case UPDATE_SERVICE:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					services: payload.map((service: any, index: number) => {
						service.checked = state.orderCreate.services[index].checked
						if (!service.service_price) {
							service.service_price = { price: 0 }
						}
						return service;
					}),
				}
			};
		case GET_AUTOCOMPLETE_DATA_SUCCESS:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					autoCompleteAddress: {
						Address: payload,
						error: null,
					}
				}
			};
		case GET_AUTOCOMPLETE_DATA_FAIL:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					autoCompleteAddress: {
						Address: null,
						error: payload
					}
				}
			};
		case RESET_AUTOCOMPLETE_DATA:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					autoCompleteAddress: null
				}
			};
		case GET_SERVICE_FAIL:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					serviceError: payload,
					isUpdatingPrice: false
				}
			};

		case SET_SELECTED_SERVICE:
			let selectedServices: any[] = state.orderCreate.selectedServices || [];
			const oldServices: any = state.orderCreate.services || [];
			const isSelected = selectedServices.filter(item => item.id === payload);
			let service = oldServices.filter(item => item.id === payload);
			if (isSelected.length) {
				selectedServices = selectedServices.filter((item) => item.id !== payload);
			}
			else {
				if (service.length) {
					service[0].service_id = service[0].id;
					service[0].price = service[0].service_price.price;
					service[0].amount = 1;
					selectedServices.push(service[0]);
				}
			}

			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					selectedServices: selectedServices,
					isUpdated: true,
					serviceError: '',
					services: state.orderCreate.services && state.orderCreate.services.map((item: IOrderCreateService) => {
						if (item.id === payload) {
							return {...item, checked: !item.checked};
						}
						return item;
					}),
					isUpdatingPrice: true,
				}
			};
		case SET_SERVICE_PRICE:
			let selectedServicesArr = state.orderCreate.selectedServices || [];
			// let preFilledServicesArr = state.orderCreate.orderPrefillData && state.orderCreate.orderPrefillData.services || [];
			// let newSelectedArr = [...selectedServicesArr, ...preFilledServicesArr];
			let newSelectedArr = [...selectedServicesArr];
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					selectedServices: selectedServicesArr.map((item: IOrderCreateService) => {
						if (item.id === payload.id) {
							if (item.service_price) {
								item.service_price.price = payload.price
							} else {
								item.service_price = { price: payload.price }
							}
						}
						return item;
					}),
					serviceError: '',
					services: state.orderCreate.services.map((item: IOrderCreateService) => {
						if (item.id === payload.id) {
							if (!item.hasOwnProperty('checked')) {
								item['checked'] = Boolean(newSelectedArr.find((order: any) => order.service_id === service.id))
							}
							if (item.service_price) {
								item.service_price.price = payload.price
							} else {
								item.service_price = { price: payload.price }
							}
						}
						return item;
					}),
				}
			};
		case SET_ORDER_DETAIL:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					orderDetails: payload,
				}
			};
		case SET_COURIER_TYPE:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: {
						...state.orderCreate.order,
						courierTypes: payload.map(courier => {
							courier.checked = false;
							return courier
						}),
					},
				}
			};
		case SET_SELECTED_SHIPMENT:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: {
						...state.orderCreate.order,
						courierTypes: state.orderCreate.order.courierTypes.map(courier => {
							courier.checked = courier.id === payload;
							return courier;
						}),
					},
				}
			};
		case GET_COURIER_VEHICLELIST:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: {
						...state.orderCreate.order,
						courierVehicleTypes: payload.vehicleList.map(vehicle => {
							vehicle.checked = false;
							return vehicle
						}),
						transportation_time: payload.transportation_time
					},
				}
			};

		case SET_SELECTED_COURIER_VEHICLE:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: {
						...state.orderCreate.order,
						courierVehicleTypes: state.orderCreate.order.courierVehicleTypes.map(vehicle => {
							vehicle.checked = vehicle.id === payload;
							return vehicle;
						}),
					},
				}
			};
		case SET_ORDER_PREFILL_DATA:
			const additionalData: any = {};
			payload.additional_data.forEach((data: any) => {
				additionalData[data['key']] = data.json_value ? data.json_value : data.value;
			});
			payload.additional_data = additionalData;
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					orderPrefillData: payload
				}
			};
		case SET_DIMENSION_DATA:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: {
						...state.orderCreate.order,
						shipmentData: {
							...state.orderCreate.order.shipmentData,
							dimensions: payload.shipmentData
						}
					},
				}
			};
		case SET_SERVICE_DATA:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: {
						...state.orderCreate.order,
						shipmentData: {
							...state.orderCreate.order.shipmentData,
							services: payload.shipmentData
						}
					},
				}
			};
		case GET_PAYMENT_OPTION:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: {
						...state.orderCreate.order,
						paymentOption: payload
					},
				}
			};
		case GET_DELIVERY_OPTION:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					order: {
						...state.orderCreate.order,
						deliveryOptions: payload
					},
				}
			};
		case SUBMIT_ORDER_SUCCESS:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					orderDetails: {
						...state.orderCreate.orderDetails,
						orderSubmitResposne: payload
					},
				}
			};
		case UPDATE_ORDER_SUCCESS:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					orderDetails: {
						...state.orderCreate.orderDetails,
						orderSubmitResposne: payload
					},
				}
			};
		case SUBMIT_ORDER_FAIL:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					orderDetails: {
						...state.orderCreate.orderDetails,
						orderSubmitResposne: payload
					},
				}
			}
		case UPDATE_ORDER_FAIL:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					orderDetails: {
						...state.orderCreate.orderDetails,
						orderSubmitResposne: payload
					},
				}
			}
		case RESET_ORDER:
			return {
				...state,
				orderCreate: {
					order: null,
					services: null,
					orderDetails: {},
					selectedServices: [],
					isUpdated: false,
					serviceError: ''
				},
			};

		case UPDATE_CLIENT_DETIALS: {
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					clientDetails: {
						...state.orderCreate.clientDetails,
						[payload.key]: payload.value
					}
				}
			}
		}
		case UPDATE_RECIEVER: {
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					receiverDetails: {
						...state.orderCreate.receiverDetails,
						...payload
					}
				}
			}
		}
		case UPDATE_SENDER: {
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					senderDetails: {
						...state.orderCreate.senderDetails,
						...payload
					}
				}
			}
		}
		case UPDATE_CLIENT:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					clientDetails: {
						...state.orderCreate.clientDetails,
						...payload
					}
				}
			}
		case UPDATE_RECIEVER_DETIALS:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					receiverDetails: {
						...state.orderCreate.receiverDetails,
						[payload.key]: payload.value
					}
				}
			}
		case UPDATE_SENDER_DETIALS:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					senderDetails: {
						...state.orderCreate.senderDetails,
						[payload.key]: payload.value
					}
				}
			}
		case UPDATE_OTHER_DETIALS:
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					others: {
						...state.orderCreate.others,
						[payload.key]: payload.value
					}
				}
			}
		case UPDATE_ALL_DETAILS: {
			let sender = payload.sender_details || {};
			let reciever = payload.receiver_details || {};
			return {
				...state,
				orderCreate: {
					...state.orderCreate,
					senderDetails: {
						title: sender.salutation,
						name: sender.name,
						houseNumber: sender.houseNumber,
						email: sender.email,
						company: sender.company,
						department: sender.department,
						address: sender.street_number,
						phone: sender.phone
					},
					receiverDetails: {
						title: reciever.salutation,
						name: reciever.name,
						houseNumber: reciever.houseNumber,
						email: reciever.email,
						company: reciever.company,
						department: reciever.department,
						address: reciever.street_number,
						phone: reciever.phone
					},
					clientDetails: {
						name: payload.name,
						title: payload.salutation && payload.salutation.length ? payload.salutation.toLowerCase().startsWith("ms") || payload.salutation.toLowerCase().startsWith("mrs") ? "ms." : payload.salutation.toLowerCase().startsWith("mr. mr") ? "mr. mrs." : "mr." : "",
						email: payload.email,
						postalCode: payload.zip_code,
						address: payload.street,
						houseNumber: payload.street_number,
						place: payload.place,
						phone: payload.phone
					},
					others: {
						...state.orderCreate.others,
						comment: payload.comment,
						paymentBy: payload.paymentBy,
					},


				}
			}
		}
		case GET_ORDER_LIST:
			return {
				...state, order: payload.data,
			};
		default:
			return state;
	}
};
