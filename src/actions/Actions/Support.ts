import {
  SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES,
    SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES_META,
  SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES_RECORDINGS
} from "../../constants/ActionTypes";
import axios from "../../util/Api";

export const setPhoneCallHistories = (payload:any) => ({
  type: SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES,
  payload: payload
});

/**
 * get phone system call histories
 * @param page
 * @param limit
 * @returns {function(...[*]=)}
 */
export const getPhoneSystemCallHistories = (page:number, limit:number) => {
  return (dispatch:any) => {

    axios.get(`system/phone-system/call-histories?page=${page}&limit=${limit}`)
      .then((response) => {
        dispatch(setPhoneCallHistories(response.data.data));
        dispatch({ type: SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES_META, payload: response.data.meta });
      }).catch(function (error) {

    });
  }
};

/**
 * get phone system call histories recording
 * @param id
 * @returns {function(...[*]=)}
 */
export const getPhoneSystemCallHistoriesRecordings = (id:any) => {
  return (dispatch:any) => {
    axios.get(`system/phone-system/call-histories/recordings?id=${id}`)
      .then((response) => {
        dispatch({ type: SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES_RECORDINGS , payload: response.data.location, historyId: id});
      }).catch(function (error) {
    });
  }
};

export const getMaintenanceInfo = (licenseplate: string, service_id: number, callBack:(response: string, data: any) => void) => {
	return () => {
		axios.get(`/vehicle-information-service/calculate-maintenance?license-plate=${licenseplate}&service_id=${service_id}`)
			.then((response) => {
				callBack('success', response.data.data)
			})
			.catch((error: any) => {
				callBack('danger',error.response.data.message)
			})
	}
};
