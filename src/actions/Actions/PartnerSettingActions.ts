import axios from "../../util/Api";
import {default as APICALL} from 'axios';

import {
  SET_SERVICEPOINT_DETAILS,
  SET_ADDRESS_LINE_ONE,
  SET_ADDRESS_LINE_THREE,
  SET_PARTNER_PHONE,
  SET_PARTNER_EMAIL,
  SET_PARTNER_PHONE_TWO,
  SET_PARTNER_CONTACT,
  SET_PARTNER_WEBSITE,
  SET_PARTNER_DESCRIPTION,
  SET_PARTNER_COC,
  UPDATE_SERVICEPOINT_DETAILS,
  START_PARTNER_LOADING,
  STOP_PARTNER_LOADING,
  SET_ERROR,
  RESET_ERROR,
  SET_PARTNER_VISIBILITY,
  SET_PARTNER_TYPE_ID,
  SET_PARTNER_NAME,
  SET_PARTNER_STREET,
  SET_PARTNER_CITY,
  SET_PARTNER_STREET_NUMBER,
  SET_PARTNER_ZIPCODE
} from "../../constants/ActionTypes";

export const getPartnerSettingDetails = (history, companyId?: string | null) => {
  return (dispatch: any) => {
    let url = "/settings";
    if (companyId) {
      url = `/service-points/${companyId}`;
    }
    axios.get(url)
      .then((response) => {
        dispatch({type: SET_SERVICEPOINT_DETAILS, payload: response.data.data});
        dispatch({type: SET_ADDRESS_LINE_ONE, payload: response.data.data.street});
        dispatch({type: SET_ADDRESS_LINE_THREE, payload: response.data.data.country});
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          history.replace('/partner/settings/error/404');
        }
      })
  }
}

export const updatePartnerAvatar = (id: string, avatar: File, isPartners: boolean, callBack: (type: string, response: string) => void) => {
  callBack('loading', '')
  return (dispatch: any) => {
    const partnerUrl = "/settings/avatar"
    axios.get(isPartners ? partnerUrl : `/service-points/${id}/avatar/issue-upload-link`)
      .then((response: any) => {
        APICALL.put(response.data.upload_url, avatar, {
          headers: {
            'Content-Type' : avatar.type
          }
        })
          .then((res: any) => {
            axios.post(isPartners ? partnerUrl : `/service-points/${id}/avatar`, {id: response.data.id})
              .then((response) => {
                if (response.data.success) {
                  callBack('response', 'Avatar Update Successfully.')
                } else {
                  callBack('response', 'Something Went Wrong')
                }
              })
              .catch((error) => {
                callBack('fail', 'Something Went Wrong')
              })
          })
          .catch((error: any) => {
            callBack('fail', 'Something Went Wrong')
          })
      })
      .catch((error: any) => {
        callBack('fail', 'Something Went Wrong')
        // if (error.response && error.response.status === 404) {
        //   history.replace('/partner/settings/error/404');
        // }
      })
  }
}

export const updatePartnerDetails = (id: string, payload: object, isPartners: boolean, callback?: (res)=> void) => {
  return (dispatch: any) => {
    dispatch({type: START_PARTNER_LOADING})
    const url = isPartners ? "/settings" : `/service-points/${id}`;
    axios.patch(url, payload)
      .then((response: any) => {
        if (callback) {
          callback(response)
        }
        dispatch({type: UPDATE_SERVICEPOINT_DETAILS, payload: response.data.data});
        dispatch({type: STOP_PARTNER_LOADING})
      })
      .catch((error: any) => {
        dispatch({type: SET_ERROR, payload: error.response ? error.response.data.message : "Something went wrong."});
      })
  }
}

export const resetLoadingError = () => {
  return (dispatch: any) => {
    dispatch({type: RESET_ERROR});
  }
};

export const setPhone = (payload: string) => ({
  type: SET_PARTNER_PHONE,
  payload: payload
});

export const setContact = (payload: string) => ({
  type: SET_PARTNER_CONTACT,
  payload: payload
});

export const setEmail = (payload: string) => ({
  type: SET_PARTNER_EMAIL,
  payload: payload
});

export const setPhoneTwo = (payload: string) => ({
  type: SET_PARTNER_PHONE_TWO,
  payload: payload
})

export const setWebsite = (payload: string) => ({
  type: SET_PARTNER_WEBSITE,
  payload: payload
})

export const setDescription = (payload: string) => ({
  type: SET_PARTNER_DESCRIPTION,
  payload: payload
})

export const setCoc = (payload: string) => ({
  type: SET_PARTNER_COC,
  payload: payload
})

export const setName = (payload: string) => ({
  type: SET_PARTNER_NAME,
  payload: payload
})

export const setStreet = (payload: string) => ({
  type: SET_PARTNER_STREET,
  payload: payload
})

export const setCity = (payload: string) => ({
  type: SET_PARTNER_CITY,
  payload: payload
})

export const setStreetNumber = (payload: string) => ({
  type: SET_PARTNER_STREET_NUMBER,
  payload: payload
})

export const setZipcode = (payload: string) => ({
  type: SET_PARTNER_ZIPCODE,
  payload: payload
})

export const setVisibility = (payload: number) => ({
  type: SET_PARTNER_VISIBILITY,
  payload: payload
})

export const setServicePointTypeId = (payload: number) => ({
  type: SET_PARTNER_TYPE_ID,
  payload: payload
})

export const updateOpeningHourAction = (id: string, payload: object, isPartners) => {
  return (dispatch: any) => {
    dispatch({type: START_PARTNER_LOADING})
    const url = isPartners ? "/settings/opening-hours": `/service-points/${id}/opening-hours`;
    axios.patch(url, JSON.stringify(payload))
        .then((response: any) => {
          dispatch({type: UPDATE_SERVICEPOINT_DETAILS, payload: response.data.data});
          dispatch({type: STOP_PARTNER_LOADING})
        })
        .catch((error: any) => {
          dispatch({type: SET_ERROR, payload: error.response ? error.response.data.message : "Something went wrong."});
        });
  }
};
