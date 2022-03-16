import axios from "../../util/Api";
import { store } from "../../store";
import SipCallService from "components/Phone/SipCallService";
import { ICallQueue } from "actions/Interface/callQueueInterface";
import {
  CALL_QUEUE_LIST,
  SET_ACTIVE_CALLER,
  SET_CALL_QUEUE_STATUS,
  SET_NO_ACTION,
  SET_TIMER,
} from "constants/ActionTypes";
import { setShowMessageUrl } from "./NotificationActions";
import { TIMER } from "../../constants/common.constants";

let timer: any = null;
export const onHandleRescheduleConnectApi = ({
  id,
  time,
  onChangeHandlerId,
  callBack,
}: {
  id: string;
  time: string;
  onChangeHandlerId: number;
  callBack?: (status, response) => void;
}) => {
  return () => {
    axios
      .put(`/call-queues/entries/${id}/reschedule`, {
        timestamp: time,
        status_reason_code: onChangeHandlerId,
      })
      .then((response) => {
        if (callBack) callBack(true, response.data);
      })
      .catch((error) => {
        if (callBack)
          callBack(
            false,
            error.response
              ? error.response.data.message
              : "Something went wrong."
          );
      });
  };
};

export const setCallQueueList = (payload: object) => ({
  type: CALL_QUEUE_LIST,
  payload: payload,
});

export const getCallQueueList = (
  id: string,
  callBack: (status, response) => void
) => {
  return (dispatch) => {
    axios
      .get(`call-queues/${id}/entries/process?limit=1`)
      .then((response) => {
        if (response.data && response.data.data.length) {
          dispatch(
            setCallQueueList({
              data: response.data,
              id: response.data.data[0].call_queue_id,
            })
          );
        }
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getStatusCodes = (
  data: { reason: string; entryType: string },
  callBack: (status, response) => void
) => {
  return () => {
    axios
      .get(
        `call-queues/status-codes?reason_type=${data.reason}&entry_type=${data.entryType}`
      )
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const callQueueAction = (
  queueId,
  entryType,
  data: { action: string; status_reason_id: number },
  callBack: (status, response) => void
) => {
  return () => {
    axios
      .put(`call-queues/${queueId}/entries/${entryType}/action`, data)
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

const getPhoneCallData = ({ id, phone }: ICallQueue) => {
  return {
    id,
    phoneNumber: phone,
    type: "call-queue",
  };
};

export const makeIndividualCallFromQueue = (user) => {
  return (dispatch: any) => {
    if (
      store.getState().softPhone.deviceToken &&
      store.getState().softPhone.deviceToken.ttl &&
      Date.parse(store.getState().softPhone.deviceToken.ttl) <= Date.now()
    ) {
    }
    SipCallService.startCall(getPhoneCallData(user).phoneNumber);
  };
};

export const setNoAction = () => ({
  type: SET_NO_ACTION,
});

export const setTimer = (payload: boolean) => ({
  type: SET_TIMER,
  payload,
});

export const setActiveCallQueueAlert = (payload: any) => {
  return (dispatch: any) => {
    dispatch(setShowMessageUrl(payload));
  };
};

export const goToNextCallInQueue = (resume: boolean = false) => {
  return (dispatch: any) => {
    let callQueueState = store.getState().callQueueState;
    const { callQueueStatus } = callQueueState;
    if (callQueueStatus) {
      if (!resume) {
        dispatch(setNoAction());
      }
      dispatch(setActiveCaller());
      let callQueueState = store.getState().callQueueState;
      const { callQueueStatus, activeCaller } = callQueueState;
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
      // }
    } else {
      if (resume) {
        dispatch(setActiveCaller());
      }
      dispatch(setNoAction());
    }
  };
};

export const setCallQueueStatus = (payload: boolean) => {
  return (dispatch: any) => {
    if (!payload) {
      clearTimeout(timer);
      dispatch(setTimer(false));
    }
    dispatch({
      type: SET_CALL_QUEUE_STATUS,
      payload,
    });
  };
};

export const setActiveCaller = (payload: boolean = false) => ({
  type: SET_ACTIVE_CALLER,
  payload,
});

export const resumeCallQueue = () => {
  return (dispatch: any) => {
    dispatch(setCallQueueStatus(true));
    dispatch(setActiveCaller());
    const callQueueState = store.getState().callQueueState;
    const { activeCaller } = callQueueState;
    if (activeCaller) {
      connectCallInQueue(activeCaller);
    }
  };
};

export const connectCallInQueue = (activeCaller: ICallQueue) => {
  SipCallService.startCall(getPhoneCallData(activeCaller).phoneNumber);
  //softPhoneService.connectCall(getPhoneCallData(activeCaller));
};
