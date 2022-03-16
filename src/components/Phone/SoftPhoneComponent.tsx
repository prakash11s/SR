import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import SweetAlert from "react-bootstrap-sweetalert";
import {
	MenuItem,
	Select
} from "@material-ui/core";

import {
	callDisconnect,
	setDeviceReady,
	getDeviceToken,
	setDismissAlertPopUp,
	setDismissCallListeningPopUp,
	callListen,
	onActiveCallPadToggle
} from "actions/Actions/SoftPhoneActions";

import {
	selectMuteState,
	selectDeviceToken,
	selectShowPopupState,
	selectPopupMessageState,
	selectSoftPhoneAgent,
	selectShowCallListeningPopupState,
	selectListenPhoneNumberState
} from "../../selectors/softPhone.selectors";

import AlertPopUp from "./../../common/AlertPopUp/index";
import softPhoneService from "./softPhone.service";
import SipCallService from "./SipCallService";
import {Grid} from "@material-ui/core";
import CallHistory from "./CallHistory";
import RBACContext from "../../rbac/rbac.context";
import {SHOW_CALL_HISTORY} from "../../rbac/abilities.constants";
import { store } from "store";

class SoftPhoneComponent extends React.Component<any, any> {
	state = {
		whisperMode: "False",
		bargeMode: "False"
	}

	componentDidMount() {
		// if (!this.props.deviceToken) {
		//   this.getCapabilityToken();
		// } else {
		//   // softPhoneService.setup(
		//   //   this.props.deviceToken.token,
		//   //   this.props.setDeviceReady
		//   // );
		// }
	}

	getCapabilityToken = async () => {
		await this.props.getDeviceToken(softPhoneService);
	};

	onDialHandler = async (number: any) => {
		console.log('entered phone number: ' + number)
		if (
			this.props.deviceToken &&
			this.props.deviceToken.ttl &&
			Date.parse(this.props.deviceToken.ttl) <= Date.now()
		) {
			//await this.getCapabilityToken();
		}
		SipCallService.startCall(number);
		//softPhoneService.connectCall(number);
	};

	onToggleMute = () => {
		const {muted} = this.props;
		softPhoneService.toggleMute(muted);
	};

	onCallDisconnect = () => {
		softPhoneService.disconnectCall();
	};

	handleWhisperModeChange = (value: any) => {
		this.setState({whisperMode: value});
	
		if (value == "True" && this.state.bargeMode == "True")
			this.setState({bargeMode: "False"});
	}
	
	handleBargeModeChange = (value: any) => {
		this.setState({bargeMode: value});
	
		if (value == "True" && this.state.whisperMode == "True")
			this.setState({whisperMode: "False"});
	}

	handleConfirm = (destination: any) => {
		const { setDismissCallListeningPopUp, softPhoneAgent } = this.props
		const whisper_mode = this.state.whisperMode == "True" ? true : false;
		const barge_mode = this.state.bargeMode == "True" ? true : false;
		
		store.dispatch(callListen({
			origin: softPhoneAgent[0].extension,
			destination,
			whisper_mode,
			barge_mode
		}));
		setDismissCallListeningPopUp();
	}

	render() {
		const {showPopup, showCallListeningPopup, listenPhoneNumber, popupMessage, setDismissAlertPopUp, setDismissCallListeningPopUp} = this.props;
		const { whisperMode, bargeMode } = this.state
		const children = React.Children.map(this.props.children, child => {
			if (child !== null) {
				return React.cloneElement((child as any), {
					dialNumber: this.onDialHandler,
					isDeviceReady: (this as any).isDeviceReady,
					onToggleMute: this.onToggleMute,
					onCallDisconnect: this.onCallDisconnect
				});
			}
		});

		return (
			<div>
				<Grid container spacing={1}>
					{/* {Boolean(children?.length) &&
          <RBACContext.Consumer>
						{({userCan, abilities}: any) => userCan(abilities, SHOW_CALL_HISTORY) && (
							<Grid item xs={6}>
								<CallHistory/>
							</Grid>)}
          </RBACContext.Consumer>} */}
					<Grid item xs={6}>
						{children}
					</Grid>
				</Grid>
				<div>
					<AlertPopUp show={showPopup} message={popupMessage} title='softphone.errorPopUpMessage' warning={true}
											onConfirm={setDismissAlertPopUp}/>
					<SweetAlert show={showCallListeningPopup} title={'Call Listening'} onConfirm={() => this.handleConfirm(listenPhoneNumber)}>
						<span>Whisper Mode</span>
						<Select
							className="w-100 mb-3"
							onChange={(event) =>
								this.handleWhisperModeChange(event.target.value)
							}
							value={whisperMode}
						>
							<MenuItem value={"True"}>Yes</MenuItem>
							<MenuItem value={"False"}>No</MenuItem>
						</Select>
						<span>Barge Mode</span>
						<Select
							className="w-100 mb-3"
							onChange={(event) =>
								this.handleBargeModeChange(event.target.value)
							}
							value={bargeMode}
						>
							<MenuItem value={"True"}>Yes</MenuItem>
							<MenuItem value={"False"}>No</MenuItem>
						</Select>
					</SweetAlert>
				</div>
			</div>
		);
	}
}

const mapStateToProps = createStructuredSelector({
	muted: selectMuteState,
	deviceToken: selectDeviceToken,
	showPopup: selectShowPopupState,
	showCallListeningPopup: selectShowCallListeningPopupState,
	listenPhoneNumber: selectListenPhoneNumberState,
	popupMessage: selectPopupMessageState,
	softPhoneAgent: selectSoftPhoneAgent
});

const mapDispatchToProps = (dispatch: any) => ({
	callDisconnect: () => dispatch(callDisconnect()),
	setDeviceReady: () => dispatch(setDeviceReady()),
	getDeviceToken: (softPhoneService: any) => dispatch(getDeviceToken(softPhoneService)),
	setDismissAlertPopUp: () => dispatch(setDismissAlertPopUp()),
	setDismissCallListeningPopUp: () => dispatch(setDismissCallListeningPopUp())
});

export default connect(mapStateToProps, mapDispatchToProps)(SoftPhoneComponent);
