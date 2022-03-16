import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {
	Button,
	CircularProgress,
	FormControl,
	Input,
	MenuItem,
	Select,
	InputLabel,
	InputAdornment,
	IconButton, Chip, Avatar,
	TextField, CardHeader
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
	Card, CardBody,
	CardFooter
} from "reactstrap";
import {
	getServiceList,
	setSelectedService,
	setServicePrice,
	setServiceData, setCustomDescriptionService
} from "../../../actions/Actions/OrderActions";
import moment from "moment";
import { DatePicker } from "material-ui-pickers";
import CustomList from "../../CustomList";
import IntlMessages from "../../../util/IntlMessages";
import Cancel from '@material-ui/icons/Cancel';
import AlertPopUp from "../../../common/AlertPopUp";
import { useIntl } from "react-intl";
import { IService } from "./Interface/Step3Interface";
import { CURRENCY_CODES } from "../../../constants/common.constants";
import LoadingOverlay from 'common/LoadingOverlay';
import { sortObjectOnKeys } from 'util/helper';
const CouriersStep3 = (props: any) => {

	const getCurrentLocale = () => {
		const data = localStorage.getItem('locale');
		if (data) {
			return JSON.parse(data && data).locale
		} else {
			return 'en';
		}
	};
	/**
	 *  time options data
	 */

	const timeOptions = [
		{
			id: "app.select-time",
			value: ""
		},
		{
			id: "app.between8and9",
			value: "08:00"
		},
		{
			id: "app.between9and10",
			value: "09:00"
		},
		{
			id: "app.between10and11",
			value: "10:00"
		},
		{
			id: "app.between11and12",
			value: "11:00"
		},
		{
			id: "app.between12and13",
			value: "12:00"
		},
		{
			id: "app.between13and14",
			value: "13:00"
		},
		{
			id: "app.between14and15",
			value: "14:00"
		},
		{
			id: "app.between15and16",
			value: "15:00"
		},
		{
			id: "app.between16and17",
			value: "16:00"
		},
		{
			id: "app.between17and18",
			value: "17:00"
		},
		{
			id: "app.between18and19",
			value: "18:00"
		},
		{
			id: "app.between19and20",
			value: "19:00"
		},
		{
			id: "app.between20and21",
			value: "20:00"
		},
		{
			id: "app.between21and22",
			value: "21:00"
		}
	];

	const dispatch = useDispatch();

	const { formatMessage: f } = useIntl();

	/**
	 *  reducer state
	 */
	const serviceState = useSelector((state: any) => state.orderState.orderCreate.services);
	const orderState = useSelector((state: any) => state.orderState.orderCreate.order);
	const orderCreateState = useSelector((state: any) => state.orderState.orderCreate);
	/**
	 *  selected services from order state
	 */
	const selectedServicesState = useSelector((state: any) => state.orderState.orderCreate);
	/**
	 *  local services list state
	 */
	const [services, setServices] = useState<any>([]);
	const [displayServices, setDisplayServices] = useState([]);
	const [filterList, setFilterList] = useState<string[]>([]);
	const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
	const [selectedServices, setSelectedServices] = useState<any>([]);
	const permissionState = useSelector((state: any) => state.auth.authUser.abilities);

	/**
	 *  selected collect date state
	 */
	const [selectedCollectDate, setSelectedCollectDate] = useState<any>(moment().format());
	/**
	 *  selected deliver date state
	 */
	const [selectedDeliverDate, setSelectedDeliverDate] = useState<any>(moment().format());
	/**
	 *  selected collect time state
	 */
	const [selectedCollectTime, setSelectedCollectTime] = useState<string>('');
	/**
	 *  selected devilver time state
	 */
	const [selectedDeliverTime, setSelectedDeliverTime] = useState<string>('');
	/**
	 *  search service state
	 */
	const [searchService, setSearchServices] = useState<string>('');
	/**
	 *  alert pop up state handler
	 */
	const [alert, setAlert] = useState(false);
	const [additionalServicesText, setAdditionalServicesText] = useState<string>('');
	const [commentsToCourier, setCommentsToCourier] = useState<string>('');
	const currencyConvert = CURRENCY_CODES.find(code => code.currency_code_iso === (getCurrentLocale() === 'en' ? 'DOLLAR' : 'EUR'));
	/**
	 *  alert pop up message state handler
	 */
	const [alertMsg, setAlertMsg] = useState('');

	useEffect(() => {
		if (orderState.courier && !serviceState) {
			setSelectedServices([])
			dispatch(getServiceList(prepareInitData(), 'new'));
		}
		if (orderState.courier && serviceState) {
			setServices(serviceState)
			setDisplayServices(serviceState)
		}
		if (orderState.courier && serviceState && orderState.shipmentData.services) {
			const { deliver, collect } = orderState.shipmentData.services;
			setSelectedDeliverDate(deliver.date || moment().format());
			setSelectedDeliverTime(deliver.time);
			setSelectedCollectDate(collect.date || moment().format());
			setSelectedCollectTime(collect.time);
		}
		if (orderState.courier && orderCreateState.supportCodeData) {
			const { supportCodeData } = orderCreateState;
			if (supportCodeData.preferred_pickup_moments) {
				let date = supportCodeData.preferred_pickup_moments[0].datetime;
				let isBefore = moment(date).isBefore(new Date());
				setSelectedCollectDate((!isBefore && date) || moment().format());
			}
			if (supportCodeData.preferred_delivery_moments) {
				let date = supportCodeData.preferred_delivery_moments[0].datetime;
				let isBefore = moment(date).isBefore(new Date());
				setSelectedDeliverDate((!isBefore && date) || moment().format());
			}
		}
		if (orderCreateState.orderPrefillData && orderCreateState.orderPrefillData.preferred_dates.length) {
			let date = moment(orderCreateState.orderPrefillData.preferred_dates[0].start_date)
			let isBefore = moment(date).isBefore(new Date());
			let deliverDate = moment(orderCreateState.orderPrefillData.preferred_dates[0].end_date)
			let isBeforeDeliverDate = moment(deliverDate).isBefore(new Date());
			setSelectedCollectDate((!isBefore && date) || moment().format());
			setSelectedDeliverDate((!isBeforeDeliverDate && deliverDate) || moment().format());
			if (!isBefore && !isBeforeDeliverDate) {
				setSelectedDeliverTime(moment.utc(orderCreateState.orderPrefillData.preferred_dates[0].start_date).format("HH:mm"));
				setSelectedCollectTime(moment.utc(orderCreateState.orderPrefillData.preferred_dates[0].end_date).format("HH:mm"));
			}
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 *  prepare data to get service list
	 */
	const prepareInitData = () => {
		let servicesPayload = selectedServicesState && selectedServicesState.selectedServices && selectedServicesState.selectedServices.map((item) => {
			return ({ amount: item.amount, id: item.id, price: item.price })
		})

		const selectedCargo: any = orderState.courierTypes.find((courier: any) => courier.checked)
		const data = {
			from: orderState.courier.locationsLatLng[0].placeId,
			to: orderState.courier.locationsLatLng[1].placeId,
			selected_services: servicesPayload,
			// order: '',
			cargo_type_id: selectedCargo.id,
			cargo_type: selectedCargo.name,
			dimensions: {
				width: orderState.shipmentData.dimensions.sizes.width,
				height: orderState.shipmentData.dimensions.sizes.height,
				length: orderState.shipmentData.dimensions.sizes.length,
				weight: orderState.shipmentData.dimensions.sizes.weight
			},
			transportation_vehicle_id: getSelectedCourierVehicleId()
		};
		return btoa(unescape(encodeURIComponent(JSON.stringify(sortObjectOnKeys(data)))))
	};

	/**
	 *  get selected courier vehicle id
	 */
	const getSelectedCourierVehicleId = () => {
		return orderState.courierVehicleTypes.find((vehicle) => vehicle.checked).id
	};


	const textFormat = () => {
		return (
			<React.Fragment>
				<IntlMessages id="selectedServices" /> : {selectedServiceCount()} - <IntlMessages id="totalPrice" /> : {(selectedServiceTotal() / 100).toFixed(2)}
			</React.Fragment>
		)
	}

	useEffect(() => {
		if (services && displayServices) {
			props.onHeadingChange(textFormat(), 2);
			// props.onHeadingChange(`${f({
			// 	id: 'selectedServices',
			// 	defaultMessage: 'Selected Services'
			// })} : ${selectedServiceCount()} - ${f({
			// 	id: 'totalPrice',
			// 	defaultMessage: 'Total Price'
			// })} : ${(selectedServiceTotal() / 100).toFixed(2)}`, 2);
		}
	}, [displayServices, services]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (serviceState) {
			if (searchService.length === 0) {
				const fill: string[] = [];
				serviceState.forEach((service: any) => {
					if (!fill.includes(service.category.name)) {
						fill.push(service.category.name)
					}
				})
				setFilterList(fill)
				setServices(serviceState);
				selectedFilter.length !== 0 ? setDisplayServiceByFilter() : setDisplayServices(serviceState)
			} else {
				setServices(serviceState);
			}
			const selected: any[] = []
			serviceState.forEach((service: any) => {
				if (service.checked) {
					selected.push({ id: service.id })
				}
			})
		}
	}, [serviceState]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (serviceState) {
			if (selectedFilter.length !== 0) {
				setDisplayServiceByFilter()
			} else {
				setDisplayServices(serviceState)
			}
		}
	}, [selectedFilter])

	const setDisplayServiceByFilter = () => {
		setDisplayServices(serviceState.filter((service: any) => selectedFilter.includes(service.category.name)));
	}

	useEffect(() => {
		if (searchService.length) {
			const searched = displayServices.filter((service: IService) => service.name.toLowerCase().includes(searchService.toLowerCase()));
			setDisplayServices(searched)
		} else if (serviceState) {
			selectedFilter.length !== 0 ? setDisplayServiceByFilter() : setDisplayServices(serviceState)
		}
	}, [searchService]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 *  text field handler
	 * @param event
	 * @param fieldName
	 */
	const inputChangeHandler = (event: any, fieldName: string) => {
		const value = (fieldName === 'selectedDeliverDate' || fieldName === 'selectedCollectDate') ? event : event.target.value;
		switch (fieldName) {
			case 'selectedCollectDate':
				setSelectedCollectDate(value);
				setSelectedDeliverDate(value);
				break;
			case 'selectedDeliverDate':
				setSelectedDeliverDate(value);
				break;
			case 'selectedCollectTime':
				setSelectedCollectTime(value);
				break;
			case 'selectedDeliverTime':
				setSelectedDeliverTime(value);
				break;
			default:
				break;
		}
	};

	/**
	 *  service selection toggle
	 * @param id
	 */
	const handleToggle = (event: React.MouseEvent<HTMLElement>, id: any, checked: boolean) => {
		const checkboxCheck = services.filter((service: any) => service.id === id);
		if (!checkboxCheck) {
			const selected: any[] = [...selectedServices]
			selected.push({ id })
			setSelectedServices(selected);
		} else {
			const update = selectedServices.filter((service: any) => service.id !== id)
			setSelectedServices(update);
		}
		dispatch(setSelectedService(id));
		dispatch(getServiceList(prepareInitData(), 'new'));
	};

	useEffect(() => {
		dispatch(getServiceList(prepareInitData(), 'new'));
	}, [])

	useEffect(() => {
		if (selectedServices && selectedServices.length > 0) {
			dispatch(getServiceList(prepareInitData(), 'update'));
		}
	}, [selectedServices])

	/**
	 *  handle price change
	 * @param event
	 * @param id
	 */
	const handlePriceChange = (value: any, id: any) => {
		dispatch(setServicePrice(id, value * 100));
	};

	/**
	 *  get selected service count
	 */
	const selectedServiceCount = () => {
		return services.filter((service: any) => service.checked).length
	};

	/**
	 *  get total cost of selected service
	 */
	const selectedServiceTotal = () => {
		let total = 0;
		services.forEach((service: any) => {
			if (service.checked) {
				total += +service.service_price.price
			}
		});
		return total;
	};

	/**
	 *  render service selection
	 */
	const renderServices = (
		<Card className="shadow border-0">
			{displayServices ?
				<div>
					{selectedServicesState.isUpdatingPrice && <LoadingOverlay />}
					<CustomList dataList={displayServices} onToggle={handleToggle} onPriceChange={handlePriceChange} permissionState={permissionState} />
				</div> :
				<div className="manage-margin">
					<CircularProgress size={50} />
				</div>
			}
			<CardFooter>
				<div className="row">
					<div className="col-6">
						<IntlMessages id={'selectedServices'}
							defaultMessage={'Selected Services'} /> : {services && selectedServiceCount()}
					</div>
					<div className="col-6 flex-end">
						<IntlMessages id={'totalPrice'}
							defaultMessage={'Total Price'} /> :{currencyConvert ? currencyConvert.symbol : ''}{services && (selectedServiceTotal() / (currencyConvert ? currencyConvert.converters : 1))}
					</div>
				</div>
			</CardFooter>
		</Card>
	);

	/**
	 *  submit and go to next handler
	 */
	const onSubmit = () => {
		if (verifyData()) {
			dispatch(setServiceData(prepareData()));
			props.handleNext();
		}
	};

	/**
	 *  prepare data to save
	 */
	const prepareData = () => {
		return {
			collect: {
				date: moment(selectedCollectDate).format('ddd MMM DD YYYY'),
				displayDate: moment(selectedCollectDate).format('DD-MM-YYYY'),
				time: selectedCollectTime
			},
			deliver: {
				date: moment(selectedCollectDate).format('ddd MMM DD YYYY'),
				displayDate: moment(selectedDeliverDate).format('DD-MM-YYYY'),
				time: selectedDeliverTime
			}
		}
	};

	/**
	 *  verify data that all input filled
	 */
	const verifyData = () => {
		if (selectedServiceCount()) {
			return true;
		} else {
			setAlert(true);
			setAlertMsg('Please Fill All The Details');
			return false;
		}
	};

	/**
	 *  search text field handler
	 * @param event
	 */
	const searchBoxChanged = (event: any) => {
		setSearchServices(event.target.value);
	};

	/**
	 *  render time selection
	 * @param type
	 */
	const renderTime = (type: any) => {
		const fieldValue = type === 'shipment' ? 'selectedCollectTime' : 'selectedDeliverTime';

		const selected = moment(selectedCollectDate).format('DD-MM-YYYY')
		const today = selected === moment(new Date()).format('DD-MM-YYYY')
		let selectedCollectTimeOption: any = [];
		let selectedDeliverTimeOption: any = [];
		if (fieldValue === 'selectedCollectTime') {
			if (today) {
				const time = moment(selectedCollectDate).format('HH:mm')
				const filterData = timeOptions.filter((p: any) => p.value > time)
				selectedCollectTimeOption = filterData
			} else {
				selectedCollectTimeOption = timeOptions
			}
		} else if (fieldValue === 'selectedDeliverTime') {
			const active = moment(selectedDeliverDate).format('DD-MM-YYYY')
			const todayDate = active === moment(new Date()).format('DD-MM-YYYY')
			if (todayDate) {
				const time = moment(selectedDeliverDate).format('HH:mm')
				const filterData = timeOptions.filter((p: any) => p.value > time)
				selectedDeliverTimeOption = filterData
			} else {
				selectedDeliverTimeOption = timeOptions
			}
		}

		const timeOptionsList = fieldValue === 'selectedCollectTime' ? selectedCollectTimeOption : selectedDeliverTimeOption
		return (
			<Select
				value={type === 'shipment' ? selectedCollectTime : selectedDeliverTime}
				onChange={(event: any) => inputChangeHandler(event, fieldValue)}
				input={<Input id="ageSimple1" />}
			>
				{timeOptionsList.map(time => {
					if (type === 'deliver' && selectedCollectTime) {
						if (moment(selectedCollectDate).format('DD-MM-YYYY') === moment(selectedDeliverDate).format('DD-MM-YYYY')) {
							if (time.value > selectedCollectTime) {
								return (<MenuItem key={time.id} value={time.value}>
									<IntlMessages id={time.id} />
								</MenuItem>)
							} else {
								return null;
							}
						} else {
							return (<MenuItem key={time.id} value={time.value}>
								<IntlMessages id={time.id} />
							</MenuItem>)
						}
					}
					return (<MenuItem key={time.id} value={time.value}>
						<IntlMessages id={time.id} />
					</MenuItem>)
				})}
			</Select>
		)
	};

	const getCategoryServiceCount = (category: string) => {
		return serviceState.filter((service: any) => service.category.name === category).length
	}

	const onCategorySelect = (category: string) => {
		const temp: string[] = [...selectedFilter]
		if (!temp.includes(category)) {
			temp.push(category)
		} else {
			temp.splice(temp.findIndex((item: string) => item === category), 1)
		}
		setSelectedFilter(temp)
	}


	const customDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>, service) => {
		dispatch(setCustomDescriptionService(service, event.target.value))
	}

	const customService = selectedServicesState &&
	selectedServicesState.selectedServices && selectedServicesState.selectedServices.length > 0 &&
		selectedServicesState.selectedServices.filter((service: any) => service.options.length > 0 && service.options[0].enabled)

	return (
		<div>
			<AlertPopUp show={alert} warning title={alertMsg} onConfirm={() => setAlert(false)} />
			<div className="row ">
				<div className="col-5">
					<label><IntlMessages id={'servicesTitle'} defaultMessage={'Services'} /> :</label>
					<FormControl className="mb-3" fullWidth>
						<InputLabel htmlFor="search_service">Search Service</InputLabel>
						<Input
							id="search_service"
							type='text'
							value={searchService}
							onChange={(event: any) => searchBoxChanged(event)}
							endAdornment={
								<InputAdornment position="end">
									{searchService.length ?
										<IconButton
											onClick={() => setSearchServices('')}
										>
											<Cancel />
										</IconButton> : null}
								</InputAdornment>
							}
						/>
					</FormControl>
				</div>
				<div className="col-12 mb-3">
					{filterList && filterList.map((item: string) =>
						<>
							<Chip
								avatar={<Avatar>{getCategoryServiceCount(item)}</Avatar>}
								size="medium"
								onClick={() => onCategorySelect(item)}
								className="cursor-pointer mx-2"
								color="primary"
								variant={(selectedFilter.includes(item)) ? 'default' : 'outlined'}
								label={item} />
						</>)}
				</div>
				<div className="col-12">
					<FormControl className="mb-3" fullWidth>
						<div className="row ">
							<div className="col-12 col-sm-6">
								{renderServices}
							</div>
							<div className="col-12 col-sm-6">
								{/*<TextField*/}
								{/*	type="textarea"*/}
								{/*	variant="outlined"*/}
								{/*	className="mb-3"*/}
								{/*	fullWidth style={{ width: '100%' }}*/}
								{/*	multiline={true}*/}
								{/*	rows={8}*/}
								{/*	value={props.additional_services_text}*/}
								{/*	onChange={(event) => props.setAdditionalText(event.target.value)}*/}
								{/*/>*/}
								{/*<TextField*/}
								{/*	type="textarea"*/}
								{/*	variant="outlined"*/}
								{/*	fullWidth style={{ width: '100%' }}*/}
								{/*	multiline={true}*/}
								{/*	rows={8}*/}
								{/*	value={props.comments_to_courier}*/}
								{/*	onChange={(event) => props.setCommentCourier(event.target.value)}*/}
								{/*/>*/}
								{customService && customService.map((service: any) => {
									return <Card>
										<CardHeader>{service.name}</CardHeader>
										<CardBody>
											<FormControl className="mb-3" fullWidth>
												<InputLabel htmlFor="custom_description">
													<IntlMessages id={'customServiceLabel'} defaultMessage={'Custom Description'}/></InputLabel>
												<Input
													id="custom_description"
													type='text'
													value={service.custom_description ? service.custom_description: ''}
													required={service.required}
													multiline
													rows={2}
													onChange={(event: React.ChangeEvent<HTMLInputElement>) => customDescriptionChange(event, service)}
												/>
											</FormControl>
										</CardBody>
									</Card>
								})}
							</div>
						</div>
						{selectedServicesState.serviceError &&
							<div className="row">
								<div className="col-4 mb-2" >
									<Alert severity="error">{selectedServicesState.serviceError}!</Alert>
								</div>
							</div>
						}
					</FormControl>
					<FormControl className="mb-3" fullWidth>
						<label><IntlMessages id={'timeToCollectShipmentTitle'} defaultMessage={'Time To Collect Shipment Title'} /> :</label>
						<div className="row">
							<div className="col-4">
								<DatePicker
									fullWidth
									dateFormat="dd-MM-yyyy"
									minDate={new Date()}
									value={selectedCollectDate}
									onChange={(event: any) => inputChangeHandler(event, 'selectedCollectDate')}
									animateYearScrolling={false}
									leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
									rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
								/>
							</div>
							<div className="col-8">
								{renderTime('shipment')}
							</div>
						</div>
					</FormControl>
					<FormControl className="mb-3" fullWidth>
						<label><IntlMessages id={'timeToDeliverShipmentTitle'} defaultMessage={'Time To Deliver Shipment Title'} /> :</label>
						<div className="row">
							<div className="col-4">
								<DatePicker
									fullWidth
									dateFormat="dd-MM-yyyy"
									minDate={selectedCollectDate}
									value={selectedDeliverDate}
									onChange={(event: any) => inputChangeHandler(event, 'selectedDeliverDate')}
									animateYearScrolling={false}
									leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
									rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
								/>
							</div>
							<div className="col-8">
								{renderTime('deliver')}
							</div>
						</div>
					</FormControl>
				</div>
			</div>

			<div className="mt-2">
				<div>
					<Button
						disabled={props.activeStep === 0}
						onClick={props.handleBack}
						className="jr-btn"
					>
						<IntlMessages id="appModule.back" />
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={onSubmit}
						className="jr-btn"
					>
						{props.activeStep === props.steps.length - 1 ? <IntlMessages id="appModule.finish" /> : <IntlMessages id="appModule.next" />}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CouriersStep3;
