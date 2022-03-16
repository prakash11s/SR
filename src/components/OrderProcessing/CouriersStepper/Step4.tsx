import React, { useEffect, useState } from 'react';
import {
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	Input,
	MenuItem
} from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import {
	getAutocompleteDataAction,
	getPaymentOptionAction,
	resetAutoCompleteAddressAction,
	setOrderDetail,
} from '../../../actions/Actions/OrderActions';
import IntlMessages from "../../../util/IntlMessages";
import { Card, CardBody, CardSubtitle } from 'reactstrap';
import ClientDetails from '../../ClientDetails'
import CustomScrollbars from "../../../util/CustomScrollbars";
import AlertPopUp from "../../../common/AlertPopUp";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import { IService, IServiceEdit } from "../VehiclesStepper/Interface/Step4Interface";
import moment from "moment";
import axios from "../../../util/Api";
import { UPDATE_CLIENT, UPDATE_CLIENT_DETIALS, UPDATE_OTHER_DETIALS, UPDATE_RECIEVER_DETIALS, UPDATE_SENDER_DETIALS, UPDATE_ALL_DETAILS, UPDATE_RECIEVER, UPDATE_SENDER } from 'constants/ActionTypes';

const CouriersStep4 = props => {

	const dispatch = useDispatch();

	/**
	 *  reducer states
	 */
	const orderCreateState = useSelector((state: any) => state.orderState.orderCreate);
	const orderPrefillState = useSelector((state: any) => state.orderState.orderCreate.orderPrefillData);
	const autoCompleteAddressState = useSelector((state: any) => state.orderState.orderCreate.autoCompleteAddress);
	const selectedDepartment = useSelector((state: any) => state.department.selectedDepartment);

	/**
	 *  sender details states
	 */
	const [fromEmailError, setFromEmailError] = useState<string>("");
	const [toEmailError, setToEmailError] = useState<string>("");
	const [paymentOptions, setPaymentOptions] = useState<{ id: number; name: string }[]>([]);
	/**
	 *  alert pop up state handler
	 */
	const [alert, setAlert] = useState(false);

	/**
	 *  alert pop up message state handler
	 */
	const [alertMsg, setAlertMsg] = useState('');

	/** Client , sender and reciever detials */
	let client = orderCreateState && orderCreateState.clientDetails || {};
	let sender = orderCreateState && orderCreateState.senderDetails || {};
	let reciever = orderCreateState && orderCreateState.receiverDetails || {};
	let others = orderCreateState && orderCreateState.others || {};
	/** Fields to validate */
	const clientsFields = ["name", "email", "phone", "postalCode", "houseNumber", "address", "place", "title"];
	const senderFields = ["name", "phone", "houseNumber", "title"];
	const recieverFields = ["name", "phone", "houseNumber", "title"];
	const otherFields = ["paymentBy"];

	useEffect(() => {
		if (client.houseNumber && client.postalCode) {
			const timer = setTimeout(() => {
				dispatch(getAutocompleteDataAction(client.houseNumber, client.postalCode));
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [dispatch, client.houseNumber, client.postalCode]); // eslint-disable-line react-hooks/exhaustive-deps

	const preparePaymentPayload = () => {
		const selectedServices: { id: number, price: any }[] = [];
		orderCreateState.services.forEach((service: IService) => {
			if (service.checked) {
				selectedServices.push({ id: service.id, price: service.service_price?.price });
			}
		});
		const selectedCourier = orderCreateState.order.courierTypes.filter((type: any) => type.checked)[0]
		const selectedCourierVehicle = orderCreateState.order.courierVehicleTypes.filter((type: any) => type.checked)[0]
		const payload = {
			from: orderCreateState.order.courier.locationsLatLng[0].placeId,
			to: orderCreateState.order.courier.locationsLatLng[1].placeId,
			selected_services: selectedServices,
			dimensions: {
				width: orderCreateState.order.shipmentData.dimensions.sizes.width,
				height: orderCreateState.order.shipmentData.dimensions.sizes.height,
				length: orderCreateState.order.shipmentData.dimensions.sizes.length,
				weight: orderCreateState.order.shipmentData.dimensions.sizes.weight
			},
			cargo_type_id: selectedCourier.id,
			cargo_type: selectedCourier.name,
			image: selectedCourier.image,
			// id: 1,
			order: selectedCourier.order,
			preferred_pickup_moments: [
				{
					datetime: moment(orderCreateState.order.shipmentData.services.collect.date).format("YYYY-MM-DD HH:mm"),
					//time: orderCreateState.order.shipmentData.services.collect.time,
				}
			],
			preferred_delivery_moments: [
				{
					datetime: moment(orderCreateState.order.shipmentData.services.deliver.date).format("YYYY-MM-DD HH:mm"),
					//time: orderCreateState.order.shipmentData.services.deliver.time,
				}
			],
			locationData: orderCreateState.order.courier,
			transportation_vehicle_id: selectedCourierVehicle.id,
		}
		return window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
	}

	useEffect(() => {
		dispatch(getPaymentOptionAction(preparePaymentPayload(), true, (status, response) => {
			if (status && response.length) {
				setPaymentOptions(response)
				let payload = { key: 'paymentBy', value: '' };
				if (others.paymentBy === "") {
					payload.value = response[0].id;
					dispatch({ type: UPDATE_OTHER_DETIALS, payload });
				}
			}
		}))
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {

		// if (!verifyData() && orderCreateState.supportCodeData && !orderCreateState.orderDetails) {
		//     const {supportCodeData} = orderCreateState;
		// }
		const address = (orderCreateState.order && orderCreateState.order.courier && orderCreateState.order.courier.locationName && orderCreateState.order.courier.locationName)
		if (!verifyData() && orderCreateState.orderDetails) {
			const { orderDetails } = orderCreateState;
			dispatch({ type: UPDATE_ALL_DETAILS, payload: orderDetails });
		}
		if (!verifyData() && !orderCreateState.orderDetails && orderCreateState.orderPrefillData && !orderCreateState.supportCodeData) {
			const { orderPrefillData } = orderCreateState;
			let payload = { ...orderPrefillData, additional_data: {}, paymentBy: orderPrefillData.additional_data?.payment_method?.id, sender_details: orderPrefillData.additional_data.sender_details, receiver_details: orderPrefillData.additional_data.receiver_details }
			dispatch({ type: UPDATE_ALL_DETAILS, payload });
		}
		if (address && address.fromInput) {
			let sender = { key: 'address', value: address.fromInput }
			let reciever = { key: 'address', value: address.toInput }
			dispatch({ type: UPDATE_SENDER_DETIALS, payload: sender })
			dispatch({ type: UPDATE_RECIEVER_DETIALS, payload: reciever })
		}
		return () => {
			dispatch(resetAutoCompleteAddressAction())
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps


	useEffect(() => {
		let payload = { address: '', place: '' };
		if (Boolean(autoCompleteAddressState)) {
			if (autoCompleteAddressState.Address) {
				const { Address }: any = autoCompleteAddressState;
				payload.address = Address.street;
				payload.place = Address.city;
				dispatch({ type: UPDATE_CLIENT, payload });
			}
		} else {
			dispatch({ type: UPDATE_CLIENT, payload });
		}
	}, [autoCompleteAddressState]); // eslint-disable-line react-hooks/exhaustive-deps

	const textFormat = () => {
		return (
			<React.Fragment>
				<IntlMessages id="clientTitle" /> : {`${client.title} ${client.name}`} - <IntlMessages id="cityTitle" /> : {client.place}
			</React.Fragment>
		)
	}

	useEffect(() => {
		if (client.title && client.name && client.place) {
			props.onHeadingChange(textFormat(), 3);
			// props.onHeadingChange(`Client : ${title} ${name} - City: ${place} `, 3);
		}
	}, [client.name, client.title, client.place]); // eslint-disable-line react-hooks/exhaustive-deps

	const renderTitle = (value: string, updateValue: any) => {
		value = value && value.length ? value.toLowerCase().startsWith("mrs") || value.toLowerCase().startsWith("ms") ? "mrs." : value.toLowerCase().startsWith("mr. mr") ? "mr. mrs." : "mr." : "";
		return (
			<Select
				labelId={'courierDetails.title'}
				value={value.toLowerCase()}
				onChange={updateValue('title')}
				input={<Input id="Title" />}
			>
				<MenuItem value={'mr. mrs.'}>Mr. Mrs.</MenuItem>
				<MenuItem value={'mr.'}>Mr.</MenuItem>
				<MenuItem value={'mrs.'}>Mrs.</MenuItem>
			</Select>
		);
	};

	const renderPaymentOption = () => {
		return (
			<Select
				labelId={'courierDetails.title'}
				value={parseInt(others.paymentBy)}
				onChange={updateOtherDetails('paymentBy')}
				input={<Input id="Title" />}
			>
				{paymentOptions && paymentOptions.length && paymentOptions.map((option) => {
					return (
						<MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
					)
				}) || <MenuItem value=""> None
					</MenuItem>}
			</Select>
		);
	};

	/**
	 *  submit and go to next step handler
	 */
	const onSubmitClicked = () => {
		if (verifyData() && !toEmailError && !fromEmailError) {
			dispatch(setOrderDetail(prepareData()))
			props.handleNext();
		} else {
			setAlert(true);
			setAlertMsg('Please Fill All the details.');
		}
	};

	/**
	 *  verify data to make sure that all fields are filled
	 */
	const verifyData = () => {
		let verified = false;
		/* Validate client fileds */
		clientsFields.forEach((key) => {
			if (Object.keys(client).includes(key)) verified = true;
			else verified = false;
		})
		/* Validate sender fileds */
		senderFields.forEach((key) => {
			if (Object.keys(sender).includes(key)) verified = true;
			else verified = false;
		})
		/* Validate reciever fileds */
		recieverFields.forEach((key) => {
			if (Object.keys(reciever).includes(key)) verified = true;
			else verified = false;
		})
		/* Validate other fileds */
		otherFields.forEach((key) => {
			if (Object.keys(others).includes(key)) verified = true;
			else verified = false;
		})

		return verified;
	};

	/**
	 *  prepare data to save
	 */
	const prepareData = () => {
		const { order } = orderCreateState;
		const selectedCourierVehicle = ((order && order.courierVehicleTypes) || []).filter((type: any) => type.checked)[0]
		const selectedCourier = ((order && order.courierTypes) || []).filter((type: any) => type.checked)[0]
		const dimensionsSizes = (order.shipmentData && order.shipmentData.dimensions &&
			order.shipmentData.dimensions.sizes) || {}
		const selectedServices: IServiceEdit[] = [];
		orderCreateState.services.forEach((service: IService) => {
			if (service.checked) {
				const serviceObj: IServiceEdit = {
					id: service.id,
					price: service.service_price.price
				};

				if (service.custom_description) {
					serviceObj.custom_description = service.custom_description;
				}

				if (orderPrefillState && orderPrefillState.id) {
					serviceObj.price_per_unit = service.service_price.price;
				}
				selectedServices.push(serviceObj);
			}
		});
		const deliver = (order.shipmentData && order.shipmentData.services && order.shipmentData.services.deliver) || {}
		const collect = (order.shipmentData && order.shipmentData.services && order.shipmentData.services.collect) || {}
		let deliverTime = moment(deliver.date + " " + deliver.time).format("YYYY-MM-DD HH:mm");
		let pickupTime = moment(collect.date + " " + collect.time).format("YYYY-MM-DD HH:mm");

		const payload = {
			salutation: client.title,
			name: client.name,
			email: client.email,
			phone: client.phone,
			country: "NL",
			zip_code: client.postalCode,
			street_number: client.houseNumber,
			street: client.address,
			city: client.place,
			services: selectedServices,
			preferred_delivery_moments: [
				{
					//to
					datetime: deliverTime,
					//time: order.shipmentData.services.deliver.time
				}
			],
			preferred_pickup_moments: [
				{
					//from
					datetime: pickupTime,
					//time: order.shipmentData.services.collect.time
				}
			],
			dimensions: {
				width: dimensionsSizes.width,
				height: dimensionsSizes.height,
				length: dimensionsSizes.length,
				weight: dimensionsSizes.weight
			},
			cargo_type_id: selectedCourier.id,
			transportation_vehicle_id: selectedCourierVehicle.id,
			from: order.courier.locationsLatLng[0].placeId || "",
			from_street_number: sender.houseNumber,
			to: order.courier.locationsLatLng[1].placeId || "",
			to_street_number: reciever.houseNmber,
			payment_method: { id: others.paymentBy }
		};

		if (sender.title || sender.name || sender.email || sender.phone || sender.company || sender.department) {
			payload['sender_details'] = {
				name: sender.name
			};
			if (sender.title) payload['sender_details'].salutation = sender.title;
			if (sender.email) payload['sender_details'].email = sender.email;
			if (sender.phone) payload['sender_details'].phone = sender.phone;
			if (sender.company) payload['sender_details'].company = sender.company;
			if (sender.department) payload['sender_details'].department = sender.department;
			if (sender.houseNumber) payload['sender_details'].street_number = sender.houseNumber;
		}

		if (reciever.title || reciever.name || reciever.email || reciever.phone || reciever.company || reciever.department) {
			payload['receiver_details'] = {
				name: reciever.name
			};
			if (reciever.title) payload['receiver_details'].salutation = reciever.title;
			if (reciever.email) payload['receiver_details'].email = reciever.email;
			if (reciever.phone) payload['receiver_details'].phone = reciever.phone;
			if (reciever.company) payload['receiver_details'].company = reciever.company;
			if (reciever.department) payload['receiver_details'].department = reciever.department;
			if (reciever.houseNumber) payload['receiver_details'].street_number = reciever.houseNumber;
		}
		if (others.comments) payload['comment'] = others.comments;

		return payload;
	};
	const handleError = (value, setError) => {
		let error = ""
		if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/) && value !== "") {
			error = "Enter a valid email address";
		} else {
			error = "";
		}
		setError(error)
	}
	const updateSenderDetials = (key: any) => (e: any) => {
		let value = e.target.value;
		key === 'email' && handleError(value, setFromEmailError);
		let payload = {
			key,
			value
		}
		dispatch({ type: UPDATE_SENDER_DETIALS, payload });
	};
	const updateRecieverDetials = (key: any) => (e: any) => {
		let value = e && e.target && e.target.value;
		key === 'email' && handleError(value, setToEmailError);
		let payload = {
			key,
			value
		}
		dispatch({ type: UPDATE_RECIEVER_DETIALS, payload });
	};
	const updateClientDetials = (key: any) => (e: any) => {
		let value = e;
		let payload = {
			key,
			value
		}
		dispatch({ type: UPDATE_CLIENT_DETIALS, payload });
	}
	const updateOtherDetails = (key: any) => (e: any) => {
		let value = e && e.target && e.target.value;
		let payload = {
			key,
			value
		}
		dispatch({ type: UPDATE_OTHER_DETIALS, payload });
	}

	const details = useSelector((state: any) => state.orderState.orderCreate);

	const fromLayout = () => {
		return (
			<div>
				<div>
					<h3><IntlMessages id={'fromTitle'} defaultMessage={'From'} /></h3>
					<div className="row">
						<div className="col-3">
							<FormControl className="w-100 mb-2">
								<InputLabel id={'clientDetails.title'}><IntlMessages
									id={'clientDetails.title'} /></InputLabel>
								{renderTitle(sender.title, updateSenderDetials)}
							</FormControl>
						</div>
						<div className="col-9">
							<FormControl className="w-100 mb-2">
								<TextField
									required
									label={<IntlMessages id={'order.name'}
										defaultMessage={'Name'} />}
									value={sender.name}
									onChange={updateSenderDetials('name')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
					</div>
					<div className="row">
						<div className="col-8">
							<FormControl className="w-100 mb-2">
								<TextField
									InputProps={{
										readOnly: true,
									}}
									label={<IntlMessages id={'courierDetails.address'}
										defaultMessage={'Address'} />}
									required
									value={sender.address}
									onChange={updateSenderDetials('address')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-4">
							<FormControl className="w-100 mb-2">
								<TextField
									label={
										<IntlMessages
											id={'courierDetails.house'}
											defaultMessage={'House number'} />}
									required
									value={sender.houseNumber}
									onChange={updateSenderDetials('houseNumber')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-6">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'order.phone'}
										defaultMessage={'Phone'} />}
									value={sender.phone}
									onChange={updateSenderDetials('phone')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-6">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'order.email'} />}
									value={sender.email}
									error={fromEmailError.length > 0}
									helperText={fromEmailError}
									onChange={updateSenderDetials('email')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-6">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'sender.company'}
										defaultMessage={'Company'} />}
									value={sender.company}
									onChange={updateSenderDetials('company')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-6">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'sender.department'} />}
									value={sender.department}
									onChange={updateSenderDetials('department')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
					</div>
				</div>
				<div>
					<h3><IntlMessages id={'toTitle'} defaultMessage={'To Title'} /></h3>
					<div className="row">
						<div className="col-3">
							<FormControl className="w-100 mb-2">
								<InputLabel id={'clientDetails.title'}><IntlMessages
									id={'clientDetails.title'} /></InputLabel>
								{renderTitle(reciever.title, updateRecieverDetials)}
							</FormControl>
						</div>
						<div className="col-9">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'sender.name'} />}
									required
									value={reciever.name}
									onChange={updateRecieverDetials('name')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
					</div>
					<div className="row">
						<div className="col-8">
							<FormControl className="w-100 mb-2">
								<TextField
									InputProps={{
										readOnly: true,
									}}
									label={<IntlMessages
										id={'courierDetails.address'} />}
									required
									value={reciever.address}
									onChange={updateRecieverDetials('address')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-4">
							<FormControl className="w-100 mb-2">
								<TextField
									label={
										<IntlMessages
											id={'courierDetails.house'} />}
									required
									value={reciever.houseNumber}
									onChange={updateRecieverDetials('houseNumber')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-6">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'order.phone'} />}
									value={reciever.phone}
									onChange={updateRecieverDetials('phone')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-6">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'order.email'} />}
									error={toEmailError.length > 0}
									helperText={toEmailError}
									value={reciever.email}
									onChange={updateRecieverDetials('email')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-6">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'sender.company'} />}
									value={reciever.company}
									onChange={updateRecieverDetials('company')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-6">
							<FormControl className="w-100 mb-2">
								<TextField
									label={<IntlMessages id={'sender.department'} />}
									value={reciever.department}
									onChange={updateRecieverDetials('department')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>
						<div className="col-12">
							<FormControl className="w-100 mb-2">
								<TextField
									type='textarea'
									label={<IntlMessages id={'orderOverview.Comments'} />}
									multiline={true}
									placeholder="Any comments and / or additional desired work"
									rows='4'
									value={others.comments}
									onChange={updateOtherDetails('comments')}
									className="w-80 mb-2 h-75 form-control" />
							</FormControl>
						</div>

						<div className="col-12">
							<FormControl className="w-100 mb-2">
								<InputLabel id={'courierDetails.payment'}><IntlMessages
									id={'courierDetails.payment'} /></InputLabel>
								{renderPaymentOption()}
							</FormControl>
						</div>
					</div>
				</div>
			</div>
		)
	}



	const [timer, setTimer] = useState<any>(null);
	const [emailLoading, setEmailLoading] = useState<boolean>(false);
	const [emailIDList, setEmailIDList] = useState<any>([]);
	const [title, setTitle] = useState("Mr. Mrs.");
	const [name, setName] = useState("");
	const [email, setEmail] = useState<any>("");
	const [phone, setPhone] = useState<any>("");
	const [postalCode, setPostalCode] = useState("");
	const [address, setAddress] = useState("");
	const [houseNo, setHouseNo] = useState("");
	const [place, setPlace] = useState("");
	

	const handleEmailChange = (e: any, value: any) => {
		setTitle(value?.salutation ? value?.salutation : '');
		setEmail(value?.email ? value?.email : '');
		setName(value?.first_name ? `${value?.first_name} ${value.last_name != null ? value.last_name : ''}` : '');
		setPhone(value?.phone ? value?.phone : '');
		setPostalCode(value?.zip_code ? value?.zip_code : '');
		setAddress(value?.street ? value?.street : '');
		setHouseNo(value?.street_number ? value?.street_number : '');
		setPlace(value?.city ? value?.city : '');
	};

	const fetchCustomerByEmail = async (email: any) => {
		try {
			const response = await axios.get(`/customers?email=${email}`);
			setEmailIDList(response?.data?.data);
		} catch (error) {
			console.log(error);
		} finally {
			setEmailLoading(false);
		}
	}

	const handleEmailInputChange = async (e: any, value: any) => {
		if ((Boolean(e.target.value) && e.target.value.length > 1)) {
			setEmailLoading(true);
			// Clears running timer and starts a new one each time the user types
			clearTimeout(timer);
			setTimer(setTimeout(() => {
				fetchCustomerByEmail(value);
			}, 1000))
		}
	}

	return (
		<div style={{ position: 'relative' }}>
			<AlertPopUp show={alert} warning title={alertMsg} onConfirm={() => setAlert(false)} />
			<Autocomplete
				className="w-25 mb-2 email-search-list"
				id="email-list"
				options={emailIDList}
				loading={emailLoading}
				getOptionLabel={(option: { email: string }) => `${option.email}`}
				style={{ width: 300, zIndex: 10000 }}
				renderInput={params => (<TextField {...params}
					label={<IntlMessages id={"clientInformation.EmailAddress"} />}
					variant="outlined" />
				)}
				onChange={(event, value) => handleEmailChange(event, value)}
				onInputChange={(event, value) => handleEmailInputChange(event, value)}
			/>
			<div className="row ">
				<Card className="shadow border-0 col-12 mt-3">
					<CardBody className="row">
						<div className="col-6">
							<CardSubtitle><IntlMessages id={'clientInformationLabel'}
								defaultMessage={'Client Information'} /></CardSubtitle>
							<ClientDetails
								title={client.title || title}
								address={client.address || address}
								place={client.place}
								name={client.name || name}
								email={client.email || email}
								phone={client.phone || phone}
								postalCode={client.postalCode || postalCode}
								houseNo={client.houseNo || houseNo}
								onChangeTitle={updateClientDetials('title')}
								onChangeName={updateClientDetials('name')}
								onChangeEmail={updateClientDetials('email')}
								onChangePhone={updateClientDetials('phone')}
								onChangePostalCode={updateClientDetials('postalCode')}
								onChangeHouseNo={updateClientDetials('houseNumber')}
								onChangeAddress={updateClientDetials('address')}
								onChangePlace={updateClientDetials('place')}
								autoCompleteData={autoCompleteAddressState}
							/>
						</div>
						<div className="col-6">
							<CardSubtitle><IntlMessages id={'courierDetailsTitle'} defaultMessage={'Courier Details'} /></CardSubtitle>
							{
								selectedDepartment.slug === "couriers" ? fromLayout() :
									<CustomScrollbars className="scrollbar" style={{ height: '90%' }}>
										{fromLayout()}
									</CustomScrollbars>
							}
						</div>
					</CardBody>
				</Card>
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
						onClick={onSubmitClicked}
						className="jr-btn"
					>
						{props.activeStep === props.steps.length - 1 ? <IntlMessages id="appModule.finish" /> : <IntlMessages id="appModule.next" />}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CouriersStep4;
