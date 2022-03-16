import {
  SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES,
  SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES_META,
  SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES_RECORDINGS
} from "../../constants/ActionTypes";
import {ISupport} from "../Interface/SupportInterface";
import {IAction} from "../Interface/ActionInterface";


const initialState:ISupport = {
  // state of call histories
  callHistories: [],
  callHistoriesMeta: null,
  // state of call histories recording
  callHistoriesRecording: null
}


export default (state:ISupport = initialState, action:IAction) => {

  switch (action.type) {
    case SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES_META:
      return {
        ...state,
        callHistoriesMeta: action.payload
      }
    case SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES: {      
      return {
        ...state,
        callHistories: [...state.callHistories, ...action.payload.map((history:any) => ({ ...history, isPlaying: false }))]
      }
    }
    case SUPPORT_PHONE_SYSTEMS_CALL_HISTORIES_RECORDINGS: {

      return {
        ...state, callHistoriesRecording: action.payload, callHistories: state.callHistories.map((history:any) => {
          
          if (history.id === action.historyId) {
          
            return {
              ...history,
              src: action.payload
            };
          }
          return history;
        })
      }

    }

    default:
      return state
  }
}
