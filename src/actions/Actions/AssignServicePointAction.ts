import axios from "../../util/Api";

export const getServicePointDetailAction = (servicePoint: string, callBack:(result:string, response: any) => void) => {
	return (dispatch: any) => {
		axios.get(`service-points/${servicePoint}`)
			.then((response) => {
				callBack('success', response?.data?.data)
			})
			.catch((error: any) => {
				callBack('fail', error?.response?.data?.message)
			})
	}
};

export const getOrderDetailAction = (orderId: string, callBack:(result:string, response: any) => void) => {
	return (dispatch: any) => {
		axios.get(`/orders/${orderId}`)
			.then((response) => {
				callBack('success', response.data)
			})
			.catch((error: any) => {
				callBack('fail', error.response.data.message)
			})
	}
};

export const getServicePointListAction = (search: string, callBack:(result: string, response: any) => void) => {
	return (dispatch: any) => {
		axios.get(`service-points?query=${search}&limit=20`)
			.then((response) => {
				callBack('success', response.data.data)
			})
			.catch((error: any) => {
				callBack('fail', error.response.data.message)
			})
	}
};

export const getOrderListAction = (search: string, callBack:(result: string, response: any) => void) => {
	return (dispatch: any) => {
		axios.get(`/orders?query=${search}&limit=10`)
			.then((response) => {
				callBack('success', response.data.data)
			})
			.catch((error: any) => {
				callBack('fail', error.response.data.message)
			})
	}
};

export const assignServicePointAction = (servicePointId: string, orderId:string, preferred_dates:string, callBack:(response: string, msg: string) => void) => {
	let data = {};
	if(preferred_dates !== "")
        data = {service_point_id: servicePointId, preferred_dates: [preferred_dates.toString()]};
	else
        data = {service_point_id: servicePointId};

	return (dispatch: any) => {
		axios.put(`/orders/${orderId}/assign-to-service-point`, data)
			.then((response) => {
				callBack('success','')
			})
			.catch((error: any) => {
				callBack('danger',error.response.data.message)
			})
	}
};
