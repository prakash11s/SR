import axios from "../../util/Api";
import { store } from "../../store";
import {
    SET_EMPLOYEES_TABLE_DATA,
    SET_IS_EMPLOYEE_TABLE_LOADING_TRUE,
    SET_IS_EMPLOYEE_TABLE_LOADING_FALSE,
    SET_ROLES,
    SET_COUNTRY_CODES,
    SET_FIRST_NAME,
    SET_LAST_NAME,
    SET_EMAIL,
    SET_PHONE_COUNTRY,
    SET_PHONE,
    SET_ROLE,
    RESET_EMPLOYEE_DETAILS,
    SET_SUBMIT_DISABLE,
    SET_SUBMIT_ENABLE,
    SET_SUCCESS_TRUE,
    SET_WARNING_TRUE,
    SET_ERROR_MESSAGE,
    SET_SUCCESS_FALSE,
    SET_WARNING_FALSE,
    SET_POPUP_TRUE,
    HIDE_ALERT_POPUP,
    DELETE_EMPLOYEE_RECORD,
    ADD_EMPLOYEES_TABLE_DATA
} from "constants/ActionTypes";


export const disableSubmit = () => ({
    type: SET_SUBMIT_DISABLE
})

export const enableSubmit = () => ({
    type: SET_SUBMIT_ENABLE
})

export const setEmployeesTableData = (payload:object) => ({
    type: SET_EMPLOYEES_TABLE_DATA,
    payload: payload
});

export const addEmployeesTableData = (payload:any) => ({
    type: ADD_EMPLOYEES_TABLE_DATA,
    payload: payload
})

export const setRoles = (payload:object) => ({
    type: SET_ROLES,
    payload: payload
})

export const setCountryCodes = (payload:object) => ({
    type: SET_COUNTRY_CODES,
    payload: payload
})

export const setFirstNameToState = (payload:string) => ({
    type: SET_FIRST_NAME,
    payload: payload
})

export const setLastNameToState = (payload:string) => ({
    type: SET_LAST_NAME,
    payload: payload
})

export const setEmailToState = (payload:string) => ({
    type: SET_EMAIL,
    payload: payload
})

export const setPhoneCountryToState = (payload:string) => ({
    type: SET_PHONE_COUNTRY,
    payload: payload
})

export const setPhoneToState = (payload:string) => ({
    type: SET_PHONE,
    payload: payload
})

export const setRoleToState = (payload:string) => ({
    type: SET_ROLE,
    payload: payload
})

export const setisTableLoadingTrue = () => ({
    type: SET_IS_EMPLOYEE_TABLE_LOADING_TRUE
});

export const resetEmployeeData = () => ({
    type: RESET_EMPLOYEE_DETAILS
})

export const setPopUpTrue = () => ({
    type: SET_POPUP_TRUE
})

export const setSuccessTrue = () => ({
    type: SET_SUCCESS_TRUE
})

export const setWarningTrue = () => ({
    type: SET_WARNING_TRUE
})

export const setSuccessFalse = () => ({
    type: SET_SUCCESS_FALSE
})

export const setWarningFalse = () => ({
    type: SET_WARNING_FALSE
})

export const setErrorMessage = (payload:any) => ({
    type: SET_ERROR_MESSAGE,
    payload: payload
})

export const setisTableLoadingFalse = () => ({
    type: SET_IS_EMPLOYEE_TABLE_LOADING_FALSE
});

export const hideAlertPopUp = () => ({
    type: HIDE_ALERT_POPUP
})

export const deleteEmployee = (payload:any) => ({
    type: DELETE_EMPLOYEE_RECORD,
    payload: payload
})

export const getEmployeesTable = (limit:number, page:number) => {
    return (dispatch:any) => {
        dispatch(setisTableLoadingTrue());
        axios.get(`/system/employees?limit=${limit}&page=${page}`)
            .then(response => response.data)
            .then((response) => {
                dispatch(setEmployeesTableData(response));
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                dispatch(setisTableLoadingFalse());
            });

        // axios.get('/system/authorization/roles')
        //     .then((response) => { dispatch(setRoles(response.data.data)) })
        //     .catch((error) => {
        //         console.log(error);
        //     })
    };
};

export const getEmployeeRoles = () => {
    return (dispatch:any) => {
        axios.get('/system/authorization/roles')
            .then((response) => { dispatch(setRoles(response.data.data)) })
            .catch((error) => {
                console.log(error);
            });
    };
};

export const getCountryCodes = () => {
    return (dispatch:any) => {
        axios.get('/system/countries')
            .then((response) => { dispatch(setCountryCodes(response.data.data)); })
            .catch((error) => {
                console.log(error);
            });
    };
};

export const fetchEmployeesTable = (limit:number, page:number) => {
    debugger
    return (dispatch:any) => {
        dispatch(setisTableLoadingTrue());
        axios.get(`/system/employees?limit=${limit}&page=${page}`)
            .then(response => response.data)
            .then((response) => {
                dispatch(addEmployeesTableData(response));
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                dispatch(setisTableLoadingFalse());
            });
    }
}

export const setFirstName = (firstName:string) => {
    return (dispatch:any) => {
        dispatch(setFirstNameToState(firstName));
    }
}

export const setLastName = (lastName:string) => {
    return (dispatch:any) => {
        dispatch(setLastNameToState(lastName));
    }
}

export const setEmail = (email:string) => {
    return (dispatch:any) => {
        dispatch(setEmailToState(email));
    }
}

export const setPhoneCountry = (code:string) => {
    return (dispatch:any) => {
        dispatch(setPhoneCountryToState(code));
    }
}


export const setPhone = (phone:string) => {
    return (dispatch:any) => {
        dispatch(setPhoneToState(phone));
    }
}

export const setRole = (role:string) => {
    return (dispatch:any) => {
        dispatch(setRoleToState(role));
    }
}

export const submitNewEmployeeDetails = (data?:any) => {
    const { first_name, last_name, email, phone, selectedRole, phoneCountry, roles } = store.getState().employeesState;
    let empDetails = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "phone_country": phoneCountry,
        "phone": phone,
        "role": selectedRole.map((id:any) => {
            const index = roles.findIndex((role:any) => id === role.id)
            return roles[index]
        })
    }
    return (dispatch:any) => {
        axios.post('/system/employees', empDetails)
        .then((res) => {
            dispatch(setPopUpTrue());
            dispatch(setSuccessTrue());
            dispatch(setWarningFalse());
            dispatch(resetEmployeeData());
        })
            .catch((error) => {
                dispatch(resetEmployeeData());
                dispatch(setWarningTrue());
                dispatch(setSuccessFalse());
                dispatch(setPopUpTrue());
                dispatch(setErrorMessage(error.response.data.message))
            })
    }
}

export const setSubmitButtonStatus = () => {
    return (dispatch:any) => {
        const { first_name, last_name, email, phone, phoneCountry, selectedRole } = store.getState().employeesState;
        if(!first_name || !last_name || !email || !phone || !phoneCountry || selectedRole.length === 0){
            dispatch(disableSubmit())
        }else if (first_name && last_name && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && phone && selectedRole.length > 0){
            dispatch(enableSubmit())
        }
    }
}

export const cancelAlertPopUp = () => {
    return (dispatch:any) => {
        dispatch(hideAlertPopUp())
    }
}
