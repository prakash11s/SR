import axios from "../../util/Api";
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
	SET_ADMIN_EMPLOYEE_CREDENTIAL_ERROR, DELETE_ADMIN_EMPLOYEE_CREDENTIAL
} from "../../constants/ActionTypes";

/**
 * get employee data action
 */
export const getAdminEmployeeDetailAction = (employeeId: string) => {
	return (dispatch: any) => {
		dispatch({type: START_ADMIN_EMPLOYEE_LOADING});
		axios.get(`/system/employees/${employeeId}`)
			.then((response) => {
				dispatch({type: GET_ADMIN_EMPLOYEE_DATA, payload: response.data})
			})
			.catch((error: any) => {
				const errorMsg = error.response.status === 404 ? error.response.data.message : 'Something Went Wrong';
				dispatch({type: SET_ADMIN_EMPLOYEE_ERROR, payload: errorMsg})
			})
	}
};

/**
 * get employee permission action
 */
export const getAdminEmployeePermissionAction = () => {
	return (dispatch: any) => {
		dispatch({type: START_ADMIN_EMPLOYEE_PERMISSION_LOADING});
		axios.get(`/system/authorization/permissions?limit=1000&page=0`)
			.then((response) => {
				dispatch({type: GET_ADMIN_EMPLOYEE_PERMISSION, payload: response.data.data})
			})
			.catch((error: any) => {
				console.log(error);
				dispatch({type: SET_ADMIN_EMPLOYEE_PERMISSION_ERROR, payload: 'Something Went Wrong'})
			})
	}
};

/**
 * get employee credentions action
 */
export const getAdminEmployeeCredentialAction = (employeeId: string) => {
	return (dispatch: any) => {
		dispatch({type: START_ADMIN_EMPLOYEE_CREDENTIAL_LOADING});
		axios.get(`/system/phone-system/agents/${employeeId}/credentials`)
			.then((response) => {
				dispatch({type: GET_ADMIN_EMPLOYEE_CREDENTIAL, payload: response.data.data})
			})
			.catch((error: any) => {
				console.log(error);
				dispatch({type: SET_ADMIN_EMPLOYEE_CREDENTIAL_ERROR, payload: 'Something Went Wrong'})
			})
	}
};

/**
 * get employee credentions action
 */
export const createSoftPhoneCredential = (data: any, loading: () => void , callback: (status: boolean, response: string) => void) => {
	return (dispatch: any) => {
		loading()
		axios.post(`/system/phone-system/credentials`, data)
			.then((response) => {
				dispatch({type: GET_ADMIN_EMPLOYEE_CREDENTIAL, payload: [response.data.data]})
				callback(true, "Credential Created Successfully.");
			})
			.catch((error: any) => {
				callback(false, error.response.data.message);
			})
	}
};

/**
 * delete employee  action
 */
export const deleteAdminEmployeeAction = (uuid: string, callback: (status: boolean, response: string) => void) => {
	return (dispatch: any) => {
		axios.delete(`/system/employees/${uuid}`)
			.then((response) => {
				callback(true, '')
			})
			.catch((error: any) => {
				callback(false, error.response.status)
			})
	}
};

/**
 * delete employee softphone credential action
 */
export const deleteSoftPhoneCredentialAction = (uuid: string, agentId: string, credentialId: string, callback: (status: boolean, response: string) => void) => {
	return (dispatch: any) => {
		axios.delete(`/system/phone-system/agents/${agentId}/credentials/${credentialId}`)
			.then((response) => {
				dispatch({type: DELETE_ADMIN_EMPLOYEE_CREDENTIAL, payload: credentialId})
				callback(true, '');
			})
			.catch((error: any) => {
				callback(false, error.response.status)
			})
	}
};


// export const resetServiceLoadingError = () => {
// 	return (dispatch: any) => {
// 		dispatch({type: RESET_SERVICE_ERROR});
// 	}
// };
