import axios from "../../util/Api";
import {store} from "../../store";
import softPhoneService from '../../components/Phone/softPhone.service';
import {
    CALL_QUEUE_LIST,
    TOGGLE_ALERT_PROMPT,
    SET_CALL_QUEUE_OVERVIEW_DATA,
    SET_CALL_QUEUE_ID,
    TOGGLE_SPINNER,
    SET_CALL_QUEUE_STATUS,
    SET_ACTIVE_CALLER,
    SET_TIMER,
    SET_NO_ACTION,
    SET_ACTIVE_CALLER_AFTER_DELETE,
    SET_PROMPT_SHOW,
    SET_COMMENTS_DATA,
    SET_CALL_QUEUE_LOADER_FALSE,
    SET_SNACKBAR_TRUE,
    SET_CALL_QUEUE_ID_DATA,
    EDIT_CALL_QUEUE_NAME,
    EDIT_CALL_QUEUE_DESCRIPTION,
    EDIT_CALL_QUEUE_DEPARTMENT,
    EDIT_CALL_QUEUE_ORDER,
    EDIT_CALL_QUEUE_SUCCESS_TOGGLE,
    EDIT_CALL_QUEUE_WARNING_TOGGLE,
    TOGGLE_ALERT_POPUP,
    /**
     * HIDING IT FOR FUTURE USE
     */
    // EDIT_CALL_QUEUE_CREATED_AT,
    // EDIT_CALL_QUEUE_UPDATED_AT,
    // EDIT_CALL_QUEUE_IMAGE,
    // EDIT_CALL_QUEUE_ID,
} from "constants/ActionTypes";
import { TIMER } from '../../constants/common.constants';
import { setShowMessageUrl } from './NotificationActions';
import {  getDeviceToken } from "./SoftPhoneActions";
import { ICallQueue,IHistory,IRescheduleConnect } from "../Interface/callQueueInterface";
import { IdataObj } from 'components/CallQueueCommentPopup/Interface/IndexInterface';
import SipCallService from "../../components/Phone/SipCallService";

let timer:any = null;

export const toggleSpinner = (payload:boolean) => {

    return (dispatch:any) => {
        dispatch({ type: TOGGLE_SPINNER, payload })
    }
};

export const setCallQueueList = (payload:object) => ( {
    type: CALL_QUEUE_LIST,
    payload: payload
});

export const setCallQueueId = (payload:number) => ({
    type: SET_CALL_QUEUE_ID,
    payload: payload,
});


const getPhoneCallData = ({ id, phone }:ICallQueue) => {
    return  {
    id,
    phoneNumber: phone,
    type: 'call-queue'
}};


export const makeIndividualCallFromQueue = (user:ICallQueue) => {

    return (dispatch:any) => {
        const { callQueueStatus } = store.getState().callQueueState;
        if (!callQueueStatus) {
            if (
                store.getState().softPhone.deviceToken &&
                store.getState().softPhone.deviceToken.ttl &&
                Date.parse(store.getState().softPhone.deviceToken.ttl) <= Date.now()
              ) {
                //store.dispatch(getDeviceToken(softPhoneService));
              }
            SipCallService.startCall(getPhoneCallData(user).phoneNumber);
            //softPhoneService.connectCall(getPhoneCallData(user));
        }
    };
};

export const setCallQueueListStartAsync = (history?:IHistory | any, Id?:string) => {
    let id:any;
    if (Id) {
        id = Id
    } else {
        id = store.getState().callQueueState.callQueueId;
    }
    return (dispatch:any) => {
        dispatch(toggleSpinner(true));
        axios.get(`call-queues/${id}/entries/process?limit=3`)
            .then((response) => {
                dispatch(setCallQueueList({ data: response.data, id: id }));
                dispatch(toggleSpinner(false));
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    history.replace('/support/call-queues/error/403');
                    dispatch(toggleSpinner(false));
                }
            })
            .finally(() => {
                dispatch(toggleSpinner(false));
            })
    };
};

export const setActiveCallerAfterDelete = (payload:string) => ({
    type: SET_ACTIVE_CALLER_AFTER_DELETE,
    payload
});


export const onHandleDelete = (id:string, history:object) => {
    return (dispatch:any) => {
        dispatch(toggleSpinner(true));
        axios.delete(`call-queues/entries/${id}`)
            .then((response) => {
                dispatch(setActiveCallerAfterDelete(id));
                dispatch(setCallQueueListStartAsync(history));
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                dispatch(toggleSpinner(false));
            })
    }
}

export const onHandleReschedule = () => {
    return (dispatch:any) => {
        dispatch({ type: TOGGLE_ALERT_PROMPT });
    }
};

export const onHandleUnsubscribe = () => {
    return (dispatch:any) => {
        dispatch(setPromptShow());
    }
};
export const setPromptShow = () => ({
    type: SET_PROMPT_SHOW,
});

export const toggleAlertPrompt = () => ({
    type: TOGGLE_ALERT_PROMPT,
});

export const onHandleRescheduleConnectApi = ({ id, time, history, onChangeHandlerId }:IRescheduleConnect) => {

    return (dispatch:any) => {
        dispatch(toggleAlertPrompt());
        dispatch(toggleSpinner(true));
        axios.put(`/call-queues/entries/${id}/reschedule`, { timestamp: time, status_reason_code: onChangeHandlerId })
            .then((response) => {
                dispatch(setActiveCallerAfterDelete(id));
                dispatch(setCallQueueListStartAsync(history));
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                dispatch(toggleSpinner(false));
            })
    };
};

export const onHandleApprove = (id:string, history:object) => {
    return (dispatch:any) => {
        dispatch(toggleSpinner(true));
        axios.put(`/call-queues/entries/${id}/approve`)
            .then(response => {
                dispatch(setActiveCallerAfterDelete(id));
                dispatch(setCallQueueListStartAsync(history));
            })
            .catch(error => console.log(error)).finally(() => {
                dispatch(toggleSpinner(false));
            });
    }
}

export const onHandleReject = () => {
    return (dispatch:any) => {
        dispatch(setPromptShow());
    }
};


export const onHandleRejectConnectApi = (id:string, history:object, onChangeHandlerId:number) => {

    return (dispatch:any) => {
        dispatch(setPromptShow());
        dispatch(toggleSpinner(true));
        axios.put(`call-queues/entries/${id}/reject`, { status_reason_code: onChangeHandlerId })
            .then((response) => {
                dispatch(setActiveCallerAfterDelete(id));
                dispatch(setCallQueueListStartAsync(history));
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                dispatch(toggleSpinner(false));
            });
    }
};

export const onHandleUnsubscribeConnectApi = (id:string, history:object, onChangeHandlerId:number) => {
    return (dispatch:any) => {
        dispatch(setPromptShow());
        dispatch(toggleSpinner(true))
        axios.put(`/call-queues/entries/${id}/unsubscribe`, { status_reason_code: onChangeHandlerId })
            .then((response) => {
                dispatch(setActiveCallerAfterDelete(id));
                dispatch(setCallQueueListStartAsync(history));
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                dispatch(toggleSpinner(false));
            });
    }
}

export const setCallQueueOverviewData = (payload:[]) => ({
    type: SET_CALL_QUEUE_OVERVIEW_DATA,
    payload: payload
});

export const getCallQueueOverviewTable = () => {
    return (dispatch:any) => {
        axios.get('/call-queues')
            .then(response => response.data)
            .then((response) => {
                dispatch(setCallQueueOverviewData(response.data));
            })
            .catch((error) => {
                dispatch({ type: SET_CALL_QUEUE_LOADER_FALSE });
                if (error.response && error.response.status === 500) {
                    dispatch({ type: SET_SNACKBAR_TRUE });
                }
                console.log(error);
            }).finally(() => {
            });
    }
}

export const setCallQueueStatus = (payload:boolean) => {
    return (dispatch:any) => {
        if (!payload) {
            clearTimeout(timer);
            dispatch(setTimer(false));
        }
        dispatch({
            type: SET_CALL_QUEUE_STATUS,
            payload
        });
    }

};

export const setActiveCaller = (payload:boolean = false) => ({
    type: SET_ACTIVE_CALLER,
    payload
});

export const connectCallInQueue = (activeCaller:ICallQueue) => {
    SipCallService.startCall(getPhoneCallData(activeCaller).phoneNumber);
    //softPhoneService.connectCall(getPhoneCallData(activeCaller));
}

export const resumeCallQueue = () => {
    return (dispatch:any) => {
        dispatch(setCallQueueStatus(true));
        dispatch(setActiveCaller());
        const callQueueState = store.getState().callQueueState;
        const { activeCaller } = callQueueState;
        if (activeCaller) {
            connectCallInQueue(activeCaller);
        }
    };
}

export const setTimer = (payload:boolean) => ({
    type: SET_TIMER,
    payload
});

export const setActiveCallQueueAlert = (payload:any) => {
    return (dispatch:any) => {
        dispatch(setShowMessageUrl(payload));
    };
}
export const setNoAction = () => ({
    type: SET_NO_ACTION
});

export const goToNextCallInQueue = (resume:boolean = false) => {
    return (dispatch:any) => {
        let callQueueState = store.getState().callQueueState;
        const { callQueueStatus, callQueueId } = callQueueState;
        if (callQueueStatus) {
            if (!resume) {
                dispatch(setNoAction());
            }
            dispatch(setActiveCaller());
            let callQueueState = store.getState().callQueueState;
            const { callQueueStatus, activeCaller } = callQueueState;
            if ((window.location.pathname !== `/support/call-queues/${callQueueId}/process`) && activeCaller) {
                store.dispatch(setCallQueueStatus(false));
                dispatch(setActiveCaller(true));
                store.dispatch(setActiveCallQueueAlert({ url: `/support/call-queues/${callQueueId}/process?start=true`, message: "Go to call queue" }))
            } else {
                // Timer of 10s
                if (callQueueStatus && activeCaller) {
                    dispatch(setTimer(true));
                    timer = setTimeout(() => {
                        dispatch(setTimer(false));
                        connectCallInQueue(activeCaller);
                        clearTimeout(timer);
                    }, TIMER.QUEUE_WAIT);
                } else {
                    dispatch(setTimer(false));
                    dispatch(setCallQueueStatus(false));
                }
            }
        } else {
           if(resume) {
            dispatch(setActiveCaller());
           }
            dispatch(setNoAction());
        }
    }
}

export const goToNextCallImmediate = () => {
    return (dispatch:any) => {
        let callQueueState = store.getState().callQueueState;
        const { activeCaller } = callQueueState;
        clearTimeout(timer);
        dispatch(setTimer(false));
        connectCallInQueue(activeCaller);
    };
}

export const setCommentsData = (payload:Array<any>) => {
    return  {
    type: SET_COMMENTS_DATA,
    payload: payload
}};

export const setCallQueueComments = (callQueueItems: IdataObj[]) => {
    return (dispatch:any) => {
        dispatch(setCommentsData(callQueueItems));
    }
}

export const setCallQueueIdData = (id) => {
    return (dispatch:any) => {
        axios.get(`/call-queues/${id}`)
        .then((response) => {
            dispatch(setActiveCallerAfterDelete(id));
            dispatch({type: SET_CALL_QUEUE_ID_DATA, payload: response.data.data});
        })
        .catch((error) => {console.log(error)})
    }
}


export const setName = (payload: string) => ({
    type: EDIT_CALL_QUEUE_NAME,
    payload: payload
});

export const setDescription = (payload: string) => ({
    type: EDIT_CALL_QUEUE_DESCRIPTION,
    payload: payload
});

export const setOrder = (payload: number) => ({
    type: EDIT_CALL_QUEUE_ORDER,
    payload: payload
});

export const setDepartment = (payload: string) => ({
    type: EDIT_CALL_QUEUE_DEPARTMENT,
    payload: payload
});

/**
 * HIDING THE BELOW ACTIONS FOR FUTURE USE
 */

// export const setId = (payload: number) => ({
//     type: EDIT_CALL_QUEUE_ID,
//     payload: payload
// });

// export const setImage = (payload: string) => ({
//     type: EDIT_CALL_QUEUE_IMAGE,
//     payload: payload
// });

// export const setCreatedAt = (payload: string) => ({
//     type: EDIT_CALL_QUEUE_CREATED_AT,
//     payload: payload
// });

// export const setUpdatedAt = (payload: string) => ({
//     type: EDIT_CALL_QUEUE_UPDATED_AT,
//     payload: payload
// });


export const toggleAlertPopUp = () => ({
    type: TOGGLE_ALERT_POPUP
});

export const saveEditedData = (id, order, name, description) => {
    return (dispatch:any) => {

     const data =  {
             "order": order,
             "name": name,
             "description": description
          }

        axios.patch(`/call-queues/${id}`, data)
            .then(response => {
                dispatch({ type: EDIT_CALL_QUEUE_SUCCESS_TOGGLE })
            })
            .catch(error => {
                dispatch({ type: EDIT_CALL_QUEUE_WARNING_TOGGLE })
            })
    }
}
