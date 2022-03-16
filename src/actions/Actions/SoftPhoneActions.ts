import axios from "../../util/Api";
import {
  OPENDIAL,
  DIAL_NUMBER,
  SAVE_DEVICE_TOKEN,
  INCREMENT_CALL_TIMER,
  ESTABLISH_CALL,
  TOGGLE_MUTE,
  CALL_DISCONNECT,
  SET_DEVICE_READY,
  SHOW_POPUP,
  HIDE_POPUP,
  SHOW_CALL_LISTENING_POPUP,
  HIDE_CALL_LISTENING_POPUP,
  SET_CALL_INIT_FALSE,
  ON_CALL_NUMBERPAD,
  INCOMING_CALL,
  REJECT_CALL,
  GET_AGENT,
  GET_AGENT_FAIL,
  SET_CALL_INVITE_ERROR,
  RESET_CALL_INVITE_ERROR,
  CALL_CONNECTED,
  CALL_HOLD,
  ACTIVE_CALL_NUMBERPAD_TOGGLE,
  SET_CALLER_NAME,
  SET_CALLER_AVATAR,
  ACTIVE_CALL_FORWARDPAD_TOGGLE,
  START_CALLHISTORY_LOADING,
  GET_CALLHISTORY_DATA,
  GET_CALLHISTORY_ERROR,
  CLEAR_CALLHISTORY_DATA, GET_AGENTS_NUMBERS
} from "constants/ActionTypes";
import { DEVICE_TOKEN } from "../../constants/localStorageKeys";
import {ISoftPhone} from "../Interface/SoftPhoneInterface";

let callTimer:any = null;

export const openDialPad = (data?:object | undefined) => ({
  type: OPENDIAL
});

export const onCallNumberPadToggle = () => ({
  type: ON_CALL_NUMBERPAD
});

export const onActiveCallPadToggle = () => ({
  type: ACTIVE_CALL_NUMBERPAD_TOGGLE
});

export const onForwardPadToggle = () => ({
  type: ACTIVE_CALL_FORWARDPAD_TOGGLE
});

export const saveDeviceToken = (payload:object) => ({
  type: SAVE_DEVICE_TOKEN,
  payload
});

export const getPhoneAgents = () => {
  return (dispatch: any) => {
    axios
      .get("/system/phone-system/agents")
      .then(response => {
        // console.log('response', response)
        dispatch({
          type: GET_AGENTS_NUMBERS,
          payload: response.data.data
        });
      })
      .catch(error => {
        console.error(`Error code- ${error.status_code}, while getting agents numbers`, error);
        dispatch(setShowAlertPopup(error.message));
      });
  }
}

export const callTransfer = (origin: number, destination: number) => {
  const params = {
    origin,
    destination
  };
  return (dispatch: any) => {
    axios
      .post("/system/phone-system/call-transfer", params)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(`Error code- ${error.status_code}, while transferring call`, error);
        dispatch(setShowAlertPopup(error.message));
      })
  }
}

export const callListen = (payload: Object) => {
  return (dispatch: any) => {
    axios
      .post("/system/phone-system/call-listen", payload)
      .then(response => {
        console.log(response);
        dispatch(onForwardPadToggle());
      })
      .catch(error => {
        console.error(`Error code- ${error.status_code}, while transferring call`, error);
        dispatch(setShowAlertPopup(error.message));
      })
  }
}

export const forwardCallAction = (id: number) => {
  const params = {
    extension_id: id
  };
  return (dispatch: any) => {
    axios
      .put("/phone-system/forward-call", params)
      .then(response => {
        console.log('response', response)
      })
      .catch(error => {
        console.error(`Error code- ${error.status_code}, while forwarding the call`, error);
        dispatch(setShowAlertPopup(error.message));
      });
  }
}

export const getDeviceToken = (softPhoneService:ISoftPhone) => {
  return (dispatch:any) => {
    axios
      .post("system/phone-system/issue-token", null)
      .then(response => {
        if (response.data && response.data.token) {
          localStorage.setItem(DEVICE_TOKEN, JSON.stringify(response.data));
          dispatch(saveDeviceToken(response.data));
          // softPhoneService.setup(
          //   response.data.token,
          //   setDeviceReady
          // );
        }
      })
      .catch(error => {
        console.error(`Error code- ${error.status_code}, while getting capability token`, error);
        dispatch(setShowAlertPopup(error.message));
      });
  };
};

export const dialNumber = (payload: string) => {
  return (dispatch:any) => {
    dispatch({
      type: DIAL_NUMBER,
      payload
    });
    dispatch(onCallStart('out'));
  };
};

export const getSoftphoneAgentAction = () => {
  return (dispatch:any) => {
    axios
      .get("/system/phone-system/credentials")
      .then(response => {
        localStorage.setItem('softPhoneAgent',JSON.stringify(response.data.data));
        dispatch({
          type: GET_AGENT,
          payload: response.data.data
        });

      })
      .catch(error => {
        const softPhoneAgent = <any>localStorage.getItem('softPhoneAgent');
        dispatch({
          type: GET_AGENT,
          payload: JSON.parse(softPhoneAgent || [])
        });
        // dispatch({
        //   type: GET_AGENT_FAIL,
        // });
      });
  };
};

export const incrementCallTimer = () => ({
  type: INCREMENT_CALL_TIMER
});

export const onCallStart = (callType: string) => ({
  type: ESTABLISH_CALL,
  payload: callType
});

export const setCallerName = (caller: string) => ({
  type: SET_CALLER_NAME,
  payload: caller
});

export const setAvatar = (avatar: string) => ({
  type: SET_CALLER_AVATAR,
  payload: avatar
});

export const onCall = (callType: string) => ({
  type: ESTABLISH_CALL,
  payload: callType
});

export const onCallConnected = () => ({
  type: CALL_CONNECTED,
});

export const onCallReject = () => ({
  type: REJECT_CALL
});

export const onIncomingCallReceive = (name: string) => ({
  type: INCOMING_CALL,
  payload: name
});

export const muteToggle = () => ({
  type: TOGGLE_MUTE
});

export const setDeviceReady = () => ({
  type: SET_DEVICE_READY
});

export const callDisconnect = () => {
  return (dispatch:any) => {
    dispatch({
      type: CALL_DISCONNECT
    });
    clearInterval(callTimer);
  };
};

export const holdAction = (action: boolean) => {
  return (dispatch:any) => {
    dispatch({
      type: CALL_HOLD,
      payload: action
    });
  };
};

export const callInviteError = (errorMsg: string) => {
  return (dispatch:any) => {
    dispatch({
      type: SET_CALL_INVITE_ERROR,
      payload: errorMsg
    });
  };
};
export const resetCallInviteError = () => {
  return (dispatch:any) => {
    dispatch({
      type: RESET_CALL_INVITE_ERROR
    });
  };
};

export const startCall = () => {
  return (dispatch:any) => {
    callTimer = setInterval(() => {
      // dispatch(incrementCallTimer());
    }, 1000);
  };
};

export const setShowCallListeningPopup = (payload: any) => ({
  type: SHOW_CALL_LISTENING_POPUP,
  payload
});

export const setDismissCallListeningPopUp = () => {
  return ({
    type: HIDE_CALL_LISTENING_POPUP
  });
}

export const setShowAlertPopup = (payload:any) => ({
  type: SHOW_POPUP,
  payload
});

export const setDismissAlertPopUp = () => {
  return ({
    type: HIDE_POPUP
  });
}
export const setCallInitFalse = () => {
  return ({
    type: SET_CALL_INIT_FALSE
  });
}

export const getCallHistoryAction = (page: number) => {
  return (dispatch:any) => {
    dispatch({type: START_CALLHISTORY_LOADING });
    axios.get(`/system/phone-system/call-histories?page=${page}`)
      .then(response => {
        dispatch({ type: GET_CALLHISTORY_DATA, payload: response.data })
      })
      .catch(error => {
        console.log(error.response)
        dispatch({ type: GET_CALLHISTORY_ERROR, payload: error.response.data.message})
      });
  };
};

export const clearCallHistoryAction = () => {
  return (dispatch:any) => {
    dispatch({type: CLEAR_CALLHISTORY_DATA })
  };
};

//------------ SIP

export const getInboundUserDetails = (phone: number) => {
  return (dispatch:any) => {
    axios.get(`/customers/searchphone?phone=${phone}`)
      .then(response => {
        return response;
      })
      .catch(error => {
        console.log(error.response);
      });
  };
};

