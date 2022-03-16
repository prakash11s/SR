import React, { useEffect, useState } from 'react';
import {
	Button,
	Input,
	FormControl,
	InputLabel,
	CircularProgress,
	InputAdornment,
	IconButton,
	Chip, Avatar,
	TextField
} from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import { getServiceList, setSelectedService, setServicePrice, setCustomDescriptionService } from '../../../actions/Actions/OrderActions';
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader
} from 'reactstrap';

import CustomList from "../../CustomList";
import Cancel from '@material-ui/icons/Cancel';
import Alert from '@material-ui/lab/Alert';
import IntlMessages from "../../../util/IntlMessages";
import AlertPopUp from "../../../common/AlertPopUp";
import {
	IVehiclesStep2Props,
	IRootStep2State,
	IService
} from './Interface/Step2Interface';
import { useIntl } from "react-intl";
import LoadingOverlay from 'common/LoadingOverlay';
import { sortObjectOnKeys } from 'util/helper';
import { SET_SELECTED_SERVICES, UPDATE_CLIENT_DETIALS, UPDATE_RECIEVER_DETIALS, UPDATE_SENDER_DETIALS } from 'constants/ActionTypes';

const VehiclesStep2 = (props: IVehiclesStep2Props) => {

	/**
	 *  dispatch
	 */
	const dispatch = useDispatch();

	const { formatMessage: f } = useIntl();


	/**
	 *  service state
	 */
	const serviceState = useSelector((state: IRootStep2State) => state.orderState.orderCreate.services);
	const permissionState = useSelector((state: any) => state.auth.authUser.abilities);

	/**
	 *  order prefill state
	 */
	const orderPrefillState = useSelector((state: IRootStep2State) => state.orderState.orderCreate.orderPrefillData);

	/**
	 *  vehicle data from order state
	 */
	const vehicleState = useSelector((state: IRootStep2State) => state.orderState.orderCreate.order.vehicle);

	/**
	 *  selected services from order state
	 */
	const selectedServicesState = useSelector((state: any) => state.orderState.orderCreate);

	/**
	 *  services handler state
	 */
	const [services, setServices] = useState([]);
	const [displayServices, setDisplayServices] = useState([]);
	const [filterList, setFilterList] = useState<string[]>([]);
	const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
	const [selectedServices, setSelectedServices] = useState<any>([]);
	const [additionalText, setAdditionalText] = useState<string>('');

	/**
	 * Error validation for selected services
	 */
	const [error, setError] = useState('');

	/**
	 *  search service handler
	 */
	const [searchService, setSearchServices] = useState('');

	/**
	 *  alert pop up handler
	 */
	const [alert, setAlert] = useState(false);
	useEffect(() => {
		let supportServices = selectedServicesState.supportCodeData && selectedServicesState.supportCodeData.selected_services || [];
		if (vehicleState && !serviceState) {
			setSelectedServices(supportServices);
			setTimeout(()=>{
				dispatch(getServiceList(prepareVehicleData(supportServices), 'new'));
			},400)
		}
		if (vehicleState && serviceState) {
			setServices(serviceState)
			setDisplayServices(serviceState)
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 *  prepare data to get service list
	 */
	const prepareVehicleData = (payload?:any) => {
		let servicesPayload = selectedServicesState && selectedServicesState.selectedServices && selectedServicesState.selectedServices.map((item) => {
			return ({ amount: item.amount, id: item.id, price: item.price })
		});
		const data = {
			selected_services: (servicesPayload && servicesPayload.length > 0 ? servicesPayload : payload),
			vehicle_id: vehicleState.vehicleData.vehicle_id
		};
		if (vehicleState.vehicleData.plate_id)
			data['license-plate'] = vehicleState.vehicleData.plate_id;
		else {
			data['construction_year'] = vehicleState.construction_year;
			data['fuel_type_id'] = vehicleState.fuel.id
		}

		return btoa(unescape(encodeURIComponent(JSON.stringify(sortObjectOnKeys(data)))));
	};

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
				selectedFilter.length !== 0 ? setDisplayServiceByFilter() : setDisplayServices(serviceState);
			} else {
				setServices(serviceState);
				if (searchService.length) {
					const searched = serviceState.filter((service: IService) => service.name.toLowerCase().includes(searchService.toLowerCase()));
					setDisplayServices(searched);
				}
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
				setDisplayServices(serviceState);
			}
		}
	}, [selectedFilter])

	const setDisplayServiceByFilter = () => {
		setDisplayServices(serviceState.filter((service: any) => selectedFilter.includes(service.category.name)));
	}

	useEffect(() => {
		if (searchService.length) {
			const searched = serviceState.filter((service: IService) => service.name.toLowerCase().includes(searchService.toLowerCase()));
			setDisplayServices(searched)
		} else if (serviceState) {
			selectedFilter.length !== 0 ? setDisplayServiceByFilter() : setDisplayServices(serviceState)
		}
	}, [searchService]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (displayServices && serviceState) {
			props.onHeadingChange(`${f({
				id: 'selectedServices',
				defaultMessage: 'Selected Services'
			})} : ${selectedServiceCount()} - ${f({
				id: 'totalPrice',
				defaultMessage: 'Total Price'
			})}: ${(selectedServiceTotal() / 100).toFixed(2)}`, 1);
		}
	}, [displayServices, serviceState]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 *  search input field handler
	 * @param event
	 */
	const searchBoxChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchServices(event.target.value);
	};

	/**
	 *  service selection toggle handler
	 * @param event
	 * @param id
	 * @param checked
	 */
	const handleToggle = (event: React.MouseEvent<HTMLElement>, id: number, checked: boolean) => {
		setError('');
		const checkboxCheck = services.filter((service: any) => service.id === id);
		if (!checkboxCheck) {
			const selected: any[] = [...selectedServices]
			selected.push({ id })

			setSelectedServices(selected);
		}
		else {
			const update = selectedServices.filter((service: any) => service.id !== id)
			setSelectedServices(update);
		}
		dispatch(setSelectedService(id));
		dispatch(getServiceList(prepareVehicleData(), 'new'));
	};

	// useEffect(() => {
	// 	if (selectedServices && selectedServices.length > 0) {
	// 		dispatch(getServiceList(prepareVehicleData(), 'update'));
	// 	}
	// }, [selectedServices])

	/**
	 *  service price change handler
	 * @param event
	 * @param id
	 */
	const handlePriceChange = (value, id: number) => {
		dispatch(setServicePrice(id, value * 100));
	};

	/**
	 *  to get selected service count
	 */
	const selectedServiceCount = () => {
		return services.filter((service: IService) => service.checked).length
	};

	/**
	 *  to get total price of selected services
	 */
	const selectedServiceTotal = () => {
		let total = 0;
		services.forEach((service: IService) => {
			if (service.checked) {
				total += +service.service_price.price
			}
		});
		return total;
	};

	/**
	 *  render service list
	 */
	const renderList = (
		<Card className="shadow border-0" disabled >
			{displayServices ?
				<div>
					{selectedServicesState && selectedServicesState.isUpdatingPrice && <LoadingOverlay />}
					<CustomList dataList={displayServices} onToggle={handleToggle} onPriceChange={handlePriceChange} permissionState={permissionState} />
				</div> :
				<div className="manage-margin">
					<CircularProgress size={50} />
				</div>

			}
			<CardFooter>
				<div className="clearfix">
					<div className="float-left">
						<IntlMessages id={'selectedServiceLabel'}
							defaultMessage={'Selected Service'} /> : {services && selectedServiceCount()}
					</div>
					<div className="float-right">
						<IntlMessages id={'searchServiceTotalPrice'}
							defaultMessage={'Total Price'} /> : {services && (selectedServiceTotal() / 100).toFixed(2)}
					</div>
				</div>
			</CardFooter>
		</Card>
	);
	/**
	 *  stepper next handler
	 */
	const onNextClicked = () => {
		let isError = selectedServicesState && selectedServicesState.selectedServices && selectedServicesState.selectedServices.length > 0 ? false : true;
		if (isError) {
			setError('You need to select atleast one service');
			return 0
		}
		if (orderPrefillState && orderPrefillState.id) {
			props.handleNext();
		} else {
			if (selectedServiceCount()) {
				props.handleNext();
			} else {
				setAlert(true);
			}
		}
	};

	const getCategoryServiceCount = (category: string) => {
		return serviceState && serviceState.filter((service: any) => service.category.name === category).length || 0
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
			selectedServicesState.selectedServices && selectedServicesState.selectedServices.length ?
        selectedServicesState.selectedServices.filter((service: any) => service.options.length > 0 && service.options[0].enabled) : []

	return (
		<div>
			<AlertPopUp show={alert} warning title={'Please select at least one service.'} onConfirm={() => setAlert(false)} />
			<div className="row ">
				<div className="col-5">
					<FormControl className="mb-3" fullWidth>
						<InputLabel htmlFor="search_service"><IntlMessages id={'searchServiceLabel'}
							defaultMessage={'Search Service'} /></InputLabel>
						<Input
							id="search_service"
							type='text'
							value={searchService}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => searchBoxChanged(event)}
							endAdornment={
								<InputAdornment position="end">
									{searchService.length ?
										<IconButton
											aria-label="toggle password visibility"
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
				<div className="col-5">
					<FormControl className="mb-3" fullWidth>
						{renderList}
					</FormControl>
				</div>
				<div className="col-6">
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
			{(error || (selectedServicesState && selectedServicesState.serviceError)) &&
				<div className="row">
					<div className="col-4 mb-2" >
						<Alert severity="error">{selectedServicesState.serviceError || error}!</Alert>
					</div>
				</div>
			}
			<div className="mt-2">
				<div>
					<Button
						disabled={props.activeStep === 0}
						onClick={props.handleBack}
						className="jr-btn"
					>
						Back
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={onNextClicked}
						className="jr-btn"
					>
						{props.activeStep === props.steps.length - 1 ? 'Finish' : 'Next'}
					</Button>
				</div>
			</div>

		</div>
	);
}

export default VehiclesStep2;
