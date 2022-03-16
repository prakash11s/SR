import React, { Fragment, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import SipCallService from './SipCallService';
import { onActiveCallPadToggle, onForwardPadToggle, openDialPad } from 'actions/Actions/SoftPhoneActions';

const MuteIcon = () => (
  <svg
    className="MuiSvgIcon-root"
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="presentation"
  >
    <path d="M7 24h2v-2H7v2zm5-11c1.66 0 2.99-1.34 2.99-3L15 4c0-1.66-1.34-3-3-3S9 2.34 9 4v6c0 1.66 1.34 3 3 3zm-1 11h2v-2h-2v2zm4 0h2v-2h-2v2zm4-14h-1.7c0 3-2.54 5.1-5.3 5.1S6.7 13 6.7 10H5c0 3.41 2.72 6.23 6 6.72V20h2v-3.28c3.28-.49 6-3.31 6-6.72z"></path>
    <path fill="none" d="M0 0h24v24H0z"></path>
  </svg>
);

const HoldIcon = () => (
  <svg
    className="MuiSvgIcon-root"
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="presentation"
  >
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
    <path fill="none" d="M0 0h24v24H0z"></path>
  </svg>
);

const ResumeIcon = () => (
  <svg
    className="MuiSvgIcon-root"
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="presentation"
  >
    <path d="M2 12A10 10 0 0 1 12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12m8 5l5-5l-5-5v10z" />
    <path fill="none" d="M0 0h24v24H0z"></path>
  </svg>
);

const DialPadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="100"
    viewBox="0 0 24 24"
  >
    <path d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const ActiveCallSettings: React.FC<any> = (props) => {
    
    const dispatch = useDispatch();
    const softPhoneState = useSelector((state: any) => state.softPhone);
    const callState = useSelector((state: any) => state.softPhone.Call);
    const muteClass = softPhoneState.muted
      ? "btn-round d-flex align-items-center justify-content-center muted"
      : "btn-round d-flex align-items-center justify-content-center";
    
    const openDialBox = () => {
		if (!callState.showOngoingCallPad) {
            dispatch(openDialPad());
        }
	};

    const muteCall = () => {
      SipCallService.muteToggle(callState.callType, softPhoneState.muted);
    };

    const handleCall = (status: boolean) => {
      SipCallService.holdCall(callState.callType, status);
    };

    const toggleForwardPad = () => {
      if (callState.hasActivePhoneCall) {
        dispatch(onForwardPadToggle());
      }
    };

    const toggleNumberPad = () => {
        if (callState.showForwardPad) {
           dispatch(onForwardPadToggle());
        }
        if (callState.hasActivePhoneCall) {
            dispatch(onActiveCallPadToggle());
        }
    };

    return (
        <Fragment>
			<div className="call-controls">
				<div className="buttons d-flex align-items-center justify-content-center">
					<div
						onClick={muteCall}
						className={muteClass}>
						<MuteIcon />
					</div>
					{!softPhoneState.onHold && 
                        <div
                            className="btn-round d-flex align-items-center justify-content-center ml-3"
                            onClick={() => handleCall(true)}
                        >
                            <HoldIcon />
                        </div>
					}
					{softPhoneState.onHold &&
                        <div
                            className="btn-round d-flex align-items-center justify-content-center ml-3 CallQueueList-play-btn"
                            onClick={() => handleCall(false)}
                        >
                               <ResumeIcon />
                            </div>
						}
					<div
						className="btn-round d-flex align-items-center justify-content-center ml-3"
						onClick={() => {
                            openDialBox()
                            toggleForwardPad()
                        }}
					>
						<PhoneForwardedIcon />
					</div>
					<div
						className="btn-round d-flex align-items-center justify-content-center ml-3"
						onClick={() => {
                            openDialBox()
                            return toggleNumberPad()
                            }}
						>
						<DialPadIcon />
					</div>
				</div>
			</div>
        </Fragment>
    )
}

export default ActiveCallSettings;
