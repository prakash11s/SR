import React, { useEffect, useState } from 'react';
import { Button, FormControl, List, ListItem, ListItemText } from '@material-ui/core';
import { Card, CardBody, CardImg, Collapse, CardDeck, CardFooter, Col, Row } from "reactstrap";
import { compose, lifecycle, withProps } from "recompose";
import { DirectionsRenderer, GoogleMap, withGoogleMap, withScriptjs } from "react-google-maps";
import { useDispatch, useSelector } from "react-redux";
import CustomScrollbars from "../../../util/CustomScrollbars";
import { submitOrderAction, updateOrderAction } from "../../../actions/Actions/OrderActions";
import { IMap } from "./Step1";
import InjectMassage from "../../../util/IntlMessages";
import AlertPopUp from "../../../common/AlertPopUp";
import IntlMessages from "../../../util/IntlMessages";
import { IService } from "./Interface/Step4Interface";
import { CURRENCY_CODES } from "../../../constants/common.constants";
import queryString from "query-string";

const windowClone: any = window;
const google = windowClone.google;


const renderMap = (props: IMap) => {
	return (
		<GoogleMap
			defaultZoom={7}
			defaultCenter={new google.maps.LatLng(41.8507300, -87.6512600)}
		>
			{props.directions && <DirectionsRenderer directions={props.directions} />}
		</GoogleMap>)
};

const MapWithADirectionsRenderer = compose<any, IMap>(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API}&libraries=geometry,drawing,places`,
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap,
	lifecycle<any, any>({
		componentDidMount() {
			const DirectionsService = new google.maps.DirectionsService();
			DirectionsService.route({
				origin: new google.maps.LatLng(this.props.from.latitude, this.props.from.longitude),
				destination: new google.maps.LatLng(this.props.to.latitude, this.props.to.longitude),
				travelMode: google.maps.TravelMode.DRIVING,
			}, (result, status) => {
				if (status === google.maps.DirectionsStatus.OK) {
					this.setState({
						directions: result,
					})
				} else {
					console.error(`error fetching directions ${result}`);
				}
			});
		}
	})
)(renderMap);

const CouriersStep5 = (props: any) => {

	const dispatch = useDispatch();

	/**
	 *  order details reduce state
	 */
	const serviceState = useSelector((state: any) => state.orderState.orderCreate.services);
	const orderPrefillState = useSelector((state: any) => state.orderState.orderCreate.orderPrefillData);
	const orderState = useSelector((state: any) => state.orderState.orderCreate.order);
	const orderDetail = useSelector((state: any) => state.orderState.orderCreate.orderDetails);
	const selectedService = serviceState.filter((service: any) => service.checked === true);
	/**
	 *  alert pop up state handler
	 */
	const [error, setError] = useState(false);

	/**
	 *  error msg state handler
	 */
	const [errorMsg, setErrorMsg] = useState('');

	/**
   *  check if order can be finished
   */
	const [isFinishable, setIsFinishable] = useState<boolean>(true);

	const [isCourierOpen, setIsCourierOpen] = useState(false);
	const [isCourierVehicleOpen, setIsCourierVehicleOpen] = useState(false);

	const toggle = (toggleFor: string) => {
		if (toggleFor === 'courier') {
			setIsCourierOpen(!isCourierOpen)
		}
		if (toggleFor === 'vehicle') {
			setIsCourierVehicleOpen(!isCourierVehicleOpen)
		}
	};


	const onSubmit = (e: any, fieldName: string) => {
		let queryParams = queryString.parse(window.location.search);

		const payload = { ...queryParams, ...orderDetail };
		if (fieldName) {
			orderDetail[fieldName] = true;
		}
		orderPrefillState && orderPrefillState.id ? dispatch(updateOrderAction(orderPrefillState.id, payload)) : dispatch(submitOrderAction(payload));
		// dispatch(submitOrderAction(orderDetail));
		return 0;
	};

	useEffect(() => {
		if (orderDetail.orderSubmitResposne) {
			if (orderDetail.orderSubmitResposne.id) {
				props.handleNext();
			} else if (orderDetail.orderSubmitResposne.status_code === 500) {
				setError(true);
				setErrorMsg(orderDetail.orderSubmitResposne.message ? orderDetail.orderSubmitResposne.message :
					<InjectMassage id={'orderSubmitError'} />)
			}
		}
	}, [orderDetail]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const { shipmentData } = orderState;
		if (
			shipmentData &&
			!shipmentData.services ||
			!shipmentData.services.collect.date ||
			!shipmentData.services.collect.time ||
			!shipmentData.services.deliver.date ||
			!shipmentData.services.deliver.time
		) {
			setIsFinishable(false);
		}
	}, [orderState]);

	const getCurrentLocale = () => {
		const data = localStorage.getItem('locale');
		if (data) {
			return JSON.parse(data && data).locale
		} else {
			return 'en';
		}
	};
	const orderCreateState = useSelector((state: any) => state.orderState.orderCreate);
	let client = orderCreateState && orderCreateState.clientDetails || {};
	let sender = orderCreateState && orderCreateState.senderDetails || {};
	let receiver = orderCreateState && orderCreateState.receiverDetails || {};
	let others = orderCreateState && orderCreateState.others || {};

	const shipment = orderState.courierTypes.find(courier => courier.id === orderState.shipmentData.dimensions.shipmentType);
	const courierVehicle = orderState.courierVehicleTypes.find(vehicle => vehicle.checked);
	const paymentMethod = orderState.paymentOption && orderState.paymentOption.find(payment => payment.id === others.paymentBy);

	const currencyConvert = CURRENCY_CODES.find(code => code.currency_code_iso === (getCurrentLocale() === 'en' ? 'DOLLAR' : 'EUR'));
	/**
	 *  to get total price of selected services
	 */
	const selectedServiceTotal = () => {
		let total = 0;
		serviceState.forEach((service: IService) => {
			if (service.checked) {
				total += +service.service_price.price
			}
		});
		return total;
	};

	return (
		<div>
			<div className="col-12">
				<Card className="shadow border-0 row">
					<CardBody className="row">
						<div className="col-4">
							<MapWithADirectionsRenderer
								from={orderState.courier.locationsLatLng[0]}
								to={orderState.courier.locationsLatLng[1]}
							/>
						</div>
						<div className="col-6">
							<h3><span><b><IntlMessages id="fromTitle" /> : </b></span>{orderState.courier.locationName.fromInput}</h3>
							<h3><span><b><IntlMessages id="toTitle" /> : </b></span>{orderState.courier.locationName.toInput}</h3>
							<h3><span><b><IntlMessages id="partnerOrders.distance" /> : </b></span>{orderState.courier.distance}</h3>
						</div>
					</CardBody>
				</Card>
				<div className="row">
					<CardDeck>
						<Card className="shadow border-0">
							<CardBody>
								<h3><b><IntlMessages id="serviceDetails" /></b></h3>
								<FormControl className="w-100 mb-2">
									<h4><b><IntlMessages id="orderOverview.courierType" />:</b></h4>
									<Button onClick={(event: any) => toggle('courier')} variant="contained"
										color="primary">
										{shipment.name}
									</Button>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<Collapse isOpen={isCourierOpen}>
										<Card className="shadow border-0">
											<CardImg top width="200px" height={"200px"} src={shipment.image}
												alt="Vehicle Image" />
											<CardBody>asdfasdf
												<h4 className="card-title"> {shipment.name} </h4>
												<FormControl className="w-50 mb-2">
													<h5>
														<span><IntlMessages id="Height" /> : </span> {orderState.shipmentData.dimensions.sizes.height} cm
													</h5>
												</FormControl>
												<FormControl className="w-50 mb-2">
													<h5>
														<span><IntlMessages id="Width" /> : </span> {orderState.shipmentData.dimensions.sizes.width} cm
													</h5>
												</FormControl>
												<FormControl className="w-50 mb-2">
													<h5>
														<span><IntlMessages id="Length" /> : </span> {orderState.shipmentData.dimensions.sizes.length} cm
													</h5>
												</FormControl>
												<FormControl className="w-50 mb-2">
													<h5>
														<span><IntlMessages id="Weight" /> : </span> {orderState.shipmentData.dimensions.sizes.weight} kg
													</h5>
												</FormControl>
											</CardBody>
										</Card>
									</Collapse>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h4><b><IntlMessages id="serviceright.couriers.title" />:</b></h4>
									<Button onClick={(event: any) => toggle('vehicle')} variant="contained"
										color="primary">{courierVehicle.name} - {courierVehicle.description}
									</Button>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<Collapse isOpen={isCourierVehicleOpen}>
										<Card className="shadow border-0">
											<CardImg top width="200px" height={"200px"} src={courierVehicle.image}
												alt="Vehicle Image" />
											<CardBody>
												<h4 className="card-title"> {courierVehicle.description} </h4>
												<h5 className="card-title"><IntlMessages id="pricePerKm" /> : {(currencyConvert ? currencyConvert.symbol : '') + (courierVehicle.price_per_km / (currencyConvert ? currencyConvert.converters : 1))}
												</h5>
												<h5 className="card-title"><IntlMessages
													id="minimumPrice" /> : {(currencyConvert ? currencyConvert.symbol : '') + (courierVehicle.minimum_transportation_price / (currencyConvert ? currencyConvert.converters : 1))}</h5>
												<Row>
													<Col xs="6"><h4><IntlMessages id="Height" /> : {courierVehicle.max_transportation_height}</h4></Col>
													<Col xs="6"><h4><IntlMessages id="Width" /> : {courierVehicle.max_transportation_width}</h4></Col>
													<Col xs="6"><h4><IntlMessages id="Length" /> : {courierVehicle.max_transportation_length}</h4></Col>
													<Col xs="6"><h4><IntlMessages id="Weight" /> : {courierVehicle.max_transportation_weight}</h4></Col>
												</Row>
											</CardBody>
											<CardFooter>
												<h5 className="card-title"><IntlMessages id="transportationPrice" /> : {(currencyConvert ? currencyConvert.symbol : '') + (courierVehicle.transportation_price / (currencyConvert ? currencyConvert.converters : 1))}</h5>
											</CardFooter>
										</Card>
									</Collapse>
								</FormControl>
								<FormControl className="w-50 mb-2">
									<h4><b><IntlMessages id={'timeToCollectShipmentTitle'}
										defaultMessage={'Time To Collect Shipment Title'} /> :</b></h4>
									<FormControl className="w-100 mb-2">
										<h5><IntlMessages id="orderOverview.Date" /> : {orderState.shipmentData.services.collect.displayDate}</h5>
										<h5><IntlMessages id="orderOverview.Time" /> : {orderState.shipmentData.services.collect.time}</h5>
									</FormControl>
								</FormControl>
								<FormControl className="w-50 mb-2">
									<h4><b><IntlMessages id={'timeToDeliverShipmentTitle'}
										defaultMessage={'Time To Deliver Shipment Title'} /> :</b></h4>
									<FormControl className="w-100 mb-2">
										<h5><IntlMessages id="orderOverview.Date" /> : {orderState.shipmentData.services.deliver.displayDate}</h5>
										<h5><IntlMessages id="orderOverview.Time" /> : {orderState.shipmentData.services.deliver.time}</h5>
									</FormControl>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h4><b><IntlMessages id="selectedServices" /> :</b></h4>
									<Card className="shadow border-0">
										<List className="pinned-list" subheader={<div />}>
											<CustomScrollbars className="scrollbar" style={{ height: '100%' }}>
												{selectedService.map(item =>
													<ListItem>
														<ListItemText primary={item.name} secondary={item.custom_description} className='col-9' />
														<ListItemText
															primary={item.service_price ? (currencyConvert ? currencyConvert.symbol : '') + (item.service_price.price / (currencyConvert ? currencyConvert.converters : 1)) : '00'}
															className='col-3' />
													</ListItem>
												)}
											</CustomScrollbars>
										</List>
										<CardFooter>
											<div className="clearfix">
												<div className="float-left">
													<IntlMessages id={'searchServiceTotalPrice'} /> :
												</div>
												<div className="float-right">
													{currencyConvert ? currencyConvert.symbol : ''} {serviceState && (selectedServiceTotal() / 100).toFixed(2)}
												</div>
											</div>
										</CardFooter>
									</Card>
								</FormControl>
							</CardBody>
						</Card>
						<Card className="shadow border-0">
							<CardBody>
								<h3><b><IntlMessages id={'clientInformationLabel'}
									defaultMessage={'Client Information'} /></b></h3>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Name" /> : </b>{client.title} {client.name}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Email" /> : </b>{client.email}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Phone" /> : </b>{client.phone}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Address" /> : </b>{client.address}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Pincode" /> : </b>{client.postalCode}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.HouseNo" /> : </b>{client.houseNumber}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Place" /> : </b>{client.place}</h5>
								</FormControl>
							</CardBody>
						</Card>
						<Card className="shadow border-0">
							<CardBody>
								<h3><b><IntlMessages id={'shipmentDetailsTitle'}
									defaultMessage={'Shipment Details'} /></b></h3>
								<FormControl className="w-100 mb-2">
									<h4><b><IntlMessages id={'senderDetailsTitle'}
										defaultMessage={'Sender Details'} /> :</b></h4>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Name" />
										: </b>{sender.title} {sender.name}
									</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Email" /> : </b>{sender.email}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Phone" /> : </b>{sender.phone}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Address" /> : </b>{sender.address}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.HouseNo" /> : </b>{sender.houseNumber}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Company" /> : </b>{sender.company}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Department" /> : </b>{sender.department}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h4><b><IntlMessages id={'recevierDetailsTitle'}
										defaultMessage={'Recevier Details'} /> :</b></h4>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Name" />
										: </b>{receiver.title} {receiver.name}
									</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Email" /> : </b>{receiver.email}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Phone" /> : </b>{receiver.phone}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Address" /> : </b>{receiver.address}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Company" /> : </b>{receiver.company}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.HouseNo" /> : </b>{receiver.houseNumber}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h5><b><IntlMessages id="orderOverview.Department" /> : </b>{receiver.department}</h5>
								</FormControl>
								<FormControl className="w-100 mb-2">
									<h4><b><IntlMessages id={'courierDetails.payment'} /> : {paymentMethod && paymentMethod.name}</b></h4>
								</FormControl>
							</CardBody>
						</Card>
					</CardDeck>
				</div>
				<AlertPopUp show={error} title={errorMsg} confirmBtnBsStyle="danger" type={"danger"}
					onConfirm={() => setError(false)} />
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
						className="jr-btn"
						onClick={(e) => onSubmit(e, '')}
						disabled={!isFinishable}
					>
						{props.activeStep === props.steps.length - 1 ? <IntlMessages id="appModule.finish" /> : <IntlMessages id="appModule.next" />}
					</Button>
					{orderPrefillState &&
						orderPrefillState.quote_request &&
						orderPrefillState.status &&
						orderPrefillState.status.name === "awaiting_confirmation" &&
						<Button
							variant="contained"
							color="primary"
							onClick={(e) => onSubmit(e, "accept_quote")}
							className="jr-btn"
						>
							<IntlMessages id="appModule.acceptQuotation" />
						</Button>
					}
					{
						orderPrefillState && orderPrefillState.id ? null :
							<>
								<Button
									variant="contained"
									color="primary"
									onClick={(e) => onSubmit(e, "is_draft")}
									className="jr-btn"
								>
									<IntlMessages id="appModule.saveAsDraft" />
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={(e) => onSubmit(e, "quote_request")}
									className="jr-btn"
								>
									<IntlMessages id="appModule.sendQuote" />
								</Button>
							</>
					}
				</div>
			</div>
		</div>
	);
}

export default CouriersStep5;
