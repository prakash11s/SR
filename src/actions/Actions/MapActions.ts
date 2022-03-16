import axios from "../../util/Api";

export const getServicePointList = (payload: any, callBack:(result: string, response: any) => void) => {
	let data = '';
	if(payload){
		data = `?data=${payload}`
	}
	return (dispatch: any) => {
		axios.get(`/service-points/coordinates${data}`)
			.then((response) => {
				callBack('success', response.data && response.data.data || [])
			})
			.catch((error: any) => {
				callBack('fail', error.response && error.response.data.message || 'something went wrong')
			})
	}
};

export const dispatchSingleCoordinate = (id: string, callBack:(result: string, response: any) => void) => {
	return (dispatch: any) => {
		axios.get(`/service-points/${id}`)
			.then((response) => {
				callBack('success', response.data && response.data.data || [])
			})
			.catch((error: any) => {
				callBack('fail', error.response && error.response.data.message || 'something went wrong')
			})
	}
};

export const fetchCategories = (callBack: (result: string,  response: any)=> void) => {
	return (dispatch: any) => {
		axios.get(`/service-points/types`).then((response=> {
			callBack('success', response && response.data.data || [])
		})).catch((error: any)=>{
			callBack('failed', error.response && error.response.data.message || 'something went wrong')
		})
	}
}
export const fetchPoints = (callBack: (result: string,  response: any)=> void) => {
	return (dispatch: any) => {
		axios.get(`/service-points/recognitions`).then((response=> {
			callBack('success', response && response.data  && response.data.data || [])
		})).catch((error: any)=>{
			callBack('failed', error.response && error.response.data.message || 'something went wrong')
		})
	}
}
export const fetchPrices = (callBack: (result: string,  response: any)=> void) => {
	return (dispatch: any) => {
		axios.get(`/services/prices`).then((response=> {
			callBack('success', response && response.data && response.data.data || [])
		})).catch((error: any)=>{
			callBack('failed', error.response && error.response.data.message || 'something went wrong')
		})
	}
}