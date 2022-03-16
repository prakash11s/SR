import {
    GET_REPORT,
    START_REPORT_LOADING,
    SET_REPORT_ERROR,
    REPORT_ACTION_SUCCESS,
	STOP_REPORT_LOADING
} from "../../constants/ActionTypes";
import {IReportReducer} from "../Interface/ReportReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState: IReportReducer = {
	reportList: [],
	loading: false,
	error: '',
	meta: null
};

export default (state: IReportReducer = initialState, {type, payload}: IAction) => {
	switch (type) {
		case GET_REPORT:
			return {
				...state,
				reportList: payload.data,
				loading: false,
				error: '',
				meta: {
					from: payload.from,
					to: payload.to,
					total: payload.total,
					perPage: payload.per_page,
				}
			};
		case REPORT_ACTION_SUCCESS:
			return {
				...state,
				reportList: state.reportList.filter((report:any) => report.id !== payload),
				loading: false,
				error: '',
				meta: null
			};
		case START_REPORT_LOADING:
			return {
				...state,
				loading: true,
				error: '',
				meta: null
			};
		case STOP_REPORT_LOADING:
			return {...state, loading: false};
		case SET_REPORT_ERROR:
			return {
				...state,
				error: payload,
				loading: false
			};
		default:
			return state;
	}
};
