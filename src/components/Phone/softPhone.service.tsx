import {
    store
}
    from "../../store/index";

import {
    callDisconnect,
    muteToggle,
    dialNumber,
    startCall,
    setShowAlertPopup
} from "../../actions/Actions/SoftPhoneActions";

// import { goToNextCallInQueue } from '../../actions/Actions/callQueueListActionsNew';

const {
    Device
} = require("twilio-client");

/*
 * Service to handle Twilio call API's
 *
 */
class SoftPhoneService {

    constructor() {
        if ((SoftPhoneService as any).instance) {
            return (SoftPhoneService as any).instance;
        }
        (SoftPhoneService as any).instance = this;
        (this as any).errorMessage = null;
        (this as any).phoneNumber = null;
        (this as any).checkNumber = null;
        (this as any).error = false;
        (this as any).callType = null;
        (this as any).storeDispatched = false;
    }

    setup(token:any, setDeviceReady:any = null) {
        Device.setup(token, {
            debug: process.env.NODE_ENV === "development",
            closeProtection: true,
            enableIceRestart: true,
            enableRingingState: true
        });

        Device.on('disconnect', () => {
            this.disconnectCall();
        });

        Device.on('ready', () => {
            if (setDeviceReady) {
                setDeviceReady();
            }
        });
    }

    connectCall(call:any) {
        if (Device.activeConnection()) {
            return;
        }
        // Gets call Details based on type - manual or call-queue
        const callDetail = this.getCallDetails(call);
        (this as any).storeDispatched = false;
        Device.connect(callDetail).on('ringing', (hasEarlyMedia:any) => {
            // NOTE: this method is getting executed twice
            store.dispatch(dialNumber((this as any).phoneNumber));
        }).on('accept', (connection:any) => {
            store.dispatch(startCall());
        }).on('error', (error:any) => {
            (this as any).error = true;
            // store.dispatch(goToNextCallInQueue(false));
            (this as any).errorMessage = error.message;
            console.error('Error while connecting to a call', error);
            store.dispatch(setShowAlertPopup((this as any).errorMessage));
        })
    }

    sendDigits(number:any) {
        if (Device.activeConnection()) {
            console.log(number);
            let connection = Device.activeConnection();
            connection.sendDigits(number);
        }
    }

    getCallDetails(callData:any) {
        if (typeof callData === 'string') {
            (this as any).phoneNumber = callData;
            return {
                phoneNumber: callData,
                type: 'manual'
            }
        } else {
            (this as any).phoneNumber = callData.phoneNumber;
            return {
                entry_id: callData.id,
                type: callData.type
            };
        }
    }

    toggleMute(currentState:any) {
        Device.activeConnection().mute(!currentState);
        // @ts-ignore
        store.dispatch(muteToggle(Device.activeConnection().isMuted()));
    }

    disconnectCall() {
        Device.disconnectAll();
        store.dispatch(callDisconnect());
        // TODO - Condition to mitigate disconnect being called twice. Remove when disconnect will not be called twice from twilio
        // When Call Queue is true
        if ((this as any).checkNumber !== (this as any).phoneNumber && !(this as any).error) {
            if (!(this as any).storeDispatched) {
                (this as any).checkNumber = (this as any).phoneNumber;
                // store.dispatch(goToNextCallInQueue());
                (this as any).storeDispatched = true;
            }
        } else {
            (this as any).checkNumber = null;
            (this as any).error = false;
        }
    }
}

export default new SoftPhoneService();
