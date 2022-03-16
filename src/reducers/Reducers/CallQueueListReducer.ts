import {
    CALL_QUEUE_LIST,
    TOGGLE_ALERT_PROMPT,
    SET_CALL_QUEUE_OVERVIEW_DATA,
    TOGGLE_SPINNER,
    SET_CALL_QUEUE_ID,
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
    TOGGLE_ALERT_POPUP
    /**
    * HIDING IT FOR FUTURE USE
    */
    // EDIT_CALL_QUEUE_ID,
    // EDIT_CALL_QUEUE_IMAGE,
    // EDIT_CALL_QUEUE_CREATED_AT,
    // EDIT_CALL_QUEUE_UPDATED_AT,
} from "../../constants/ActionTypes";
import * as _ from 'lodash';
import { ICallQueueReducer,IData } from "../Interface/CallQueueReducerInterface";
import {IAction} from "../Interface/ActionInterface";

const initialState:ICallQueueReducer = {
    callQueueListData: {
        data: [],
        meta: null
    },
    callQueueId: null,
    loader: true,
    show: false,
    promptShow: false,
    callQueueOverviewData: [],
    spinner: false,
    callQueueStatus: false,
    activeCaller: null,
    showTimer: false,
    snackBar: false,
    callQueueIdData: {
        created_at: "",
        department: "",
        description: "",
        id: null,
        image: "",
        name: "",
        order: null,
        updated_at: ""
    },
    editSuccess: false,
    editFailed: false,
    toggleAlertPopUp: false
};

export default (state:ICallQueueReducer = initialState, action:IAction) => {
    switch (action.type) {
        case CALL_QUEUE_LIST: {
            return {
                ...state,
                callQueueListData: {
                    // data: action.payload.data && state.callQueueId === action.payload.id ? _.uniqBy([...state.callQueueListData.data, ...action.payload.data.data], 'id') : action.payload.data.data,
                    data: action.payload.data && action.payload.data.data,
                    meta: action.payload.data && action.payload.data.meta
                },
                callQueueId: action.payload.id,
                loader: false
            };
        }
        case TOGGLE_ALERT_PROMPT:
            {
                return {
                    ...state,
                    show: !state.show
                }
            }
        case SET_CALL_QUEUE_OVERVIEW_DATA: {
            return {
                ...state,
                callQueueOverviewData: action.payload,
                loader: false,
            }
        }

        case SET_CALL_QUEUE_LOADER_FALSE: {
            return {
                ...state,
                loader: false
            }
        }

        case SET_CALL_QUEUE_ID: {
            return {
                ...state,
                callQueueId: action.payload,
            }
        }
        case TOGGLE_SPINNER: {
            return {
                ...state,
                spinner: action.payload,
                loader: false
            }
        }

        case SET_CALL_QUEUE_STATUS: {
            return {
                ...state,
                callQueueStatus: action.payload
            }
        }

        case SET_ACTIVE_CALLER: {

            let activeCaller:any;
            let dataList;
            if (action.payload) {
                activeCaller = state.activeCaller;

                dataList = state.callQueueListData.data.map((data:IData) => {

                    if (data.id === activeCaller.id) {
                        return {
                            ...data,
                            noActionTaken: false
                        }
                    }
                    return data;
                });
            } else {
                activeCaller = state.callQueueListData.data.find((data:IData) => !data.noActionTaken);
            }
            return {
                ...state,
                callQueueListData: {
                    ...state.callQueueListData,
                    data: dataList ? dataList : state.callQueueListData.data
                },
                activeCaller,
                timer: null
            }
        }

        case SET_TIMER: {
            return {
                ...state,
                showTimer: action.payload
            };
        }

        case SET_NO_ACTION: {
            const activeCaller = state.activeCaller;
            return {
                ...state,
                callQueueListData: {
                    ...state.callQueueListData,
                    data: state.callQueueListData.data.map((data:IData) => {
                        if (activeCaller && data.id === activeCaller.id) {
                            return { ...data, noActionTaken: true }
                        }
                        return data;
                    })
                }
            };
        }

        case SET_ACTIVE_CALLER_AFTER_DELETE: {
            return {
                ...state,
                callQueueListData: {
                    ...state.callQueueListData,
                    data: state.callQueueListData.data.filter((data:IData) => data.id !== action.payload)
                }
            };
        }
        case SET_PROMPT_SHOW: {
            return {
                ...state,
                promptShow: !state.promptShow
            }
        }

        case SET_COMMENTS_DATA: {
            return {
                ...state,
                callQueueListData: {
                    ...state.callQueueListData,
                    data: action.payload
                }
            }
        }

        case SET_SNACKBAR_TRUE: {
            return {
                ...state,
                snackBar: true
            }
        }

        case SET_CALL_QUEUE_ID_DATA: {
            return {
                ...state,
                callQueueIdData: action.payload
            }
        }

        case EDIT_CALL_QUEUE_NAME: {
            return {
                ...state,
                callQueueIdData: {
                  ...state.callQueueIdData,
                  name: action.payload,
            }
        }}

        case EDIT_CALL_QUEUE_DESCRIPTION: {
            return {
                ...state,
                callQueueIdData: {
                  ...state.callQueueIdData,
                  description: action.payload,
            }
        }}


        case EDIT_CALL_QUEUE_DEPARTMENT: {
            return {
                ...state,
                callQueueIdData: {
                  ...state.callQueueIdData,
                  department: action.payload, 
            }
        }}

        case EDIT_CALL_QUEUE_ORDER: {
            return {
                ...state,
                callQueueIdData: {
                  ...state.callQueueIdData,
                  order: action.payload, 
            }
        }}

        /**
         * HIDING IT FOR FUTURE USE
         */

        // case EDIT_CALL_QUEUE_CREATED_AT: {
        //     return {
        //         ...state,
        //         callQueueIdData: {
        //           ...state.callQueueIdData,
        //           created_at: action.payload, 
        //     }
        // }}

        // case EDIT_CALL_QUEUE_UPDATED_AT: {
        //     return {
        //         ...state,
        //         callQueueIdData: {
        //           ...state.callQueueIdData,
        //           updated_at: action.payload, 
        //     }
        // }}

                // case EDIT_CALL_QUEUE_ID: {
        //     return {
        //         ...state,
        //         callQueueIdData: {
        //           ...state.callQueueIdData,
        //           id: action.payload,
        //         },
        //     }
        // }

        // case EDIT_CALL_QUEUE_IMAGE: {
        //     return {
        //         ...state,
        //         callQueueIdData: {
        //           ...state.callQueueIdData,
        //           image: action.payload, 
        //     }
        // }}

        case TOGGLE_ALERT_POPUP: {
            return {
                ...state,
                editFailed: false,
                editSuccess: false
            }
        }

        case EDIT_CALL_QUEUE_SUCCESS_TOGGLE: {
            return {
                ...state,
                editFailed: false,
                editSuccess: true
            }
        }

        case EDIT_CALL_QUEUE_WARNING_TOGGLE: {
            return {
                ...state,
                editSuccess: false,                 
                editFailed: true
            }
        }
  
        default: 
            return state;
        }
};
