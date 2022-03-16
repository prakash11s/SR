import {
    OPENDIAL,
    DIAL_NUMBER,
    ESTABLISH_CALL,
    INCREMENT_CALL_TIMER,
    TOGGLE_MUTE,
    CALL_DISCONNECT,
    SET_DEVICE_READY,
    SAVE_DEVICE_TOKEN,
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
    CLEAR_CALLHISTORY_DATA,
    GET_CALLHISTORY_ERROR, GET_AGENTS_NUMBERS
} from '../../constants/ActionTypes';
import { DEVICE_TOKEN } from "../../constants/localStorageKeys";
import { ISoftPhoneReducer } from "../Interface/SoftphoneReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState:ISoftPhoneReducer = {
    VolumeLevel: 5,
    deviceReady: false,
    deviceToken: JSON.parse(<string>localStorage.getItem(DEVICE_TOKEN)) || null,
    Call: {
        showHistory: false,
        hasActivePhoneCall: false, // will be true when user is on call and at that time ongoing call pad will be displayed
        showNumberPad: false,
        showOngoingCallPad: false,
        currentCallDuration: 0,
        hasInComingPhoneCall: false,
        showInComingPhoneCall: false,
        callerName: '',
        inviteError: false,
        inviteErrorMsg: '',
        showActiveCallNumberPad: false,
        showForwardPad: false,
        callType: '',
        callerImage: ''
    },
    softPhoneAgent: [],
    muted: false,
    phoneNumber: "",
    showPopup: false,
    showCallListeningPopup: false,
    listenPhoneNumber: "",
    popupMessage: null,
    callInit: false,
    onHold: false,
    callHistory: {
        callList: [],
        meta: {},
        loading: false,
        error: ''
    },
    agentNumbers: []
    // onCallNumberPad: false
};

export default (state:ISoftPhoneReducer = initialState, { type, payload }:IAction) => {
    switch (type) {
        case OPENDIAL:
            if (state.Call.hasActivePhoneCall) {
                return { ...state, Call: { ...state.Call, showOngoingCallPad: !state.Call.showOngoingCallPad, showActiveCallNumberPad:false  } }
            }
            else if (state.Call.hasInComingPhoneCall) {
                return { ...state, Call: { ...state.Call, showInComingPhoneCall: !state.Call.showInComingPhoneCall, showActiveCallNumberPad:false } }
            }
            else {
                return { ...state, Call: { ...state.Call, showNumberPad: !state.Call.showNumberPad, showActiveCallNumberPad:false } }
            }
        case ON_CALL_NUMBERPAD:
            console.log('ON_CALL_NUMBERPAD')

            return {
                ...state, Call: {
                    ...state.Call,
                    showNumberPad: !state.Call.showNumberPad,
                    showOngoingCallPad: !state.Call.showOngoingCallPad
                }
            }

        case ACTIVE_CALL_NUMBERPAD_TOGGLE:
            console.log('ACTIVE_CALL_NUMBERPAD_TOGGLE')

            return {
                ...state, Call: {
                    ...state.Call,
                    showActiveCallNumberPad: !state.Call.showActiveCallNumberPad
                }
            }

        case ACTIVE_CALL_FORWARDPAD_TOGGLE:
            return {
                ...state, Call: {
                    ...state.Call,
                    showForwardPad: !state.Call.showForwardPad
                }
            }

        case GET_AGENT:
            return {
                ...state,
                softPhoneAgent: payload
            }

        case GET_AGENTS_NUMBERS: 
            return {
                ...state,
                agentNumbers: payload
            }

        case GET_AGENT_FAIL:
            return {
                ...state,
                softPhoneAgent: []
            }

        case SET_CALL_INVITE_ERROR:
            return {
                ...state,
                Call: {
                    ...state.Call,
                    inviteError: true,
                    inviteErrorMsg: payload
                }
            }

        case RESET_CALL_INVITE_ERROR:
            return {
                ...state,
                Call: {
                    ...state.Call,
                    inviteError: false,
                    inviteErrorMsg: ''
                }
            }

        case DIAL_NUMBER:
            return {
                ...state,
                phoneNumber: payload,
                callInit: false
            }
        case ESTABLISH_CALL:
            return {
                ...state, Call: {
                    ...state.Call,
                    hasActivePhoneCall: false,
                    showNumberPad: false,
                    showOngoingCallPad: true,
                    hasInComingPhoneCall: false,
                    callType: payload,
                    currentCallDuration: 0
                }
            }
        case CALL_CONNECTED:
            return {
                ...state, Call: {
                    ...state.Call,
                    hasActivePhoneCall: true,
                    showNumberPad: false,
                    showOngoingCallPad: true,
                    hasInComingPhoneCall: false,
                }
            }
        case SET_CALLER_NAME:
            return {
                ...state, Call: {
                    ...state.Call,
                    callerName: payload
                }
            }
        case SET_CALLER_AVATAR:
            return {
                ...state, Call: {
                    ...state.Call,
                    callerImage: payload
                }
            }
        case INCOMING_CALL:
            return {
                ...state, Call: {
                    ...state.Call,
                    hasActivePhoneCall: false,
                    hasInComingPhoneCall: true,
                    showInComingPhoneCall: true,
                    callerName: payload,
                    showNumberPad: false,
                    showOngoingCallPad: false,
                    callType: 'in'
                }
            }
        case REJECT_CALL:
            return {
                ...state, Call: {
                    ...state.Call,
                    hasActivePhoneCall: false,
                    hasInComingPhoneCall: false,
                    callerName: '',
                    showNumberPad: false,
                    showOngoingCallPad: false,
                    callType: ''
                }
            }
        case INCREMENT_CALL_TIMER:
            return {
                ...state,
                Call: { ...state.Call, currentCallDuration: state.Call.currentCallDuration + 1 }
            }
        case CALL_HOLD:
            return {
                ...state,
                onHold: payload
            }
        case TOGGLE_MUTE:
            return {
                ...state,
                muted: !state.muted
            }
        case CALL_DISCONNECT:
            return {
                ...state,
                Call: {
                    ...state.Call,
                    hasActivePhoneCall: false,
                    hasInComingPhoneCall: false,
                    callerName: '',
                    showNumberPad: false,
                    showOngoingCallPad: false,
                    currentCallDuration: 0,
                    callType: '',
                    callerImage: ''
                },
                muted: false,
                onHold: false,
            }
        case SET_DEVICE_READY:
            return {
                ...state,
                deviceReady: true
            }
        case SAVE_DEVICE_TOKEN:
            return {
                ...state,
                deviceToken: payload
            }
        case SHOW_POPUP:
            return {
                ...state,
                showPopup: true,
                popupMessage: payload
            }
        case HIDE_POPUP:
            return {
                ...state,
                showPopup: false,
                popupMessage: null
            }
        case SHOW_CALL_LISTENING_POPUP:
            return {
                ...state,
                showCallListeningPopup: true,
                listenPhoneNumber: payload
            }
        case HIDE_CALL_LISTENING_POPUP:
            return {
                ...state,
                showCallListeningPopup: false,
                listenPhoneNumber: null
            }
        case SET_CALL_INIT_FALSE:
            return {
                ...state,
                callInit: false,
            }

        case START_CALLHISTORY_LOADING:
            return {
                ...state,
                callHistory: {
                    ...state.callHistory,
                    loading: payload,
                    error: ''
                },
            }

        case GET_CALLHISTORY_DATA:
            return {
                ...state,
                callHistory: {
                    callList: state.callHistory.callList.concat(payload.data),
                    meta: payload.meta,
                    loading: false,
                    error: ''
                },
            }

        case GET_CALLHISTORY_ERROR:
            return {
                ...state,
                callHistory: {
                    ...state.callHistory,
                    loading: false,
                    error: payload
                },
            }

        case CLEAR_CALLHISTORY_DATA:
            return {
                ...state,
                callHistory: {
                    callList: [],
                    meta: {},
                    loading: false,
                    error: ''
                },
            }

        default:
            return state
    }
}
