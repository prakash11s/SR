import {
	GET_DASHBOARD_ORDER,
	START_DASHBOARD_LOADING
} from "../../constants/ActionTypes";
import {IDashboardReducer} from "../Interface/DashboardReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState: IDashboardReducer = {
	orders: [],
	loading: false
};

export default (state: IDashboardReducer = initialState, {type, payload}: IAction) => {
	switch (type) {
		case GET_DASHBOARD_ORDER:
			return {
				...state, 
				orders: payload,
				loading: false
			};
		case START_DASHBOARD_LOADING:
			return {
				...state, 
				loading: true
			};
		default:
			return state;
	}
};
