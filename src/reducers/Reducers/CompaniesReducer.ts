import {
    GET_COMPANY_DETAILS,
    GET_QUEUE_ENTRIES,
    SEARCH_QUEUE_ENTRIES,
    CLEAR_DATA,
    START_LOADING,
    STOP_LOADING,
    GET_SUBSCRIPTION_LIST,
    START_SUBSCRIPTION_LOADING,
    STOP_SUBSCRIPTION_LOADING,
    SET_SUBSCRIPTION_ERROR,
    UPDATE_COMPANY_OPENING_HOUR,
    CLEAR_COMPANY_DATA,
    GET_QUEUE_ENTRIES_ERROR,
    SEARCH_QUEUE_ENTRIES_ERROR,
    START_INVOICE_LOADING,
    STOP_INVOICE_LOADING,
    GET_INVOICE_LIST,
    SET_INVOICE_ERROR,
    GET_INVOICE_META,
} from "../../constants/ActionTypes";
import {ICompanyReducer, ICompany} from "../Interface/CompanyReducerInterface";
import {IAction} from "../Interface/ActionInterface";

export const initCompany: ICompany = {
	id: '',
	department: '',
	name: '',
	coc: '',
	street: '',
	street_number: 0,
	city: '',
	zip_code: '',
	lng: '',
	lat: '',
	country: '',
	phone: '',
	phone_2: '',
	email: '',
	website: '',
	description: '',
	opening_hours: null,
	old_service_point_id: 0,
	created_at: '',
	updated_at: '',
	deleted_at: '',
	public_visibility: 0,
}

const initialState: ICompanyReducer = {
	company: initCompany,
	queueEntries: {
		data: [],
		meta: {},
	},
	isTableLoading: false,
	subscriptions: {
		loading: false,
		error: '',
		subscriptionList: [],
		meta: null
	},
	invoices: {
		meta: null,
		loading: false,
		error: '',
		invoiceList: []
	},
	error: ''
};

export default (
	state: ICompanyReducer = initialState,
	{type, payload}: IAction
) => {
	switch (type) {
		case GET_COMPANY_DETAILS:
			return {...state, company: payload};

		case CLEAR_COMPANY_DATA:
			return {...state, company: initialState};

		case UPDATE_COMPANY_OPENING_HOUR:
			const day = Object.keys(payload)[0];
			return {
				...state,
				company: {
					...state.company,
					opening_hours: {
						...state.company.opening_hours,
						[day]: payload[day]
					}
				}
			};

		case GET_QUEUE_ENTRIES:

			return {
				...state,
				queueEntries: {
					data: payload.addData ? [...state.queueEntries.data, ...payload.data.data] : payload.data.data,
					meta: payload.data.meta,
				},
				isTableLoading: false
			};

		case GET_QUEUE_ENTRIES_ERROR:
			return {
				...state,
				queueEntries: {
					data: [],
					meta: [],
				},
				isTableLoading: false,
				error: payload
			};

		case SEARCH_QUEUE_ENTRIES_ERROR:
			return {
				...state,
				queueEntries: {
					data: [],
					meta: [],
				},
				isTableLoading: false,
				error: payload
			};

		case SEARCH_QUEUE_ENTRIES:
			return {
				...state,
				queueEntries: {
					data: payload.addData ? [...state.queueEntries.data, ...payload.data] : payload.data,
					meta: payload.meta,
				},
				isTableLoading: false
			};

		case CLEAR_DATA:
			return {
				...state,
				queueEntries: {
					data: [],
					meta: {},
				},
			};

		case START_LOADING:
			return {
				...state,
				isTableLoading: true,
				error: ''
			};

		case STOP_LOADING:
			return {
				...state,
				isTableLoading: false,
				error: ''
			};

		case START_SUBSCRIPTION_LOADING:
			return {
				...state,
				subscriptions: {
					...state.subscriptions,
					loading: true,
					error: '',
				}
			};

		case STOP_SUBSCRIPTION_LOADING:
			return {
				...state,
				subscriptions: {
					...state.subscriptions,
					loading: false,
				}
			};

        case START_INVOICE_LOADING:
            return {
                ...state,
                invoices: {
                    ...state.invoices,
                    loading: true,
                    error: '',
                }
            };

		case STOP_INVOICE_LOADING:
			return {
				...state,
				invoices: {
					...state.invoices,
					loading: false,
				}
			};

		case GET_INVOICE_LIST:
			return {
				...state,
				invoices: {
					...state.invoices,
					loading: false,
					invoiceList: payload,
					error: ''
				}
			};

		case GET_INVOICE_META:
			return {
				...state,
				invoices: {
                    ...state.invoices,
                    meta: payload,
				}
			};

        case SET_INVOICE_ERROR:
            return {
                ...state,
                invoices: {
                    ...state.invoices,
                    error: payload
                }
            };

		case GET_SUBSCRIPTION_LIST:
			return {
				...state,
				subscriptions: {
					loading: false,
					subscriptionList: payload.data,
					meta: payload.meta,
					error: ''
				}
			};

		case SET_SUBSCRIPTION_ERROR:
			return {
				...state,
				subscriptions: {
					...state.subscriptions,
					error: payload
				}
			};

		default:
			return state;
	}
};
