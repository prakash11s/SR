import {
	GET_ADMIN_EMPLOYEE_DATA,
	START_ADMIN_EMPLOYEE_LOADING,
	STOP_ADMIN_EMPLOYEE_LOADING,
	SET_ADMIN_EMPLOYEE_ERROR,
	GET_ADMIN_EMPLOYEE_PERMISSION,
	START_ADMIN_EMPLOYEE_PERMISSION_LOADING,
	STOP_ADMIN_EMPLOYEE_PERMISSION_LOADING,
	SET_ADMIN_EMPLOYEE_PERMISSION_ERROR,
	GET_ADMIN_EMPLOYEE_CREDENTIAL,
	START_ADMIN_EMPLOYEE_CREDENTIAL_LOADING,
	STOP_ADMIN_EMPLOYEE_CREDENTIAL_LOADING,
	SET_ADMIN_EMPLOYEE_CREDENTIAL_ERROR,
	DELETE_ADMIN_EMPLOYEE_CREDENTIAL
} from "../../constants/ActionTypes";
import {IAdminEmployeeReducer, IEmployeePermission} from "../Interface/AdminEmployeeReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState: IAdminEmployeeReducer = {
	employeeData: {
		first_name: "",
		last_name: "",
		alias: "",
		salutation: "",
		email: "",
		phone: "",
		roles: "",
		permissions: []
	},
	employeeLoading: false,
	employeeError: '',
	permissionList: [],
	permissionListLoading: false,
	permissionListError: '',
	softPhoneCredentials: [],
	softPhoneCredentialsLoading: false,
	softPhoneCredentialsError: '',
};

export default (state: IAdminEmployeeReducer = initialState, {type, payload}: IAction) => {
	switch (type) {
		case GET_ADMIN_EMPLOYEE_DATA:
			return {
				...state,
				employeeData: payload,
				employeeLoading: false,
				employeeError: ''
			};
		case START_ADMIN_EMPLOYEE_LOADING:
			return {
				...state,
				employeeLoading: true,
			};
		case STOP_ADMIN_EMPLOYEE_LOADING:
			return {
				...state,
				employeeLoading: false
			};
		case SET_ADMIN_EMPLOYEE_ERROR:
			return {
				...state,
				employeeLoading: false,
				employeeError: payload,
			};
		case GET_ADMIN_EMPLOYEE_PERMISSION:
			return {
				...state,
				permissionList: payload,
				permissionListLoading: false,
				permissionListError: ''
			};
		case START_ADMIN_EMPLOYEE_PERMISSION_LOADING:
			return {
				...state,
				permissionListLoading: true,
			};
		case STOP_ADMIN_EMPLOYEE_PERMISSION_LOADING:
			return {
				...state,
				permissionListLoading: false
			};
		case SET_ADMIN_EMPLOYEE_PERMISSION_ERROR:
			return {
				...state,
				permissionListError: payload,
			};
		case GET_ADMIN_EMPLOYEE_CREDENTIAL:
			return {
				...state,
				softPhoneCredentials: payload,
				softPhoneCredentialsLoading: false,
				softPhoneCredentialsError: '',
			};
		case DELETE_ADMIN_EMPLOYEE_CREDENTIAL:
			return {
				...state,
				softPhoneCredentials: state.softPhoneCredentials.filter((credential: any) => credential.id !== payload),
				softPhoneCredentialsLoading: false,
				softPhoneCredentialsError: '',
			};
		case START_ADMIN_EMPLOYEE_CREDENTIAL_LOADING:
			return {
				...state,
				softPhoneCredentialsLoading: true,
			};
		case STOP_ADMIN_EMPLOYEE_CREDENTIAL_LOADING:
			return {
				...state,
				permissionListLoading: false
			};
		case SET_ADMIN_EMPLOYEE_CREDENTIAL_ERROR:
			return {
				...state,
				softPhoneCredentialsError: payload,
			};
		// case RESET_SERVICE_ERROR:
		// 	return {
		// 		...state,
		// 		error: '',
		// 		loading: false
		// 	};
		default:
			return state;
	}
};
