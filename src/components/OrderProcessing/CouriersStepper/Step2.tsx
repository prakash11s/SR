import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {
    Button,
    FormControl,
    Input,
    MenuItem,
    Select,
    InputLabel,
    TextField,
    Fab, InputAdornment
} from '@material-ui/core';
import {Alert} from '@material-ui/lab'
import moment from 'moment'
import SearchIcon from '@material-ui/icons/Search'
import {
    getCouriersAction,
    setDimensionData,
    setSelectedCourierVehicle,
    setSelectedShipmentAction,
    getCourierVehicleAction
} from "../../../actions/Actions/OrderActions";
import AlertPopUp from "../../../common/AlertPopUp";
import {Card, CardBody, CardImg, Spinner, Col, CardFooter, Row} from "reactstrap";
import IntlMessages from "../../../util/IntlMessages";
import {CURRENCY_CODES} from "../../../constants/common.constants";

const getCurrentLocale = () => {
    const data = localStorage.getItem('locale');
    if (data) {
        return JSON.parse(data && data).locale
    } else {
        return 'en';
    }
};
const CouriersStep2 = (props: any) => {

    const dispatch = useDispatch();

    /**
     *  reducer state
     */
    const orderCreateState = useSelector((state: any) => state.orderState.orderCreate);
    const orderState = useSelector((state: any) => state.orderState.orderCreate.order);

    /**
     *  local shipment types state
     */
    const [shipmentTypes, setShipmentTypes] = useState<any>([]);
    /**
     *  selected shipment types state
     */
    const [shipmentType, setShipmentType] = useState<string>('');
    /**
     *  selected shipment state
     */
    const [selectedShipment, setSelectedShipment] = useState<any>('');
    /**
     *  local shipment vehicle types state
     */
    const [courierVehicleTypes, setCourierVehicleTypes] = useState<any>([]);
    /**
     *  Transportation time state
     */
    const [transportationTime, setTransportationTime] = useState<number>(0);
    /**
     *  shipment height state
     */
    const [height, setHeight] = useState<string>('');
    /**
     *  shipment width state
     */
    const [width, setWidth] = useState<string>('');
    /**
     *  shipment length state
     */
    const [length, setLength] = useState<string>('');
    /**
     *  shipment weight state
     */
    const [weight, setWeight] = useState<string>('');
    /**
     *  alert pop up state handler
     */
    const [alert, setAlert] = useState(false);
    /**
     *  loading vehicle list handler
     */
    const [loading, setLoading] = useState(false);

    /**
     *  alert pop up message state handler
     */
    const [alertMsg, setAlertMsg] = useState('');
    const currencyConvert = CURRENCY_CODES.find(code => code.currency_code_iso === (getCurrentLocale() === 'en'?'DOLLAR':'EUR'));
    useEffect(() => {
        if (orderState.courier && !orderState.courierTypes) {
            dispatch(getCouriersAction());
        }
        if (orderState.courier && orderState.courierTypes && orderState.shipmentData.dimensions) {
            setShipmentType(orderState.shipmentData.dimensions.shipmentType);
            setHeight(orderState.shipmentData.dimensions.sizes.height);
            setWidth(orderState.shipmentData.dimensions.sizes.width);
            setLength(orderState.shipmentData.dimensions.sizes.length);
            setWeight(orderState.shipmentData.dimensions.sizes.weight);
        }
        if (orderState.courier && orderCreateState.supportCodeData && orderCreateState.supportCodeData.dimensions) {
            const { supportCodeData } = orderCreateState;
            setShipmentType(supportCodeData.cargo_type_id);
            setHeight(supportCodeData.dimensions.height);
            setWidth(supportCodeData.dimensions.width);
            setLength(supportCodeData.dimensions.length);
            setWeight(supportCodeData.dimensions.weight);
        }
        if (orderCreateState.orderPrefillData && orderCreateState.orderPrefillData.additional_data.dimensions) {
            const {orderPrefillData} = orderCreateState;
            setShipmentType(orderPrefillData.additional_data.cargo_type_id.id);
            setHeight(orderPrefillData.additional_data.dimensions.height);
            setWidth(orderPrefillData.additional_data.dimensions.width);
            setLength(orderPrefillData.additional_data.dimensions.length);
            setWeight(orderPrefillData.additional_data.dimensions.weight);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!selectedShipment && orderState.courierTypes && ((orderCreateState.orderPrefillData &&
            orderCreateState.orderPrefillData.additional_data.cargo_type_id) ||
            (orderCreateState.supportCodeData &&
              orderCreateState.supportCodeData.cargo_type_id))) {
            const cargoId = orderCreateState.supportCodeData ? orderCreateState.supportCodeData.cargo_type_id : orderCreateState.orderPrefillData.additional_data.cargo_type_id.id;
            const value = orderState.courierTypes.find(courier => cargoId === courier.id);
            if (value) dispatch(setSelectedShipmentAction(value.id))
        }
    }, [orderState.courierTypes]);

    useEffect(() => {
        if (
          selectedShipment &&
          ((orderCreateState.orderPrefillData &&
            orderCreateState.orderPrefillData.additional_data.cargo_type_id) ||
            (orderCreateState.supportCodeData &&
              orderCreateState.supportCodeData.cargo_type_id))
        ) {
          getCourierVehicle();
        }
      }, [
        selectedShipment,
        orderCreateState.orderPrefillData,
        orderCreateState.supportCodeData,
      ]);

    useEffect(() => {
        const selectedCourierVehicleType = orderState.courierVehicleTypes ? orderState.courierVehicleTypes.find(courier => courier.checked) : null;
        let isCourierVehicleTypePresent = false;
        if (orderCreateState.orderPrefillData && orderCreateState.orderPrefillData.additional_data && orderState.courierVehicleTypes) {
            isCourierVehicleTypePresent = orderState.courierVehicleTypes.find(courier => courier.id === orderCreateState.orderPrefillData.additional_data.transportation_vehicle_id.id) ? true : false;        
        }
        if (
            isCourierVehicleTypePresent && 
            selectedShipment && !selectedCourierVehicleType 
            && orderState.courierTypes && orderCreateState.orderPrefillData 
            && orderCreateState.orderPrefillData.additional_data.transportation_vehicle_id 
            && orderCreateState.order.courierVehicleTypes
        ) {
            onSelectVehicle(orderCreateState.orderPrefillData.additional_data.transportation_vehicle_id.id);
        }
    }, [selectedShipment, orderState.courierTypes, orderCreateState.orderPrefillData, orderCreateState.order.courierVehicleTypes]);

    const inputChangeHandler = (event: any, fieldName: string) => {
        const value = (fieldName === 'selectedDeliverDate' || fieldName === 'selectedCollectDate') ? event : event.target.value;
        switch (fieldName) {
            case 'height':
                setHeight(value);
                break;
            case 'width':
                setWidth(value);
                break;
            case 'length':
                setLength(value);
                break;
            case 'weight':
                setWeight(value);
                break;
            case 'shipmentType':
                setShipmentType(value);
                dispatch(setSelectedShipmentAction(value))
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (orderState.courierTypes) {
            setShipmentTypes(orderState.courierTypes);
            setSelectedShipment(orderState.courierTypes.find(courier => courier.checked))
        }
        if (orderState.courierVehicleTypes) {
            setLoading(false)
            setCourierVehicleTypes(orderState.courierVehicleTypes.sort(compareSort));
            setTransportationTime(orderState.transportation_time)
        }
    }, [orderState.courierTypes, orderState.courierVehicleTypes]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (orderCreateState.order.courierTypes) {
            orderCreateState.order.courierTypes.forEach((type: any) => {
                if (type.id === shipmentType) {
                    setHeight(type.height);
                    setWidth(type.width);
                    setLength(type.length);
                    setWeight(type.weight);
                }
            })
        }
    }, [shipmentType]); // eslint-disable-line react-hooks/exhaustive-deps

    const prepareGetVehicleListPayload = () => {
        const data = {
            from: orderState.courier.locationsLatLng[0].placeId,
            to: orderState.courier.locationsLatLng[1].placeId,
            // from: "ChIJ2UKSpUQWxkcRudD-eOl3t1g",
            // to: "ChIJ_fE1UpYXxkcRtEPn2pUMoH0",
            cargo_type: selectedShipment.id,
            cargo_type_id: selectedShipment.id,
            dimensions: {
                height: parseInt(height) ||selectedShipment.height,
                weight: parseInt(weight) || selectedShipment.weight,
                length: parseInt(length) || selectedShipment.length,
                width: parseInt(width) || selectedShipment.width
            }
        };
        return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
    };

    const getCourierVehicle = () => {
        if (shipmentType && height && width && weight && length) {
            setLoading(true)
            dispatch(getCourierVehicleAction(prepareGetVehicleListPayload()));
        }
    }

    const textFormat = (shipment, courierVehicle) =>{
        return(
            <React.Fragment>
                <IntlMessages id="shipmentTypeTitle"/> : {shipment} - <IntlMessages id="courierVehicle"/> : {courierVehicle.name}
            </React.Fragment>
        )
    }

    useEffect(() => {
        if (shipmentType && getSelectedVehicleCount()) {
            const shipment = orderState.courierTypes.find(courier => courier.id === shipmentType).name;
            const courierVehicle = orderState.courierVehicleTypes.find(vehicle => vehicle.checked);
            props.onHeadingChange(textFormat(shipment, courierVehicle), 1);
            // props.onHeadingChange(`${f({id:'shipmentTypeTitle', defaultMessage: 'Shipment Type'})} : ${shipment} - ${f({id:'courierVehicle', defaultMessage: 'Courier Vehicle'})} : ${courierVehicle.name}`, 1);
        }
    }, [shipmentType, courierVehicleTypes]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * sorting function
     */
    const compareSort = (a: any, b: any) => {
        if (a.order < b.order) {
            return -1;
        }
        if (a.order > b.order) {
            return 1;
        }
        return 0;
    };

    /**
     *  submit and go to next step handler
     */
    const onSubmit = () => {
        if (verifyData()) {
            dispatch(setDimensionData(prepareData()));
            props.handleNext();
        } else {
            setAlert(true);
            setAlertMsg('Please Fill All The Details');
        }
    };

    /**
     *  prepare data to save
     */
    const prepareData = () => {
        return {
            shipmentType,
            sizes: {
                height,
                width,
                length,
                weight
            },
            courierVehicle: getSelectedVehicle()
        }
    };

    /**
     *  select vehicle handler
     */
    const onSelectVehicle = (id: number) => {
        dispatch(setSelectedCourierVehicle(id));
    };

    /**
     *  get selected vehicle count handler
     */
    const getSelectedVehicleCount = () => {
        return courierVehicleTypes.filter(vehicle => vehicle.checked).length;
    };

    /**
     *  get selected vehicle id handler
     */
    const getSelectedVehicle = () => {
        return courierVehicleTypes.filter(vehicle => vehicle.checked)[0];
    };

    /**
     *  verify data all present
     */
    const verifyData = () => {
        if (height && width && length && weight && shipmentType && getSelectedVehicleCount()) {
            return true;
        } else {
            return false;
        }
    };

    /**
     *  render shipment selection
     */
    const renderShipmentType = (
        <Select
            value={shipmentType}
            labelId={'shipmentTypeSelect'}
            onChange={(event: any) => inputChangeHandler(event, 'shipmentType')}
            input={<Input id="ageSimple1"/>}
        >
            {shipmentTypes && shipmentTypes.map((type: any) => {
                return (
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                )
            })}
        </Select>
    );

    /**
     *  render courier vehicle selection
     */
    const renderCourierVehicleType = (
        courierVehicleTypes && courierVehicleTypes.map((vehicle: any) => {
                return (
                    <div className="col-3">
                        <Card className="shadow border-0" body inverse={vehicle.checked}
                              color={vehicle.checked && "primary"} onClick={() => onSelectVehicle(vehicle.id)}>
                            <CardImg top width="200px" height={"200px"} src={vehicle.image} alt="Vehicle Image"/>
                            <CardBody>
                                <h4 className="card-title"> {vehicle.name} </h4>
                                <h5 className="card-title"><IntlMessages id="services.price"/> Per Km : {(currencyConvert?currencyConvert.symbol:'') + (vehicle.price_per_km/ (currencyConvert?currencyConvert.converters:1))}</h5>
                                <h5 className="card-title">Minimum <IntlMessages id="services.price"/> :{(currencyConvert?currencyConvert.symbol:'') + (vehicle.minimum_transportation_price/ (currencyConvert?currencyConvert.converters:1))}</h5>
                                <Row>
                                    <Col xs="6"><h4><IntlMessages id="Height"/> : {vehicle.max_transportation_height}</h4></Col>
                                    <Col xs="6"><h4><IntlMessages id="Width"/> : {vehicle.max_transportation_width}</h4></Col>
                                    <Col xs="6"><h4><IntlMessages id="Length"/> : {vehicle.max_transportation_length}</h4></Col>
                                    <Col xs="6"><h4><IntlMessages id="Weight"/> : {vehicle.max_transportation_weight}</h4></Col>
                                </Row>
                            </CardBody>
                            <CardFooter><IntlMessages id="transportationPrice"/> : {(currencyConvert?currencyConvert.symbol:'') + (vehicle.transportation_price/ (currencyConvert?currencyConvert.converters:1))}</CardFooter>
                        </Card>
                    </div>
                )
            }
        )
    );

    return (
        <div>
            <AlertPopUp show={alert} warning title={alertMsg} onConfirm={() => setAlert(false)}/>
            <div className="row">
                <div className="col-5">
                    <FormControl className="mb-3" fullWidth>
                        <InputLabel id="shipmentTypeSelect"><IntlMessages id="courier.shipmentType"/></InputLabel>
                        {shipmentTypes && renderShipmentType}
                    </FormControl>
                    <FormControl className="mb-3" fullWidth>
                        <label><IntlMessages id="courier.dimensions"/> : (CM/ KG)</label>
                        <div className="row">
                            <div className="col-6">
                                <TextField type="number"
                                           label={<IntlMessages id="courier.height"/>}
                                           id='height'
                                           value={height}
                                           InputProps={{
                                               endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                           }}
                                           onChange={(event: any) => inputChangeHandler(event, "height")}/>
                            </div>
                            <div className="col-6">
                                <TextField type="number"
                                           id='width'
                                           value={width}
                                           label={<IntlMessages id="courier.width"/>}
                                           InputProps={{
                                               endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                           }}
                                           onChange={(event: any) => inputChangeHandler(event, "width")}/>
                            </div>
                            <div className="col-6">
                                <TextField type="number"
                                           id='length'
                                           value={length}
                                           label={<IntlMessages id="courier.length"/>}
                                           InputProps={{
                                               endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                           }}
                                           onChange={(event: any) => inputChangeHandler(event, "length")}/>
                            </div>
                            <div className="col-6">
                                <TextField type="number"
                                           id='weight'
                                           value={weight}
                                           label={<IntlMessages id="courier.weight"/>}
                                           InputProps={{
                                               endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                           }}
                                           onChange={(event: any) => inputChangeHandler(event, "weight")}/>
                            </div>
                        </div>
                    </FormControl>
                    <FormControl className="mb-3 align-items-end" fullWidth>
                        <Fab color="primary" size="medium" aria-label="add" className="float-right"
                             onClick={getCourierVehicle}>
                            <SearchIcon/>
                        </Fab>
                    </FormControl>

                </div>
            </div>
            <div className="row">
                <div className="col-10">
                    <FormControl className="mb-3" fullWidth>
                        <label><IntlMessages id="courier.courierVehicle"/></label>
                    </FormControl>
                </div>
            </div>
            <div className="row">
                {courierVehicleTypes && renderCourierVehicleType}
                {loading &&
								<div className="row">
									<Col sm="12" md={{size: 2, offset: 5}}>
										<Spinner
											style={{width: "3rem", height: "3rem"}}
											color="success"
										/>
									</Col>
								</div>}
            </div>
            <div className="row">
                <div className="col-5">
                    {transportationTime ? <Alert severity="info">
                    <IntlMessages id="courier.transportationTime"/>
                        : {moment.duration(transportationTime, "seconds").humanize()}</Alert> : null}
                </div>
            </div>

            <div className="mt-2">
                <div>
                    <Button
                        disabled={props.activeStep === 0}
                        onClick={props.handleBack}
                        className="jr-btn"
                    >
                       <IntlMessages id="appModule.back"/>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!verifyData()}
                        onClick={onSubmit}
                        className="jr-btn"
                    >
                        {props.activeStep === props.steps.length - 1 ? <IntlMessages id="appModule.finish"/> : <IntlMessages id="appModule.next"/>}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CouriersStep2;
