import React, { useEffect, useState } from 'react';

import IntlMessages from './../../util/IntlMessages';
import { useIntl } from 'react-intl'
import { Col, Container, Row, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
	assignServicePointAction,
	getOrderDetailAction, getOrderListAction,
	getServicePointDetailAction,
	getServicePointListAction
} from "../../actions/Actions/AssignServicePointAction";
import UserHasPermission from "../../util/Permission";
import ClearIcon from "@material-ui/icons/Clear";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	ListItem,
	ListItemText,
	List, FormControl
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from "@material-ui/lab/Autocomplete";
import AlertPopUp from "../../common/AlertPopUp";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomScrollbars from "../../util/CustomScrollbars";
import { getAdditionalDataAction } from "../../actions/Actions/OrderActions";
import moment from "moment";
import { IAssignServicePointInterface } from "./Interface/AssignServicePointInterface";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import CloseIcon from '@material-ui/icons/Close';
import { currencyConventor, readableDateTimeLocale } from 'util/helper';

const useStyles = makeStyles((theme) => ({
	closeBtn: {
		position: "absolute",
		top: "10px",
		right: "10px"
	}
}));

const AssignServicePointPrompt: React.FC<IAssignServicePointInterface> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const intl = useIntl();
	const geocoder = new google.maps.Geocoder();
	const { show, hideServicePoint, preferredDates, ...rest } = props;

	const [servicePointId, setServicePointId] = useState<any>((typeof (props.servicePointId) !== 'object' && props.servicePointId))
	const [orderId, setOrderId] = useState<string>(props.orderId)
	const [servicePointLoading, setServicePointLoading] = useState<boolean>(true);
	const [servicePointErrorMsg, setServicePointErrorMsg] = useState<string>('');
	const [servicePointDetail, setServicePointDetails] = useState<any>({});
	const [servicePointVisible, setServicePointVisible] = useState<boolean>(Boolean(servicePointId));
	const [servicePointList, setServicePointList] = useState<any>([]);
	const [servicePointSearchLoading, setServicePointSearchLoading] = useState<boolean>(false);

	const [orderLoading, setOrderLoading] = useState<boolean>(true);
	const [orderErrorMsg, setOrderErrorMsg] = useState<string>('');
	const [orderDetail, setOrderDetails] = useState<any>({});
	const [orderVisible, setOrderVisible] = useState<boolean>(Boolean(orderId));
	const [orderList, setOrderList] = useState<any>([]);
	const [orderSearchLoading, setOrderSearchLoading] = useState<boolean>(false);
	const [orderDetailServiceExpanded, setOrderDetailServiceExpanded] = useState<boolean>(false);
	const [orderDetailDepartmentExpanded, setOrderDetailDepartmentExpanded] = useState<boolean>(false);

	const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
	const [popUpType, setPopUpType] = useState<string>('warning');
	const [popUpMsg, setPopUpMsg] = useState<string>('')

	const department = useSelector((state: any) => state.department.selectedDepartment);
	const [additional_data, setAdditional_data] = useState<any>(null)
	const [selectedDepartment, setSelectedDepartment] = useState<string>('')
	const [preferred_dates, setPreferredDates] = useState<string>('')

	const fetchAdditionalData = (department: string, license: string, vehicleId: string, constructionYear: string) => {
		dispatch(getAdditionalDataAction(department, license, vehicleId, constructionYear, (status: string, data: any) => {
			if (status === 'success') {
				setAdditional_data(data)
			}
		}))
	}

	const fetchServicePoint = (id: string) => {
		setServicePointDetails({})
		setServicePointLoading(true);
		dispatch(getServicePointDetailAction(id, (result: string, response: any) => {
			if (result === 'success') {
				setServicePointDetails(response);
				setServicePointErrorMsg('')
				setServicePointVisible(true)
			} else {
				setServicePointErrorMsg(response)
				setServicePointDetails({})
			}
			setServicePointLoading(false);
		}))
	}


	const fetchOrderDetail = (id: string) => {
		setOrderDetails({})
		setOrderLoading(true);
		dispatch(getOrderDetailAction(id, (result: string, response: any) => {
			if (result === 'success') {
				setOrderDetails(response);
				setOrderErrorMsg('')
				setOrderVisible(true)
			} else {
				setOrderErrorMsg(response)
				setOrderDetails({});
			}
			setOrderLoading(false);
		}))
	}

	useEffect(() => {
		if (department && department.slug) {
			setSelectedDepartment(department.slug)
		}
	}, [department])

	useEffect(() => {
		if (!preferred_dates && ((preferredDates && preferredDates.length) > 0)) {
			setPreferredDates(preferredDates[0] && preferredDates[0].id);
		}
	}, [servicePointId, preferredDates]);

	useEffect(() => {
		if (department && department.slug) {
			setSelectedDepartment(department.slug)
		}
		if ((typeof (props.servicePointId) !== 'object' && props.servicePointId)) {
			setServicePointId(props.servicePointId)
			setServicePointVisible(true)
			fetchServicePoint(props.servicePointId)
		} else {
			setServicePointId('')
			setServicePointVisible(false)
		}
		if (props.orderId) {
			setOrderId(props.orderId)
			setOrderVisible(true)
			fetchOrderDetail(props.orderId)
		} else {
			setOrderId('')
			setOrderVisible(false)
		}
		setServicePointList([])
		setOrderList([])
	}, [props.orderId && props.servicePointId])

	useEffect(() => {
		if (orderDetail.id) {
			if (orderDetail.additional_data && orderDetail.additional_data.length > 0) {
				if (selectedDepartment !== '') {
					if (selectedDepartment === 'vehicles') {
						let license: string = '';
						let vehicleId: string = '';
						let constructionYear: string = '';
						orderDetail.additional_data.forEach((data: any) => {
							if (data.key === 'license-plate') {
								license = data.value ? data.value : ''
							}
							if (data.key === 'vehicle_id') {
								vehicleId = data.value ? data.value : ''
							}
							if (data.key === 'construction_year') {
								constructionYear = data.value ? data.value : ''
							}
						})
						fetchAdditionalData(selectedDepartment, license, vehicleId, constructionYear)
					} else {
						const routeInfo = orderDetail.additional_data.find((data: any) => data.key === 'route_information')
						if (routeInfo) {
							getAddressData(routeInfo['json_value']['origin']['place_id'], 'from')
							getAddressData(routeInfo['json_value']['destination']['place_id'], 'to')
						}
					}
				}
			}
		}
	}, [orderDetail, selectedDepartment]);

	const getAddressData = (placeId: string, type: string) => {
		geocoder.geocode({ placeId: placeId }, function (results, status) {
			if (status === "OK") {
				if (results[0]) {
					type === "from" ? setAdditional_data(prevState => {
						return { ...prevState, 'from_location': results[0].formatted_address }
					}) : setAdditional_data(prevState => {
						return { ...prevState, 'to_location': results[0].formatted_address }
					});
				}
			}
		});
	}

	const toggleServicePointVisible = () => {
		setServicePointVisible(!servicePointVisible)
	}

	const toggleOrderVisible = () => {
		setOrderVisible(!orderVisible)
	}

	const getOptions = (event: any, field: string) => {
		if (Boolean(event.target.value) && event.target.value.length > 1) {
			if (field === 'servicePoint') {
				setServicePointSearchLoading(true)
				dispatch(getServicePointListAction(event.target.value, (result: string, response: any) => {
					setServicePointList(result === 'success' ? response : [])
					setServicePointSearchLoading(false)
				}))
			} else {
				setOrderSearchLoading(true)
				dispatch(getOrderListAction(event.target.value, (result: string, response: any) => {
					setOrderList(result === 'success' ? response : [])
					setOrderSearchLoading(false)
				}))
			}
		}
	}

	const getSelectedOption = (event: any, value: any, reason: string, field: string) => {
		if (reason === 'select-option') {
			if (field === 'servicePoint') {
				setServicePointId(value.id)
				setServicePointDetails(value)
				setServicePointVisible(true)
			} else {
				setOrderId(value.id)
				setOrderDetails({});
				setOrderLoading(true);
				setOrderErrorMsg('')
				setOrderVisible(false)
				fetchOrderDetail(value.id)
			}
		}
	}

	const assignOrder = () => {
		setShowPopUpValue(true)
		setPopUpType('warning')
	}

	const renderServicePoint = () => {
		return (
			(servicePointVisible) ?
				servicePointLoading && !servicePointErrorMsg && !Boolean(servicePointDetail.id) ?
					<Spinner color={"primary"} /> :
					!servicePointLoading && servicePointErrorMsg && !Boolean(servicePointDetail.id) ?
						<h2>{servicePointErrorMsg}</h2> :
						<Card style={{ maxWidth: 345, zIndex: 10000 }}>
							<CardHeader
								action={
									<IconButton color="primary" aria-label="add to shopping cart" onClick={toggleServicePointVisible}>
										<ClearIcon />
									</IconButton>
								}
								title={servicePointDetail.name}
							/>
							<CardMedia
								style={{
									height: 140,
								}}
								image={servicePointDetail.avatar ? servicePointDetail.avatar : department && department.image && department.image.small}
								title={servicePointDetail.name}
							/>
							<CardContent>
								<h4><IntlMessages id={"orderDetailViewTable.id"} /> : {servicePointDetail.id}</h4>
								<h4><IntlMessages id={"partnerSettings.street"} /> : {servicePointDetail.street}</h4>
								<h4><IntlMessages id={"partnerSettings.city"} /> : {servicePointDetail.city}</h4>
								<h4><IntlMessages id={"partnerSettings.zipcode"} /> : {servicePointDetail.zip_code}</h4>
								<h4><IntlMessages
									id={"partnerUpcomingAssignment.distance"} /> : {props.extraData.distance && props.extraData.distance / 1000} KM
								</h4>
							</CardContent>
						</Card> : (!servicePointVisible) &&
				<Autocomplete
					className="w-100 mb-2 h-75"
					id="support-code"
					options={servicePointList}
					getOptionLabel={(option: { name: string }) => option.name}
					style={{ width: 300, zIndex: 10000 }}
					loading={servicePointSearchLoading}
					renderInput={(params) => <TextField {...params}
						label={<IntlMessages id="orderOptions.search-service-point" />}
						variant="outlined" />}
					onInputChange={(event) => getOptions(event, 'servicePoint')}
					onChange={(event, value, reason) => getSelectedOption(event, value, reason, 'servicePoint')}
				/>
		)
	}

	const renderOrderDetail = () => {
		return (
			orderVisible ?
				orderLoading && !orderErrorMsg && !Boolean(orderDetail.id) ? <Spinner color={"primary"} /> :
					!orderLoading && orderErrorMsg && !Boolean(orderDetail.id) ? <h2>{orderErrorMsg}</h2> :
						<Card style={{ maxWidth: 345 }}>
							<CardHeader
								action={
									<IconButton color="primary" aria-label="add to shopping cart" onClick={toggleOrderVisible}>
										<ClearIcon />
									</IconButton>
								}
								title={<IntlMessages id={"customerDetails"} />}
							/>
							<CardContent>
								<h4><IntlMessages id={"employeesTable.name"} /> :{orderDetail.name}</h4>
								<h4><IntlMessages id={"employeesTable.email"} /> : {orderDetail.email}</h4>
								<h4><IntlMessages id={"partnerSettings.street"} /> : {orderDetail.address.street} {orderDetail.address.street_number}</h4>
								<h4><IntlMessages id={"partnerSettings.city"} /> : {orderDetail.address.city}</h4>
								<h4><IntlMessages id={"partnerSettings.zipcode"} /> : {orderDetail.address.zip_code}</h4>
							</CardContent>
							<CardHeader
								action={
									<IconButton color="primary" aria-label="add to shopping cart"
										onClick={() => setOrderDetailServiceExpanded(!orderDetailServiceExpanded)}>
										<ExpandMoreIcon />
									</IconButton>
								}
								title={<IntlMessages id={"selectedServiceLabel"} />}
							/>
							<Collapse in={orderDetailServiceExpanded} timeout="auto" unmountOnExit>
								{orderDetail.services ?
									<List className="pinned-list" subheader={<div />} style={{ height: 150 }}>
										<CustomScrollbars className="scrollbar" style={{ height: '100%' }}>
											{orderDetail.services.map((item: any) =>
												<ListItem button key={item.id} className='col-12'>
													<ListItemText primary={item.name} className='col-9' />
													<ListItemText primary={currencyConventor((item.calculated_price_inc_vat||0)/100, item.currency_code_iso)} className='col-9' />
												</ListItem>
											)}
										</CustomScrollbars>
									</List> : <h4 style={{ textAlign: 'center' }}><IntlMessages id={"noServiceSelected"} /></h4>}
							</Collapse>
							<CardHeader
								action={
									<IconButton color="primary"
										onClick={() => setOrderDetailDepartmentExpanded(!orderDetailDepartmentExpanded)}>
										<ExpandMoreIcon />
									</IconButton>
								}
								title={<IntlMessages id={"orderOverview.Department"} />}
							/>
							<Collapse in={orderDetailDepartmentExpanded} timeout="auto" unmountOnExit>
								<CardContent>
									{Boolean(additional_data) &&
										<div>
											{selectedDepartment !== '' && selectedDepartment === 'vehicles' ?
												<div>
													<h5><b><IntlMessages id="vehicleStepperStep1.licensePlate" /> : </b> {additional_data['plate']}
													</h5>
													<h5><b><IntlMessages id="brand" /> : </b> {additional_data['brand']['name']} </h5>
													<h5><b><IntlMessages id="model" /> : </b> {additional_data['model']['name']} </h5>
													<h5><b><IntlMessages id="fuel" /> : </b> {additional_data['fuel']['name']} </h5>
													<h5><b><IntlMessages id="vehicleStepperStep1.constructionYear" /> :
												</b> {moment(additional_data['construction_year']).format('DD/MM/YYYY')} </h5>
													<h5><b><IntlMessages id="mandatory_service_expiry" /> :
												</b> {moment(additional_data['mandatory_service_expiry_date']).format('DD/MM/YYYY')} </h5>
													<h5><b><IntlMessages id="vehicle.vehicleID" /> : </b> {additional_data['vehicle_id']} </h5>
												</div> :
												<div>
													<h5><b><IntlMessages id="fromLocation" /> : </b> {additional_data['from_location']}</h5>
													<h5><b><IntlMessages id="toLocation" /> : </b> {additional_data['to_location']}</h5>
												</div>}
										</div>
									}
								</CardContent>
							</Collapse>
						</Card> :
				!orderVisible &&
				<Autocomplete
					className="w-100 mb-2 h-75"
					id="support-code"
					options={orderList}
					getOptionLabel={(option: { id: string }) => option.id.toString()}
					style={{ width: 300, zIndex: 10000 }}
					loading={orderSearchLoading}
					renderInput={(params) => <TextField {...params}
						label={<IntlMessages id="searchOrder" />}
						variant="outlined" />}
					onInputChange={(event) => getOptions(event, 'order')}
					onChange={(event, value, reason) => getSelectedOption(event, value, reason, 'order')}
				/>
		)
	}

	const handleTitle = () => {
		if (popUpType === 'warning') {
			return <IntlMessages id="sweetAlerts.assignServicePointWarning" />
		} else if (popUpType === 'success') {
			return <IntlMessages id="sweetAlerts.assignServicePointSuccess" />
		} else if (popUpType === 'danger') {
			return <IntlMessages id="sweetAlerts.assignServicePointError" />
		} else {
			return <IntlMessages id="sweetAlerts.sendCallBackLoading" />
		}
	}

	const handleOnConfirmButton = () => {
		if (popUpType === 'warning') {
			setPopUpType('loading')
			setShowPopUpValue(true)
			dispatch(assignServicePointAction(servicePointId, orderId, preferred_dates, (response: string, msg: string) => {
				setPopUpType(response)
				setPopUpMsg(msg)
				setShowPopUpValue(true);
				setPreferredDates('');
			}))
		} else if (popUpType === 'success') {
			setShowPopUpValue(false)
			setPopUpType('');
			setPreferredDates('');
			props.onCancel(true)
		} else {
			setShowPopUpValue(false)
			onCloseAssignService();
		}
	}

	const handleOnCancelButton = () => {
		setShowPopUpValue(false);
		setPopUpType('');
		setPopUpMsg('');
	}

	const onCloseAssignService = () => {
		setPreferredDates('');
		props.onCancel(false)
	}

	const onPreferredDatesChange = (event: React.ChangeEvent<{ name?: string; value: unknown; }>) => {
		const value = event.target.value as string;
		setPreferredDates(value);
	};

	const localDateTimeFormat = intl.formatMessage({ id: 'localeDateTime', defaultMessage: "DD-MM-YYYY hh:mm:ss" });

	return (
		<Dialog open={show} fullWidth={true} maxWidth={'md'}>
			<DialogTitle id="customized-dialog-title" style={{ borderBottom: '1px solid #bdbdbd' }}>
				<IntlMessages id="assignOrderTitle" />
				<IconButton className={classes.closeBtn} onClick={onCloseAssignService} aria-label="close">
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Container>
					<Row>
						<Col sm="6">
							{renderServicePoint()}
						</Col>
						<Col sm="6">
							{renderOrderDetail()}
						</Col>
					</Row>
				</Container>
				{/*<AlertPopUp show={assignPopup} title={assignPopupMsg} type={assignPopupType} onConfirm={resetAssignPopUp}/>*/}
				<AlertPopUp
					title={handleTitle()}
					show={showPopUpValue}
					message={popUpMsg && popUpMsg}
					success={popUpType === 'success'}
					warning={popUpType === 'warning'}
					danger={popUpType === 'danger'}
					disabled={popUpType === 'loading'}
					showCancel={popUpType === 'warning'}
					confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
					onConfirm={handleOnConfirmButton}
					onCancel={handleOnCancelButton}
				/>
			</DialogContent>
			<DialogActions style={{ borderTop: '1px solid #bdbdbd' }}>
				{
					preferredDates.length > 0 &&
					<div className={'col-6'}>
						<FormControl className="w-100 mb-2 h-75">
							<InputLabel id="preferred_dates-simple-select-helper-label"><IntlMessages id={`preferredDate`} /></InputLabel>
							<Select
								labelId="preferred_dates-simple-select-helper-label"
								id="preferred_dates-simple-select-helper"
								value={preferred_dates}
								onChange={onPreferredDatesChange}
							>
								{
									preferredDates.length > 0 && preferredDates.map((option: any) => {
										return <MenuItem key={option.id} value={option.id}>{readableDateTimeLocale(option.start_date, localDateTimeFormat)} - {option.description}</MenuItem>
									})
								}
							</Select>
						</FormControl>
					</div>
				}
				<div className={'col-3'}>
					{/* <Button autoFocus variant="outlined" style={{marginRight: '10px'}} onClick={onCloseAssignService} color="secondary">
                        <IntlMessages id={"sweetAlerts.cancelButton"}/>
                    </Button> */}
					<UserHasPermission permission="booking-service-assign-order-to-service-point">
						<Button autoFocus variant="outlined" disabled={!preferred_dates} onClick={assignOrder} color="primary">
							<IntlMessages id={"assign"} />
						</Button>
					</UserHasPermission>					
				</div>
			</DialogActions>
		</Dialog>

	)
}

export default AssignServicePointPrompt;
