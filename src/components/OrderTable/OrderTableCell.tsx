import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CardMenu from '../dashboard/Common/CardMenu/CardMenu'
import AlertPopUp from '../../common/AlertPopUp';
import IntlMessages from '../../util/IntlMessages';
import { withRouter } from 'react-router-dom';
import { IOrderTableCellProps, IOrderTableCellState } from './Interface/OrderTableCellInterface';
import SipCallService from "../Phone/SipCallService";
import { currencyConventor, readableDateTimeLocale } from "../../util/helper";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from '../../util/Api';
import { orderAction } from "../../actions/Actions/OrderActions";
import { store } from "../../store";
import { injectIntl } from "react-intl";
import EmployeeListModal from './EmployeeListModal';


class OrderTableCell extends React.Component<IOrderTableCellProps & any, IOrderTableCellState> {

	constructor(props: any) {
		super(props);
		this.state = {
			anchorEl: undefined,
			menuState: false,
			popUp: false,
			callNumber: '',
			callName: '',
			callAlert: false,
			lockAlert: false,
			lockPopUp: false,
			unlockPopUp: false,
			setLockedAlertSuccess: false,
			setunLockedAlertSuccess: false,
			setSweetAlertError: false,
			success: '',
			message: '',
			popUpType: '',
			lock: 0,
			showPopUpValue: false,
			popUpMsg: '',
			actionType: 'SEND_CALL_BACK',
			x: 0, y: 0,
			isLockMenuOpen: false,
			empList: [],
			empListLoader: false,
			lockListOptions: [{ id: 'orderOptions.lock', flag: 1, isHide: false }, { id: 'orderOptions.lockTo', flag: 0, isHide: false }],
			isEmpModalOpen: false
		}
	}


	onOptionMenuSelect = event => {

		event.stopPropagation();
		this.setState({ menuState: true, anchorEl: event.currentTarget });
	};

	handleRequestClose = (event: React.MouseEvent, path: string) => {
		event.stopPropagation();
		if (path !== 'backdropClick') {
			this.props.history.push(path);
		}
		this.setState({ menuState: false });
	};

	handleCancelOrder = (event) => {
		event.stopPropagation();
		this.setState({ menuState: false });
		this.props.handleRequestClose(this.props.data.orderId)
	};

	handleSearchServiceModal = (event) => {
		event.stopPropagation()
		this.setState({ menuState: false });
		this.props.openSearchServiceModal()
	}

	popUpHandler = (event) => {
		event.stopPropagation();
		this.setState({ popUp: true });
		this.setState({ menuState: false });
	};

	onCancelDelete = () => {
		this.setState({ popUp: false });
	}

	deleteOrder = () => {
		this.setState({ popUp: false });
		this.props.deleteOrder(this.props.data.orderId);
	}

	unlockOrder = (orderId) => {
		this.setState({
			unlockPopUp: true,
			lock: orderId
		})
	}

	onlockOrder = (orderId) => {
		this.setState({
			lockPopUp: true,
			lock: orderId
		})
	}

	onCancelLock = () => {
		this.setState({ lockPopUp: false });
	}

	onCancelUnLock = () => {
		this.setState({ unlockPopUp: false });
	}

	
	setLockDefaultOption = () => {
		var updatedLockList = this.state.lockListOptions.map(el => { return { ...el, isHide: false } });
		this.setState({ lockListOptions: updatedLockList });
	}

	onConfirmLock = (payload: any) => {


		this.setState({ lockPopUp: false, success: 'locked Succesfully', popUpType: 'loading' });
		const orderId = this.state.lock;

		axios.put(`/orders/${orderId}/lock`, payload ? payload : {})
			.then(response => response.data)
			.then((res) => {
				if (res) {
					this.props.data.locked = res.data.locked;
					this.setState({ setLockedAlertSuccess: true, popUpType: '' });
					//this.props.history.push(`/support/orders`);
				}
			})
			.catch((error: any) => {
				this.setState({ setSweetAlertError: true, message: error.response.data.message, popUpType: '' });
			})
			.finally(() => {
				this.setLockDefaultOption();
			})
	}

	

	onConfirmUnLock = () => {
		this.setState({ unlockPopUp: false, success: 'unlocked Succesfully', popUpType: 'loading' });
		const orderId = this.state.lock;

		axios.put(`/orders/${orderId}/unlock`)
			.then(response => response.data)
			.then((res) => {
				if (res) {
					this.props.data.locked = res.data.locked;
					this.setState({ setunLockedAlertSuccess: true, popUpType: '' });
					//this.props.history.push(`/support/orders`);
				}
			})
			.catch((error: any) => {
				this.setState({ setSweetAlertError: true, message: error.response.data.message, popUpType: '' });
			})
			.finally(() => {
				this.setLockDefaultOption();
			})
	}

	badgeColor = (status: string, completion_requests: any) => {
		let statusStyle;
		if (status.includes("awaiting_confirmation")) {
			statusStyle = "text-white bg-success";
		} else if (status.includes("on_hold")) {
			statusStyle = "bg-amber";
		} else if (status.includes("scheduled")) {
			statusStyle = "text-white bg-danger";
		} else if (status.includes("completed")) {
			statusStyle = "text-white bg-grey";
		} else if (status.includes("processing")) {
			statusStyle = "text-white bg-success";
		} else if (status.includes("cancelled")) {
			statusStyle = "text-white bg-danger";
		} else if (status.includes("awaiting_completion") && completion_requests && completion_requests.length) {
			statusStyle = "text-red";
		}
		return statusStyle;
	}

	callPhone = (event: any, phoneNumber: string, name: string) => {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			...this.state,
			callNumber: phoneNumber,
			callName: name,
			callAlert: true
		})
		// SipCallService.startCall(phoneNumber, name);
	}

	getOverView = (orderId: number) => {
		this.props.history.push(`/support/orders/${orderId}`)
	}

	callCancel = () => {
		this.setState({
			...this.state,
			callAlert: false,
			callName: '',
			callNumber: ''
		})
	}

	makeCall = () => {
		this.setState({
			...this.state,
			callAlert: false
		})
		SipCallService.startCall(this.state.callNumber, this.state.callName);
	}

	handleTitle = () => {
		const { actionType, popUpType } = this.state;
		const title = actionType === "SEND_CALL_BACK" ? "sendCallBack" : actionType === "MOVE_TO_ON_HOLD" ? "moveToOnHold" : "";
		const alertType = popUpType === 'warning' ? "Warning" : popUpType === 'success' ? "Success" : popUpType === 'danger' ? "Fail" : "Loading";
		const alertId = "sweetAlerts.".concat(title).concat(alertType);
		return <IntlMessages id={alertId} />
	};

	handleOnConfirmButton = () => {
		const { actionType, popUpType } = this.state;
		if (actionType === 'SEND_CALL_BACK') {
			this.handleOnConfirmSendCallBack();
		} else if (actionType === 'MOVE_TO_ON_HOLD' && popUpType === 'warning') {
			this.setState({ showPopUpValue: true, popUpType: "loading" });
			store.dispatch(orderAction(this.props.data.orderId.toString(), "put-on-hold", (status: string, message: string) => {
				this.setState({ showPopUpValue: true, popUpType: status, popUpMsg: message });
			}));
		} else {
			this.setState({ showPopUpValue: false, popUpType: "", popUpMsg: "" });
		}
	};

	onSendCallBack = (event: React.MouseEvent) => {
		event.stopPropagation();
		this.setState({ menuState: false, showPopUpValue: true, popUpType: 'warning', actionType: 'SEND_CALL_BACK', popUpMsg: "" });
	};

	onMoveToOnHold = (event: React.MouseEvent) => {
		event.stopPropagation();
		this.setState({ menuState: false, showPopUpValue: true, popUpType: 'warning', actionType: 'MOVE_TO_ON_HOLD', popUpMsg: "" });
	};

	handleOnConfirmSendCallBack = () => {
		const { popUpType } = this.state;
		if (popUpType === 'warning') {
			this.setState({ showPopUpValue: true, popUpType: "loading" });
			store.dispatch(orderAction(this.props.data.orderId.toString(), "send-callback-request", (msg: string) => {
				this.setState({ showPopUpValue: true, popUpType: msg });
			}));
		} else if (popUpType === 'success') {
			this.setState({ showPopUpValue: false, popUpType: "" });
		} else {
			this.setState({ showPopUpValue: false, popUpType: "" });
		}
	}

	handleOnCancelButton = () => {
		this.setState({ showPopUpValue: false, popUpType: "", popUpMsg: "" });
	};

	onRowClick = (event, {locked,id}) => {
		
		
		event.preventDefault();
		if (this.state.menuState) {
			this.setState({ menuState: false, x: 0, y: 0, anchorEl: undefined });
		} else {

			const dynamicLockTitle = !locked ? 'orderOptions.lock' : 'orderOptions.unlock';
			var updatedLockList = this.state.lockListOptions.map(el => el.flag == 1 ? { ...el, id: dynamicLockTitle } : el);
			if (locked) {
				updatedLockList = updatedLockList.map(el => el.flag == 0 ? { ...el, isHide: true } : el);
			}

			this.setState({ lockListOptions: updatedLockList });

			this.setState({ menuState: true, x: event.clientX, y: event.clientY, anchorEl: event.currentTarget });
		}

	}


	toggleEmpModal = () => {
		this.setState({ isEmpModalOpen: !this.state.isEmpModalOpen });
	}

	fetchEmployeeList = () => {
		this.setState({
			empListLoader: true,
		})
		axios.get(`/system/employees`)
			.then(response => response.data)
			.then((response) => {
				this.setState({
					empList: response.data.length ? response.data : []
				})
			})
			.catch((error) => {
				console.log(error);
			}).finally(() => {
				this.setState({
					empListLoader: false,
				})
			});
	}

	onLockItemClick = (event, { orderId, locked, flag }) => {
		event.preventDefault();
		event.stopPropagation();


		if (flag == 1) {
			if (locked) {
				this.unlockOrder(orderId);
			} else {
				this.onlockOrder(orderId);
			}
		} else {
			this.fetchEmployeeList();
			this.setState({ isEmpModalOpen: true, lock: orderId });
		}
		this.setState({ menuState: false});
	}

	onEmpSelect = (event, empId) => {
		event.preventDefault();
		this.setState({ isEmpModalOpen: false });
		this.onConfirmLock({ agent_id: empId })
	}




	render() {
		const { anchorEl, menuState, x, y, lockListOptions, empList } = this.state;
		const { id, orderId, name, image, address, phone, email, orderDate, preferred_dates, completion_requests, status, locked, department, additionalData, services, meta }: any = this.props.data;
		let departmentDetails = null;
		let licencePlateValue = null;
		additionalData?.forEach((data: any) => {
			if (department == "couriers") {
				if (data.key === 'route_information') {
					return departmentDetails = data['json_value']
				}
			} else {
				if (data.key === "vehicle") {
					return departmentDetails = data['json_value']
				} else if (data.key === "license-plate") {
					return licencePlateValue = data['value']
				}
			}
		})
		const distanceInKm = (value) => {
			return Number(value) / 1000 + " KM";
		}
		const localDateTimeFormat = this.props.intl.formatMessage({ id: 'localeDateTime', defaultMessage: "DD-MM-YYYY hh:mm:ss" });
		const TextOnlyTooltip = withStyles({
			tooltip: {
				color: "#fff",
				backgroundColor: "#ff5b5b"
			}
		})(Tooltip);
		const formattedOrderDate = (orderDate && readableDateTimeLocale(orderDate, localDateTimeFormat))
		const formattedPreferredDate = (preferred_dates && readableDateTimeLocale(preferred_dates.start_date, localDateTimeFormat))
		const curConvert = ((services[0] && services[0].currency_code_iso) && currencyConventor(meta.total_price / 100, services[0].currency_code_iso))



		return (

			[
				<tr tabIndex={-1} key={id} 
					onContextMenu={(e) => this.onRowClick(e, {locked, id})}
					onClick={() => this.getOverView(orderId)}
					className="mousePointer"
				>
					<td>
						<Avatar
							alt={name}
							src={image || "null"}
							className="user-avatar"
						>
							{name.charAt(0)}
						</Avatar>
						{orderId}
					</td>
					<td>
						<div className="user-profile d-flex flex-row align-items-center">

							<div className="user-detail">
								<h5 className="user-name">{name}</h5>
								<div>{`${address.street ? address.street : ""} ${address.street_number ? address.street_number : ""}`}</div>
								<div>{`${address.zip_code ? address.zip_code : ""} ${address.city ? address.city : ""} (${address.country})`}</div>
							</div>
						</div>
					</td>
					<td >
						<div className="underlineElement" onClick={(e) => this.callPhone(e, phone, name)}>{phone}</div>
						<div>{email}</div>
					</td>
					<td>{formattedOrderDate}</td>
					<td>{formattedPreferredDate}</td>
					<td>
						{department == "couriers" ?
							<div>
								<div><b><IntlMessages id="fromLocation" /> : </b>{departmentDetails && departmentDetails["origin"]["full"]}</div>
								<div><b><IntlMessages id="toLocation" /> : </b> {departmentDetails && departmentDetails["destination"]["full"]}</div>
								<div><b><IntlMessages id="receiver.distance" /> : </b> {departmentDetails && departmentDetails["distance"] ? distanceInKm(departmentDetails["distance"]) : ""}</div>
								<div><b><IntlMessages id="retrieval.Date" /></b></div>
								<div><b><IntlMessages id="delivery.Date" /></b></div>
							</div> :
							<div>
								{licencePlateValue && (<div>{licencePlateValue}</div>)}
								<div>{departmentDetails && departmentDetails['brand']['name']}</div>
								<div>{departmentDetails && departmentDetails['model']['name']}</div>
								<div> {departmentDetails && departmentDetails['fuel']['name']}</div>
								{departmentDetails && departmentDetails['construction_year'] && (
									<div>{departmentDetails['construction_year']}</div>
								)}
							</div>
						}
					</td>
					<td>
						<table>
							<tbody>
								{services && services.length > 0 && services.map((service, index) => {
									const currencyConv = currencyConventor(service.calculated_price_inc_vat / 100, service.currency_code_iso)
									if (index < 3) {
										return (
											<tr key={index}>
												<td>{service.amount} x</td>
												<td>{service.name}</td>
												<td>{currencyConv}</td>
												<hr />
											</tr>
										)
									}
								})}
								{services && services.length > 3 && (
									<div className="tooltipService">More
										{services.map((service, index) => {
											const currencyConvent = currencyConventor(service.calculated_price_inc_vat / 100, service.currency_code_iso)
											if (index > 2) {
												return (
													<tr key={index} className="tooltiptext">
														<td>{service.amount}</td>
														<td>{service.name}</td>
														<td>{currencyConvent}</td>
														<hr />
													</tr>
												)
											}
										})}
									</div>
								)}
							</tbody>
						</table>
					</td>
					<td>{curConvert}</td>
					<td>
						{locked ?
							<div className="" >
								<i className="zmdi zmdi-lock text-danger mr-2" style={{ 'fontSize': '22px' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.unlockOrder(orderId); }} />
								{locked.name}
							</div>
							:
							<Tooltip title="">
								<i className="zmdi zmdi-lock-open" style={{ 'fontSize': '22px' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onlockOrder(orderId); }} />
							</Tooltip>
						}
					</td>
					<td className="">
						<div className={` badge text-uppercase ${this.badgeColor(status.name, completion_requests)}`}>
							{status.name === "awaiting_completion" && completion_requests && completion_requests.length ?
								<svg focusable="false" className="svg-inline--fa fa-medal fa-w-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M223.75 130.75L154.62 15.54A31.997 31.997 0 0 0 127.18 0H16.03C3.08 0-4.5 14.57 2.92 25.18l111.27 158.96c29.72-27.77 67.52-46.83 109.56-53.39zM495.97 0H384.82c-11.24 0-21.66 5.9-27.44 15.54l-69.13 115.21c42.04 6.56 79.84 25.62 109.56 53.38L509.08 25.18C516.5 14.57 508.92 0 495.97 0zM256 160c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm92.52 157.26l-37.93 36.96 8.97 52.22c1.6 9.36-8.26 16.51-16.65 12.09L256 393.88l-46.9 24.65c-8.4 4.45-18.25-2.74-16.65-12.09l8.97-52.22-37.93-36.96c-6.82-6.64-3.05-18.23 6.35-19.59l52.43-7.64 23.43-47.52c2.11-4.28 6.19-6.39 10.28-6.39 4.11 0 8.22 2.14 10.33 6.39l23.43 47.52 52.43 7.64c9.4 1.36 13.17 12.95 6.35 19.59z"></path></svg>
								: null} {status.name}
						</div>
					</td>
					<td className="">
						{/* <IconButton onClick={this.onOptionMenuSelect.bind(this)} className={`action_btn_${id}`}>
							<i className="zmdi zmdi-more-vert" />
						</IconButton> */}
						<CardMenu
							handleSearchServiceModal={(event: React.MouseEvent<HTMLElement>) => this.handleSearchServiceModal(event)}
							menuState={menuState} anchorEl={anchorEl} status={status.name}
							pageId={orderId?orderId:id}
							style={{ x, y }}
							editOption={true}

							lockListOptions={lockListOptions}
							handleLockItemClick={this.onLockItemClick}
							locked={locked}

							handleRequestClose={this.handleRequestClose}
							handelSendCallBack={this.onSendCallBack}
							handleRequestMoveToOnHold={this.onMoveToOnHold}
							handleCancelOrder={(event: React.MouseEvent<HTMLElement>) => this.handleCancelOrder(event)}
							popUpHandler={(event: React.MouseEvent<HTMLElement>) => this.popUpHandler(event)} />

					
					</td>
				</tr>,
				<AlertPopUp
					key={id}
					show={this.state.callAlert}
					title={<IntlMessages id={"sipCallMakeCall"} />}
					warning={true}
					showCancel={true}
					onCancel={this.callCancel}
					onConfirm={this.makeCall} />,

				<AlertPopUp
					key={id}
					// key="alertPopUp" 
					show={this.state.popUp}
					message={<IntlMessages id="sweetAlerts.deleteWarningMessage" />}
					title={<IntlMessages id="sweetAlerts.deleteWarningTitle" />}
					warning={true} showCancel
					confirmBtnText={<IntlMessages id="sweetAlerts.yesDeleteIt" />}
					cancelBtnText={<IntlMessages id="sweetAlerts.cancelButton" />}
					confirmBtnBsStyle="danger"
					cancelBtnBsStyle="default"
					onConfirm={this.deleteOrder}
					onCancel={this.onCancelDelete} />,

				<AlertPopUp
					key={id}
					show={this.state.lockPopUp}
					title={<IntlMessages id="sweetAlerts.lockTitle" />}
					warning={true} showCancel
					confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
					cancelBtnText={<IntlMessages id="sweetAlerts.cancelButton" />}
					confirmBtnBsStyle="danger"
					cancelBtnBsStyle="default"
					disabled={this.state.popUpType === 'loading'}
					onConfirm={() => this.onConfirmLock(undefined)}
					onCancel={this.onCancelLock} />,

				<AlertPopUp
					key={id}
					// key="alertPopUp" 
					show={this.state.unlockPopUp}
					title={<IntlMessages id="sweetAlerts.unlockTitle" />}
					warning={true} showCancel
					confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
					cancelBtnText={<IntlMessages id="sweetAlerts.cancelButton" />}
					confirmBtnBsStyle="danger"
					cancelBtnBsStyle="default"
					disabled={this.state.popUpType === 'loading'}
					onConfirm={this.onConfirmUnLock}
					onCancel={this.onCancelUnLock} />,

				<SweetAlert
					key={id}
					show={this.state.setLockedAlertSuccess}
					success title="Success"
					confirmBtnText="Okay"
					onConfirm={() => this.setState({ setLockedAlertSuccess: false })}>
					{<IntlMessages id="sweetAlerts.lockSuccess" />}
				</SweetAlert>,

				<SweetAlert
					key={id}
					show={this.state.setunLockedAlertSuccess}
					success title="Success"
					confirmBtnText="Okay"
					onConfirm={() => this.setState({ setunLockedAlertSuccess: false })}>
					{<IntlMessages id="sweetAlerts.unlockSuccess" />}
				</SweetAlert>,

				<SweetAlert
					show={this.state.setSweetAlertError} error title="Error"
					loading
					confirmBtnText="Okay" onConfirm={() => this.setState({ setSweetAlertError: false })}>
					{this.state.message}
				</SweetAlert>,

				<AlertPopUp
					key={id}
					show={this.state.showPopUpValue}
					message={this.state.popUpMsg && this.state.popUpMsg}
					title={this.handleTitle()}
					allowEscape={false}
					closeOnClickOutside={false}
					success={this.state.popUpType === 'success'}
					warning={this.state.popUpType === 'warning'}
					danger={this.state.popUpType === 'danger'}
					disabled={this.state.popUpType === 'loading'}
					showCancel={this.state.popUpType === 'warning'}
					confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
					onConfirm={this.handleOnConfirmButton}
					onCancel={this.handleOnCancelButton}
				/>,
				this.state.isEmpModalOpen && <EmployeeListModal loading={this.state.empListLoader} showModal={this.state.isEmpModalOpen} toggleModal={this.toggleEmpModal} onEmpSelect={this.onEmpSelect} list={empList} />
			]
		);
	}
}

export default injectIntl(withRouter(OrderTableCell) as any);

