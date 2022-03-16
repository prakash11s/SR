import React, {useEffect, useState, useContext} from "react";
import CallHistory2 from "../Phone/CallHistory2";
import ActivePhoneCall from "../Phone/ActivePhoneCall";
import NumberPad from "../Phone/NumberPad";
import {useSelector} from "react-redux";
import {
	getSoftphoneAgentAction, incrementCallTimer, onActiveCallPadToggle, onForwardPadToggle,
	openDialPad,
	resetCallInviteError
} from "actions/Actions/SoftPhoneActions";
import SoftPhoneComponent from "../Phone/SoftPhoneComponent";
import TimerComponent from "common/Timer/index";
import RBACContext from "../../rbac/rbac.context";
import {ACCESS_SOFT_PHONE} from "../../rbac/abilities.constants";
import {
	resumeCallQueue,
	setCallQueueStatus,
} from 'actions/Actions/callQueueListActions';
import {IData} from '../../reducers/Interface/CallQueueReducerInterface';
import IncomingPhoneCall from "../Phone/IncomingPhoneCall";
import SipCallService from "../Phone/SipCallService";
import {useDispatch} from 'react-redux'
import AlertPopUp from "../../common/AlertPopUp";
import IntlMessages from "../../util/IntlMessages";
import ActiveCallNumberPad from "../Phone/ActiveCallNumberPad";
import ForwardCallPad from "../Phone/ForwardCallPad";
import PhoneForwardedIcon from "@material-ui/icons/PhoneForwarded";
import ActiveCallSettings from "components/Phone/ActiveCallSettings";

const Footer: React.FC<any> = (props) => {

	const dispatch = useDispatch();

	const softPhoneState = useSelector((state: any) => state.softPhone);
	const authState = useSelector((state: any) => state.auth);
	const callQueueState = useSelector((state: any) => state.callQueueState);
	const callState = useSelector((state: any) => state.softPhone.Call);

	const [noActionTaken, setNoActionTaken] = useState<boolean>(false)
	const { userCan, abilities } = useContext<any>(RBACContext);

	useEffect(() => {
		if (softPhoneState.Call.hasActivePhoneCall) {
			setTimeout(() => {
				dispatch(incrementCallTimer())
			}, 1000);
		}
	}, [softPhoneState.Call.hasActivePhoneCall, softPhoneState.Call.currentCallDuration])

	useEffect(() => {
		if (!softPhoneState.userAgent && userCan(abilities, ACCESS_SOFT_PHONE)) {
			dispatch(getSoftphoneAgentAction())
		}
	}, []);

	useEffect(() => {
		setNoActionTaken(callQueueState.callQueueListData.data.filter((data: IData) => data.noActionTaken).length === callQueueState.callQueueListData.data.length)
	}, [callQueueState.callQueueListData])

	const openDialBox = () => {
		// if (!showOngoingCallPad) {
			dispatch(openDialPad());
		// }
		if (showForwardPad)
			dispatch(onForwardPadToggle())
	};

	useEffect(() => {
		if (softPhoneState.softPhoneAgent.length) {
			const name = `${authState.authUser.first_name} ${authState.authUser.last_name}`;
			SipCallService.setupSip(softPhoneState.softPhoneAgent[0], name);
		}
	}, [softPhoneState.softPhoneAgent])

	const {
		showHistory,
		showNumberPad,
		showOngoingCallPad,
		showForwardPad,
		currentCallDuration,
		deviceReady,
		hasActivePhoneCall,
		hasInComingPhoneCall,
		showInComingPhoneCall,
		callerName,
		callerImage,
		showActiveCallNumberPad,
		inviteError,
		inviteErrorMsg,
		callType
	} = softPhoneState.Call;
	const {
		phoneNumber,
		muted
	} = softPhoneState;
	const {
		callQueueStatus,
	} = callQueueState;


	const footer = authState.authUser ? (
		<RBACContext.Consumer>
			{({userCan, abilities}: any) => (
				<footer className="app-footer">
					<AlertPopUp show={inviteError} warning title={inviteErrorMsg}
											onConfirm={() => dispatch(resetCallInviteError())}/>
					{softPhoneState.softPhoneAgent.length ?
          <section>
              <div
                  className="digital-phone position-absolute d-flex"
                  data-cy="digital-phone"
              >
								{showHistory && <CallHistory2/>}
								{softPhoneState.softPhoneAgent.length &&
                <SoftPhoneComponent>
									{showOngoingCallPad ?
										!showActiveCallNumberPad && !showForwardPad ?
											<ActivePhoneCall
												phoneNumber={phoneNumber}
												currentCallDuration={currentCallDuration}
												muted={muted}
											/> : showActiveCallNumberPad && !showForwardPad ? <ActiveCallNumberPad/> : <ForwardCallPad />
											: null
									}
									{showInComingPhoneCall && hasInComingPhoneCall && <IncomingPhoneCall callerName={callerName}/>}
									{showNumberPad && !showForwardPad && !showOngoingCallPad ? <NumberPad isDeviceReady={deviceReady}/> : showForwardPad&&!showOngoingCallPad ? <ForwardCallPad />: null}
                </SoftPhoneComponent>
								}
              </div>

              <div className="bottom-bar position-absolute pt-2 pb-2">
                  <div className="container">
                      <div className="row">
                          <div
                              className={`call col-6 col-lg-3 d-flex align-items-center justify-content-start${(showOngoingCallPad || hasActivePhoneCall || hasInComingPhoneCall) ? ' ' : ' invisible'}`}>
														{callerImage ? <img src={callerImage} width={50} height={50}/> :
															<div className="mr-3 customer-icon-sm">{callerName ? callerName.charAt(0) : ''}</div>}

                              <div className="info">
                                  <p className="mb-0 font-weight-bold">{callerName}</p>
                                  <p className="m-0">{phoneNumber}</p>
                              </div>
                          </div>

                          <div
                              className={`status col-6 col-lg-2 d-flex align-items-center${(hasActivePhoneCall && !hasInComingPhoneCall) ? ' ' : ' invisible'}`}>
                              <p className="mb-0 mr-2 font-weight-bold">Calling</p>
                              <div className="mb-0">
                                  <TimerComponent callDuration={currentCallDuration}/>
                              </div>
														{/* Hiding connection quality bar temporarily */}
														{/* <div className="strength d-flex align-items-end justify-content-start">
                                <div className="bar active"></div>
                                <div className="bar active"></div>
                                <div className="bar active"></div>
                                <div className="bar"></div>
                            </div> */}
                          </div>

                          <div
                              className={`controls col-10 col-lg-6 d-flex align-items-center mt-3 mt-lg-0${(showOngoingCallPad || hasActivePhoneCall || hasInComingPhoneCall) ? ' ' : ' invisible'}`}>
                              <div className="row">
                                  <div className="general-controls d-flex col-6">
									<ActiveCallSettings />
																		{(showOngoingCallPad && hasActivePhoneCall) || hasInComingPhoneCall &&
                                    <div
                                        className={`btn-round btn-danger d-flex align-items-center justify-content-center ${(hasInComingPhoneCall || showOngoingCallPad || hasActivePhoneCall) ? ' ' : ' invisible'}`}
                                        onClick={() => SipCallService.rejectCall()}
                                    >
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
                                    </div>}
                                    {/*here*/}
									{(showOngoingCallPad || hasActivePhoneCall) && !hasInComingPhoneCall &&
                                    <div
                                        className={`btn-round ml-3 btn-danger d-flex align-items-center justify-content-center ${(hasInComingPhoneCall || showOngoingCallPad || hasActivePhoneCall) ? ' ' : ' invisible'}`}
                                        onClick={() => SipCallService.endCall(callType)}
                                    >
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
                                    </div>}
                                  </div>
                              </div>
                          </div>
                          <div
                              className="col-2 col-lg-1 maximize d-flex align-items-center justify-content-end mt-3 mt-lg-0">
														{userCan(abilities, ACCESS_SOFT_PHONE) && (
															<svg
																data-cy="number-pad"
																onClick={openDialBox}
																className="MuiSvgIcon-root"
																focusable="false"
																viewBox="0 0 24 24"
																aria-hidden="true"
																role="presentation"
															>
																<path
																	d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"></path>
																<path fill="none" d="M0 0h24v24H0V0z"></path>
															</svg>)}
                          </div>
                      </div>
                  </div>
              </div>
          </section> : null
					}
				</footer>
			)}
		</RBACContext.Consumer>
	) : null;

	return footer;
}

export default Footer;
