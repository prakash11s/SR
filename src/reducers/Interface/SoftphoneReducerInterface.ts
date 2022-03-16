export interface ISoftPhoneReducer {
  VolumeLevel: number,
  deviceReady: boolean,
  deviceToken: string,
  Call: Call,
  softPhoneAgent: ISoftphoneAgent[],
  muted: boolean,
  phoneNumber: string,
  showPopup: boolean,
  showCallListeningPopup: boolean,
  listenPhoneNumber: string,
  popupMessage: null,
  callInit: boolean,
  onHold: boolean,
  callHistory: ICallHistory,
  agentNumbers: IAgentNumbers[]
}

export interface Call {
  showHistory: boolean,
  hasActivePhoneCall: boolean, // will be true when user is on call and at that time ongoing call pad will be displayed
  hasInComingPhoneCall: boolean, // will be true when user is on call and at that time ongoing call pad will be displayed
  showInComingPhoneCall: boolean,
  showNumberPad: boolean,
  showOngoingCallPad: boolean,
  currentCallDuration: number
  callerName: string,
  inviteError: boolean,
  inviteErrorMsg: string,
  showActiveCallNumberPad: boolean,
  showForwardPad: boolean,
  callType: string,
  callerImage: string
}

export interface ISoftphoneAgent {
  id: number,
  agent_id: string,
  extension: number,
  password: string,
  ttl: string,
  created_at: string,
  updated_at: string
}

export interface IAgentNumbers {
  agent_avatar: string
  agent_id: string
  agent_name: number
  created_at: string
  deleted_at: any
  id: number
  status_id: number
  status_text: "Unavailable"
  updated_at: string
}
export interface ICallHistory {
  callList: any[],
  meta: {},
  loading: boolean,
  error: string
}
