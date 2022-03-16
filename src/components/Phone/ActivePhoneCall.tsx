import AlbumTwoToneIcon from '@material-ui/icons/AlbumTwoTone';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import TimerComponent from "common/Timer/index";

import {
	incrementCallTimer,
	onActiveCallPadToggle,
	onForwardPadToggle
} from 'actions/Actions/SoftPhoneActions';
import SipCallService from "./SipCallService";
import AlertPopUp from "../../common/AlertPopUp";
import IntlMessages from "../../util/IntlMessages";


const ActivePhoneCall: React.FC<any> = (props) => {

	const dispatch = useDispatch();

	const softPhoneState = useSelector((state: any) => state.softPhone);
	const callState = useSelector((state: any) => state.softPhone.Call);

	const [endcallAlert, setEndCallAlert] = useState<boolean>(false);

	const onUnload = e => { // the method that will be used for both add and remove event
		e.preventDefault();
		e.returnValue = '';
		SipCallService.endCall(callState.callType)
		if (window.confirm('Data will be lost'))
		{
			console.log("YES")
		}
		else
		{
			console.log("NO")
		}
		// window.alert("Hello")
		//setEndCallAlert(true)
	}

	useEffect(() => {
		// debugger;
		// window.onbeforeunload = () => {
		// 	debugger;
		// 	if (softPhoneState.Call.hasActivePhoneCall) {
		// 		return 'Hello';
		// 	}
		// }
		if (softPhoneState.Call.hasActivePhoneCall) {
			window.addEventListener("beforeunload", onUnload);
		}
		return () => window.removeEventListener("beforeunload", onUnload);
	}, [softPhoneState.Call.hasActivePhoneCall]);

	const callQueueStatus: boolean = useSelector((state: any) => state.callQueueState.callQueueStatus);
	const noActionTaken: boolean = useSelector((state: any) => {
		const dataList = state.callQueueState.callQueueListData.data.filter((data: any) => data.noActionTaken);
		return state.callQueueState.callQueueListData.data.length && dataList.length === state.callQueueState.callQueueListData.data.length;
	});

	const muteClass = softPhoneState.muted
		? "btn-round d-flex align-items-center justify-content-center muted"
		: "btn-round d-flex align-items-center justify-content-center";

	const endCall = () => {
		SipCallService.endCall(callState.callType)
	}

	const muteCall = () => {
		SipCallService.muteToggle(callState.callType, softPhoneState.muted)
	}

	const holdCall = (status: boolean) => {
		SipCallService.holdCall(callState.callType, status);
	}

	const resumeCall = (status: boolean) => {
		SipCallService.holdCall(callState.callType, status);
		// SipCallService.resumeCall(callState.callerName ? 'in' : 'out');
	}

	const toggleNumberPad = () => {
		if (softPhoneState.Call.hasActivePhoneCall) {
			dispatch(onActiveCallPadToggle())
		}
	}

	const toggleForwardPad = () => {
		if (softPhoneState.Call.hasActivePhoneCall) {
			dispatch(onForwardPadToggle())
		}
	}

	// useEffect(() => {
	// 	if (softPhoneState.Call.hasActivePhoneCall) {
	// 		setTimeout(() => {
	// 			dispatch(incrementCallTimer())
	// 		}, 1000);
	// 	}
	// }, [softPhoneState.Call.hasActivePhoneCall, softPhoneState.Call.currentCallDuration])

	return (
		<div
			className="phone d-flex flex-column justify-content-between align-items-center"
			data-cy="active-phone-call"
		>
			<AlertPopUp show={endcallAlert} warning={true} showCancel={true} confirmBtnBsStyle="danger"
									onCancel={() => window.stop()} title={<IntlMessages id={"callDisconnectAlert"}/>}
									onConfirm={endCall}/>
			<div className="status position-relative p-4 m-3">
				<h1 className="m-0 font-weight-bold text-center">
					<TimerComponent callDuration={callState.currentCallDuration}/>
				</h1>
			</div>

			<div className="current-call d-flex flex-column text-center">
				<div className="info">
					{callState && callState.callerImage ? <img src={callState.callerImage} width={150} height={150} /> :
					<div className="mb-3 customer-icon">{callState && callState.callerName ? callState.callerName.charAt(0) : 'A'}</div>}
					{callState && callState.callerName && <p>{callState.callerName}</p>}
					<p>{softPhoneState.phoneNumber}</p>
				</div>
			</div>

			<div className="controls mb-4">
				<div className="call-controls mb-4">
					<div className="buttons d-flex align-items-center justify-content-center">
						<div
							onClick={muteCall}
							className={muteClass}
						>
							<svg
								className="MuiSvgIcon-root"
								focusable="false"
								viewBox="0 0 24 24"
								aria-hidden="true"
								role="presentation"
							>
								<path
									d="M7 24h2v-2H7v2zm5-11c1.66 0 2.99-1.34 2.99-3L15 4c0-1.66-1.34-3-3-3S9 2.34 9 4v6c0 1.66 1.34 3 3 3zm-1 11h2v-2h-2v2zm4 0h2v-2h-2v2zm4-14h-1.7c0 3-2.54 5.1-5.3 5.1S6.7 13 6.7 10H5c0 3.41 2.72 6.23 6 6.72V20h2v-3.28c3.28-.49 6-3.31 6-6.72z"></path>
								<path fill="none" d="M0 0h24v24H0z"></path>
							</svg>
						</div>
						{(!softPhoneState.onHold) && <div
                className="btn-round d-flex align-items-center justify-content-center ml-3"
                onClick={() => holdCall(true)}
            >
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
            </div>
						}
						{(softPhoneState.onHold) &&
            <div
                className="btn-round d-flex align-items-center justify-content-center ml-3 CallQueueList-play-btn"
                onClick={() => resumeCall(false)}
							//onClick={resumeCallQueue}
            >
                <svg
                    className="MuiSvgIcon-root"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="presentation"
                >
                    <path
                        d="M2 12A10 10 0 0 1 12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12m8 5l5-5l-5-5v10z"/>
                    <path fill="none" d="M0 0h24v24H0z"></path>
                </svg>
            </div>
						}
						<div
							className="btn-round d-flex align-items-center justify-content-center ml-3"
							onClick={toggleForwardPad}
						>
							<PhoneForwardedIcon/>
						</div>
						{/*<div*/}
						{/*	className="btn-round d-flex align-items-center justify-content-center ml-3 recordCallContainer recordCall"*/}
						{/*>*/}
						{/*	<AlbumTwoToneIcon/>*/}
						{/*</div>*/}

						<div
							className="btn-round d-flex align-items-center justify-content-center ml-3"
							// onClick={() => onCallNumberPadToggle()}
							onClick={toggleNumberPad}
						>
							<svg xmlns="http://www.w3.org/2000/svg"
									 width="50" height="100"
									 viewBox="0 0 24 24">
								<path
									d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
							</svg>
						</div>

						{/* Hiding speaker icon temporarily */}
						{/* <div className="btn-round d-flex align-items-center justify-content-center active">
                            <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24"
                                 aria-hidden="true" role="presentation">
                                <path
                                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                                <path fill="none" d="M0 0h24v24H0z"></path>
                            </svg>
                        </div> */}
					</div>
				</div>
				{/* Hiding volume control temporarily */}
				{/* <div className="volume-control position-absolute progress">
                    <div className="progress-bar" role="progressbar" style={{ width: 80 + '%'}} aria-valuenow="75"
                         aria-valuemin="0" aria-valuemax="100"></div>
                </div> */}

				{/* Hidding Settings temporarily for future use */}
				{/* <div className="settings position-absolute p-3">
                    <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"
                         role="presentation">
                        <path transform="scale(1.2, 1.2)" fill="none" d="M0 0h20v20H0V0z"></path>
                        <path transform="scale(1.2, 1.2)"
                              d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"></path>
                    </svg>
                </div> */}

				<div className="general-controls">
					<div
						className="buttons d-flex align-items-center justify-content-center"
						onClick={endCall}
					>
						<button className="btn btn-danger p-3">
							<svg
								className="MuiSvgIcon-root"
								focusable="false"
								viewBox="0 0 24 24"
								aria-hidden="true"
								role="presentation"
							>
								<path fill="none" d="M0 0h24v24H0z"></path>
								<path
									d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"></path>
							</svg>
						</button>

					</div>
				</div>
			</div>
		</div>
	);
};

export default ActivePhoneCall;
