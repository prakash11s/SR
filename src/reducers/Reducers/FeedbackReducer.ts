import {
    GET_FEEDBACK,
    START_FEEDBACK_LOADING,
    SET_FEEDBACK_ERROR,
    FEEDBACK_ACTION_SUCCESS, STOP_FEEDBACK_LOADING
} from "../../constants/ActionTypes";
import {IFeedbackReducer} from "../Interface/FeedbackReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState: IFeedbackReducer = {
	feedbackList: [],
	loading: false,
	error: '',
	meta: null
};

export default (state: IFeedbackReducer = initialState, {type, payload}: IAction) => {
	switch (type) {
		case GET_FEEDBACK:
			return {
				...state,
				feedbackList: payload.data,
				loading: false,
				error: '',
				meta: payload.meta
			};
		case FEEDBACK_ACTION_SUCCESS:
			return {
				...state,
				feedbackList: state.feedbackList.filter((feedback:any) => feedback.id !== payload),
				loading: false,
				error: '',
				meta: payload.meta
			};
		case START_FEEDBACK_LOADING:
			return {
				...state,
				loading: true,
				error: '',
			};
		case STOP_FEEDBACK_LOADING:
			return {...state, loading: false};
		case SET_FEEDBACK_ERROR:
			return {...state, error: payload};
		default:
			return state;
	}
};
