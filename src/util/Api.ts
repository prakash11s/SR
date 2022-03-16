import axios from 'axios';
import { store } from "../store";

import { addSelectedDepartment } from "./../actions/Actions/DepartmentActions";
import { redirectUserToLogin } from "../actions/Actions/Auth";
import { addSelectedServicepoint } from 'actions/Actions/servicepointDropdownAction';



let department = localStorage.getItem('department');
let locale:string | null = localStorage.getItem('locale');
let servicepoint = localStorage.getItem('servicepoint');
if (locale != null) {
    locale = JSON.parse(locale);
}
const api = axios.create({
    baseURL: window.location.href.indexOf("partner") > 0 ? process.env.REACT_APP_PARTNER_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...department ? ({ 'X-Department': department }) : {},
        ...servicepoint ? ({ 'on-behalf-of': servicepoint }) : {},
        'X-Country': locale ? locale['ISO'] : 'NL',
        'Accept-Language': locale ? locale['locale'] : 'nl'
        // 'X-Socket-ID' : window.Echo.socketId()
    }
});

api.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response && 401 === error.response.status) {
        localStorage.clear();
        store.dispatch(redirectUserToLogin());
    }
    return Promise.reject(error);
});

function setDepartmentKey(department) {
    const departmentKey = department.slug;
    store.dispatch(addSelectedDepartment(department));
    return departmentKey;
}

function setServicepointIdName(servicepoint) {
    const servicepointId = servicepoint.id;
    store.dispatch(addSelectedServicepoint(servicepoint));
    return servicepointId;
}

api.interceptors.request.use((config) => {
    const { departmentsList } = store.getState().department;
    let departmentKey;
    let department = localStorage.getItem('department') || null;
    const servicepointState = store.getState().servicepoint;
    const servicepointsList = servicepointState && servicepointState.servicepointsList;
    let servicepointId;
    let servicepoint = localStorage.getItem('servicepoint') || null;

    if (departmentsList.length === 0) {
        return config;
    }

    if (department) {
        const filteredDepartment = departmentsList.find(element => element.slug === department);
        departmentKey = filteredDepartment ? filteredDepartment.slug : setDepartmentKey(departmentsList[0]);
        config.headers['X-Department'] = departmentKey;
    } else {
        config.headers['X-Department'] = setDepartmentKey(departmentsList[0]);
    }

    if(servicepointsList.length === 0) {
        return config;
    }

    if (servicepoint) {
        const filteredServicepoint = servicepointsList.data.find(element => element.id === servicepoint);
        servicepointId = filteredServicepoint ? filteredServicepoint.id : setServicepointIdName(servicepointsList.data[0]);
        config.headers['on-behalf-of'] = servicepointId;
    } else {
        config.headers['on-behalf-of'] = setServicepointIdName(servicepointsList.data[0]);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
