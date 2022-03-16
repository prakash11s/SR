import {
	GET_SERVICES_LIST,
	START_SERVICES_LOADING,
	SET_SERVICES_ERROR,
	STOP_SERVICES_LOADING, 
	GET_SERVICE_CATEGORIES, 
	GET_SERVICE_PRICE_DRIVER,
	RESET_SERVICE_ERROR
} from "../../constants/ActionTypes";
import {IServicesReducer} from "../Interface/ServicesReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState: IServicesReducer = {
	services: [],
	loading: false,
	error: '',
	categories: [],
	price_driver: []
};

export default (state: IServicesReducer = initialState, {type, payload}: IAction) => {
	switch (type) {
		case GET_SERVICES_LIST:
			return {
				...state,
				services: payload,
				loading: false,
				error: ''
			};
		case START_SERVICES_LOADING:
			return {
				...state,
				loading: true
			};
		case STOP_SERVICES_LOADING:
			return {
				...state,
				loading: false
			};
		case SET_SERVICES_ERROR:
			return {
				...state,
				error: payload,
			};
		case GET_SERVICE_CATEGORIES:
			return {
				...state,
				categories: payload,
				error: '',
				loading: false
			};
		case GET_SERVICE_PRICE_DRIVER:
			return {
				...state,
				price_driver: payload,
				error: '',
				loading: false
			};
		case RESET_SERVICE_ERROR:
			return {
				...state,
				error: '',
				loading: false
			};
		default:
			return state;
	}
};
