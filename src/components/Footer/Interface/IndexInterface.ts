import {ISoftPhoneReducer, Call, ISoftphoneAgent} from '../../../reducers/Interface/SoftphoneReducerInterface';
import {ICallQueueReducer} from '../../../reducers/Interface/CallQueueReducerInterface';
import {IAuth} from '../../../reducers/Interface/AuthInterface';

export interface IFooterProps {
    authUser: {
        abilities: {
            created_at: string;
            delete_protection: number;
            entity_id: null;
            entity_type: null;
            id: string;
            name: string;
            only_owned: number;
            options: [];
            scope: null
            title: string;
            updated_at: string;
        }[];
        avatar: null;
        created_at: number;
        first_name: string;
        id: string;
        last_name: string;
        roles: string[];
        salutation: string;
        updated_at: number;
    }
    call: {
        currentCallDuration: number;
        hasActivePhoneCall: boolean;
        showHistory: boolean;
        showNumberPad: boolean;
        showOngoingCallPad: boolean;
        deviceReady?: boolean;
        hasInComingPhoneCall: boolean;
        callerName: string,
        softPhoneAgent: ISoftphoneAgent[]
    }
    callQueueStatus: boolean;
    deviceReady: boolean;
    muted: boolean;
    noActionTaken: boolean;
    openDialPad: () => void;
    phoneNumber: string;
    resumeCallQueue: () => void;
    setCallQueueStatus: (p1: boolean) => void;
    getSoftphoneAgent: () => void;
}

export interface IRootFooterState {
    softPhone: ISoftPhoneReducer;
    auth: IAuth;
    callQueueState: ICallQueueReducer;
}
