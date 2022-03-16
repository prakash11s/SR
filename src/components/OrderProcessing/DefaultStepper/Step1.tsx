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
import { default as SupportCodeSelection } from "@material-ui/lab/Autocomplete";
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
} from './../VehiclesStepper/Interface/Step2Interface';
import { useIntl } from "react-intl";
import LoadingOverlay from 'common/LoadingOverlay';
import { sortObjectOnKeys } from 'util/helper';
import axios from "../../../util/Api";
import { SET_ORDER_PREFILL_DATA, SET_SUPPORTCODE_DATA } from 'constants/ActionTypes';

interface IDefaultStep1Props extends IVehiclesStep2Props {
	handleOrderReset:(searchValue : string) => void
	orderId: string,
}

const DefaultStep1 = (props: IDefaultStep1Props) => {

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
	 *  selected services from order state
	 */
	const selectedServicesState = useSelector((state: any) => state.orderState.orderCreate);

	/**
	 *  services handler state
	 */
	const [services, setServices] = useState([]);
	const [displayServices, setDisplayServices] = useState([]);
	const [filterList, setFilterList] = useState<string[]>([]);
	const [supportCodeData, setSupportCodeData] = useState<string[]>([]);
	const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
	const [selectedServices, setSelectedServices] = useState<any>([]);
	const [search, setSearch] = useState<any>('');
	const [searchErrorMsg,setSearchErrorMsg] = useState<string>('');
	const [searchError,setSearchError] = useState<boolean>(false);
	const [orderError,setOrderError] = useState<boolean>(false);
	const [errorMessage,setErrorMessage] = useState<any>("");

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
		if (!serviceState) {
			setSelectedServices(supportServices);
			setTimeout(()=>{
				dispatch(getServiceList(prepareDefaultData(supportServices), 'new'));
			},400)
		} else {
			setServices(serviceState)
			setDisplayServices(serviceState)
		}
	}, [selectedServicesState.supportCodeData]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		let orderServices = selectedServicesState.orderPrefillData && selectedServicesState.orderPrefillData.services || [];
		if (orderServices.length) {
			setSelectedServices(orderServices);
			setTimeout(()=>{
				dispatch(getServiceList(prepareDefaultData(orderServices), 'new'));
			},400)
		}
	}, [selectedServicesState.orderPrefillData]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 *  prepare data to get service list
	 */
	const prepareDefaultData = (payload?:any) => {
		let servicesPayload = selectedServicesState && selectedServicesState.selectedServices && selectedServicesState.selectedServices.map((item) => {
			return ({ amount: item.amount, id: item.id, price: item.price })
		});
		const data = {
			selected_services: (servicesPayload && servicesPayload.length > 0 ? servicesPayload : payload)
		};

		return btoa(unescape(encodeURIComponent(JSON.stringify(sortObjectOnKeys(data)))));
	};

	useEffect(() => {
		if (props.orderId) {
      getOrderDetails(props.orderId as unknown as number);
    }
	},[props.orderId])

	/**
   *  get order details
   * @param orderId
   */
	 const getOrderDetails = (orderId: number) => {
    axios
      .get(`/orders/${orderId}`)
      .then((res) => res.data)
      .then((response: any) => {
        dispatch({ type: SET_ORDER_PREFILL_DATA, payload: response })
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
					setOrderError(true);
					setErrorMessage("Not Found")
        }
      });
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
			})}: ${(selectedServiceTotal() / 100).toFixed(2)}`, 0);
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
		dispatch(getServiceList(prepareDefaultData(), 'new'));
	};

	// useEffect(() => {
	// 	if (selectedServices && selectedServices.length > 0) {
	// 		dispatch(getServiceList(prepareDefaultData(), 'update'));
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

	/**
   *  get support code list
   * @param event
   */
		const getSupportCodeList = (event: any) => {
			if (Boolean(event.target.value) && event.target.value.length > 1) {
				axios
					.get(
						`/support-codes?code=${event.target.value}`
					)
					.then((response: any) => response.data.data)
					.then((res: any) => {
						if (res) {
							setSupportCodeData(res)
						}
					})
					.catch((error) => console.log(error.response));
			}
		};

		/**
   *  fill vehicle data from support code
   * @param event
   * @param value
   * @param reason
   */
		const getAutoFillData = (event: any, value: { code: number }, reason: string) => {
			if (reason === "select-option") {
				axios
					.get(`/support-codes/${value.code}`)
					.then((response: any) => {
						const res = response.data.data;
						if (!res) {
							setOrderError(true);
							setErrorMessage(<IntlMessages id="supportcode.error" />)
						} else {
							dispatch({ type: SET_SUPPORTCODE_DATA, payload: res })
						}
					})
					.catch((error) => {
						console.log(error.response);
					});
			}
		};

		const addOrderId = () => {
			axios.get(`/orders/${search}`)
					.then(res => res.data)
					.then((response: any) => {
						props.handleOrderReset(search)
					})
					.catch((error) => {
							if (error.response.status === 404) {
								setSearchError(true);
								setSearchErrorMsg("Not Found");
							}
					})
	}

	const resetError = () => {
		setOrderError(false);
		setErrorMessage("");
	}

	const customService = selectedServicesState &&
		selectedServicesState.selectedServices && selectedServicesState.selectedServices.length ?
			selectedServicesState.selectedServices.filter((service: any) => service.options.length > 0 && service.options[0].enabled) : []

	return (
		<div>
			{orderError && (
          <AlertPopUp
            show={orderError}
            type={"danger"}
            title={errorMessage}
            confirmBtnBsStyle={"danger"}
            onConfirm={resetError}
          />
        )}
			<AlertPopUp show={alert} warning title={'Please select at least one service.'} onConfirm={() => setAlert(false)} />
			{!props.orderId&&<div className="row">
				<div className="col-md-12 col-8 mt-4 manage-margin d-flex">
					<SupportCodeSelection
							className="w-25 mb-1 h-25"
							id="support-code"
							options={supportCodeData}
							getOptionLabel={(option: any) => option.code.toString()}
							style={{ width: 300 }}
							renderInput={(params: any) => (
								<TextField
									{...params}
									label={
										<IntlMessages
											id="vehicleStepperStep1.supportCode"
											defaultMessage="Support Code"
										/>
									}
									variant="outlined"
								/>
							)}
							onInputChange={(event: any) => getSupportCodeList(event)}
							onChange={(event: any, value: any, reason: any) =>
								getAutoFillData(event, value, reason)
							}
						/>
						<div className="d-flex">
								<TextField value={search} onChange={(e) => setSearch(e.target.value)} helperText={searchErrorMsg} error={searchError} type="number" variant='outlined' fullWidth style={{ width: 100 }} />
								<button onClick={addOrderId} className="search-icon" ><i className="zmdi zmdi-search zmdi-hc-lg" /></button>
						</div>
				</div>
			</div>}
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

export default DefaultStep1;
