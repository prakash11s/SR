import React, { Component } from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select, Button } from '@material-ui/core';
import { Card, CardBody, CardImg, CardSubtitle } from 'reactstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect } from 'react-redux'
import moment from 'moment';

import axios from '../../../util/Api';
import IntlMessages from '../../../util/IntlMessages';
import {
    SET_NEW_ORDER,
    SET_SUPPORTCODE_DATA,
    SET_ORDER_PREFILL_DATA
} from "../../../constants/ActionTypes";
import {
    IVehiclesStep1Props,
    IVehiclesStep1State,
    IBrands,
    IModels,
    IFuelType,
    IVehicleData,
    IResponseData,
    IRootVehicleStep1State
} from './Interface/Step1Interface';
import AlertPopUp from "../../../common/AlertPopUp";
import { readableDate } from "../../../util/helper";

class VehiclesStep1 extends Component<IVehiclesStep1Props, IVehiclesStep1State> {

    /**
     * States of vehicleStepper Step 1
     */
    state = {
        vehicleData: {
            plate_id: '',
            vehicle_id: null
        },
        brands: [],
        models: [],
        fuelType: [],
        constructionYears: [],
        formValue: {
            selectedBrandId: null,
            selectedModelId: null,
            selectedYear: null,
            selectedFuelId: null,
        },
        uuid: localStorage.getItem('uuid'),
        secret: localStorage.getItem('secret'),
        supportCodeData: [],
        displayCarImage: false,
        selectedCarImage: '',
        service_expire: '',
        brandName: null,
        modelName: null,
        fuelName: null,
        year: null,
        error: false,
        errorMsg: "",
        search: "",
        searchError: false,
        searchErrorMsg: ""
    };

    /**
     * sorting function
     */
    compareSort = (a: { name: string | number }, b: { name: string | number }) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    };

    componentDidMount() {
        axios.get('/vehicle-information-service/brands')
            .then(response => {
                this.setState({
                    brands: response.data.sort(this.compareSort)
                });
            })
            .catch(error => console.log(error));
        if (this.state.uuid && this.state.secret) {
            this.getExistingOrder();
        }
        if (this.props.orderId && this.props.orderId !== 0) {
            this.getOrderDetails(this.props.orderId);
        }
        if (this.props.orderState) {
            if (this.props.orderState.vehicle) {
                const { brand, fuel, images, model, construction_year, vehicleData, service_expire } = this.props.orderState.vehicle;
                this.setState({
                    ...this.state,
                    formValue: {
                        selectedBrandId: brand.id,
                        selectedModelId: model.id,
                        selectedFuelId: fuel.id,
                        selectedYear: construction_year,
                    },
                    selectedCarImage: images,
                    vehicleData: vehicleData,
                    service_expire,
                    displayCarImage: Boolean(images),
                    brandName: brand.name,
                    modelName: model.name,
                    fuelName: fuel.name,
                    year: construction_year
                }, () => {
                    this.getModels()
                    this.getVehicleYears()
                    this.getFuelTypes()
                })
            }
        }
    }

    componentDidUpdate() {
        if (this.state.brandName && this.state.modelName && this.state.fuelName && this.state.year) {
            this.props.onHeadingChange(`${this.getCurrentLocale() === 'en' ? 'Vehicle' : 'Voertuig'} : ${this.state.brandName} ${this.state.modelName} ${this.state.fuelName} ${this.state.year} (${this.state.vehicleData.plate_id})`, 0);
        }
    }

    getCurrentLocale = () => {
        const data = localStorage.getItem('locale');
        if (data) {
            return JSON.parse(data && data).locale
        } else {
            return 'en';
        }
    };

    /**
     *  get order details
     * @param orderId
     */
    getOrderDetails = (orderId: number) => {
        axios.get(`/orders/${orderId}`)
            .then(res => res.data)
            .then((response) => {
                const license = response.additional_data.find((data: any) => data.key === 'license-plate');
                const vehicleId = response.additional_data.find((data: any) => data.key === 'vehicle_id').value;
                this.setState({
                    ...this.state,
                    vehicleData: {
                        plate_id: license ? license.value : "",
                        vehicle_id: vehicleId,
                    }
                }, () => {
                    if (license) {
                        this.onSearchClicked()
                    }
                    this.props.setOrderPrefillData(response)
                })
                if (!license && vehicleId && response.additional_data.vehicle) {
                    const data = response.additional_data.vehicle;
                    this.setState({
                        ...this.state,
                        formValue: {
                            ...this.state.formValue,
                            selectedBrandId: data.brand ? data.brand.id : null,
                            selectedFuelId: data.fuel ? data.fuel.id : null,
                            selectedModelId: data.model ? data.model.id : null,
                            selectedYear: data.construction_year ? data.construction_year : null,
                        }
                    }, () => {
                        this.onSearchClicked()
                    })
                }
            }
            )
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    this.setState({
                        ...this.state,
                        error: true,
                        errorMsg: "Order Not Found"
                    })
                }
            })
    };

    /**
     *  get support code list
     * @param event
     */
    getSupportCodeList = (event) => {
        if (Boolean(event.target.value) && event.target.value.length > 1) {
            axios.get(`/support-codes?code=${event.target.value}`)
                .then((response) => {
                    this.setState({ ...this.state, supportCodeData: response.data.data });
                })
                .catch((error) => console.log(error.response))
        }
    };

    onSearchChange = (event) => {
        this.setState({ search: event.target.value })
    }

    addOrderId = () => {
        axios.get(`/orders/${this.state.search}`)
            .then(res => res.data)
            .then((response: any) => {
                this.props.handleOrderReset(this.state.search);
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    this.setState({
                        ...this.state,
                        searchError: true,
                        searchErrorMsg: 'Not Found'
                    })
                }
            })
    }

    /**
     *  get vehicle construction years
     */
    getVehicleYears = () => {
        axios.get(`vehicle-information-service/construction-years?model_id=${this.state.formValue.selectedModelId}`)
            .then((response) => {
                this.setState({ ...this.state, constructionYears: response.data.sort() })
            })
            .catch((error) => console.log(error.response))
    };

    /**
     *  fill vehicle data from support code
     * @param event
     * @param value
     * @param reason
     */
    getAutoFillVehicleData = (event: any, value: any, reason: string) => {
        if (reason === 'select-option') {
            axios.get(`/support-codes/${value.code}`)
                .then(response => response.data.data)
                .then(res => {
                    this.setState({
                        ...this.state,
                        vehicleData: {
                            plate_id: res[`license-plate`],
                            vehicle_id: res.vehicle_id
                        }
                    }, () => this.props.setSupportCodeData(res));
                }).then(() => this.onSearchClicked())
                .catch((error) => {
                    console.log(error.response)
                })
        }
    }

    /**
     *  get existing order based on uuid, secret
     */
    getExistingOrder = () => {
        axios.get(`/booking-service/order-synchronization?uuid=${this.state.uuid}&secret=${this.state.secret}`)
            .then(response => {
                if (response.data.vehicle_id) {
                    this.setState({
                        vehicleData: {
                            ...this.state.vehicleData,
                            vehicle_id: response.data.vehicle_id
                        }
                    });
                    this.getVehicleDetails(response.data.vehicle_id);
                }
            })
            .catch(error => console.log(error))
    }

    /**
     *  get vehicle details
     * @param vehicle_id
     */
    getVehicleDetails = (vehicle_id: null | number) => {
        axios.get(`/vehicle-information-service/information?vehicle_id=${vehicle_id}`)
            .then((response) => {
                this.setState({
                    ...this.state,
                    vehicleData: {
                        ...this.state.vehicleData,
                        vehicle_id: response.data.vehicle_id
                    },
                    formValue: {
                        ...this.state.formValue,
                        selectedBrandId: response.data.brand && response.data.brand.id,
                        selectedModelId: response.data.model && response.data.model.id,
                        selectedFuelId: response.data.fuel && response.data.fuel.id,
                        selectedYear: response.data.construction_year ? new Date(response.data.construction_year).getFullYear() : this.state.formValue.selectedYear
                    }
                }, () => {
                    if (response.data.model && response.data.model.id) {
                        this.getModels();
                    }
                    if (response.data && response.data.fuel) {
                        this.getFuelTypes();
                    }
                    if (response.data.construction_year) {
                        this.getVehicleYears();
                    }
                })
            })
    }

    /**
     *  get vehicle model list
     */
    getModels() {
        axios.get(`/vehicle-information-service/brands/${this.state.formValue.selectedBrandId}/models?with=${this.state.formValue.selectedModelId}`)
            .then(response => {
                this.setState({ ...this.state, models: response.data.sort(this.compareSort) })
            })
            .catch(error => console.log(error))
    }

    /**
     *  get vehicle fuel list
     */
    getFuelTypes() {
        if (this.state.formValue.selectedModelId && this.state.formValue.selectedBrandId) {
            axios.get(`/vehicle-information-service/fuels?model_id=${this.state.formValue.selectedModelId}&brand_id=${this.state.formValue.selectedBrandId}`)
                .then(response => {
                    this.setState({ ...this.state, fuelType: response.data.sort(this.compareSort) })
                })
                .catch(error => console.log(error))
        }
    }

    /**
     *  license-plate input field handler
     * @param event
     */
    setLicensePlateSearchData(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
        const plateId = event.target.value;
        this.setState({ ...this.state, vehicleData: { ...this.state.vehicleData, plate_id: plateId } })
    }

    /**
     *  selected brand handler
     * @param event
     */
    setBrandId(event: React.ChangeEvent<{ name?: string; value: unknown; }>) {
        const brandId = event.target.value;
        this.setState({
            ...this.state,
            displayCarImage: false,
            vehicleData: {
                plate_id: '',
                vehicle_id: null
            },
            formValue: {
                selectedBrandId: brandId,
            },
        }, () => this.getModels())
    }

    /**
     *  selected model handler
     * @param event
     */
    setModelId(event: React.ChangeEvent<{ name?: string; value: unknown; }>) {
        const modelId = event.target.value;
        this.setState({
            ...this.state,
            formValue: {
                ...this.state.formValue,
                selectedModelId: modelId
            }
        }, () => {
            this.getVehicleYears()
            this.getFuelTypes()
        })
    }

    /**
     *  selected fuel handler
     * @param event
     */
    setFuelType = (event: React.ChangeEvent<{ name?: string; value: unknown; }>) => {
        const selectId = event.target.value;
        this.setState({
            ...this.state,
            formValue: {
                ...this.state.formValue,
                selectedFuelId: selectId
            }
        })
    };

    /**
     *  selected construction year handler
     * @param event
     */
    setConstructionYear = (event: React.ChangeEvent<{ name?: string; value: unknown; }>) => {
        const constructionYearSelected = event.target.value;
        this.setState({
            ...this.state,
            formValue: {
                ...this.state.formValue,
                selectedYear: constructionYearSelected
            }
        });
    };

    /**
     *  Save vehicle information handler
     */
    saveInformations = () => {
        const reqObj = {
            uuid: localStorage.getItem('uuid'),
            secret: localStorage.getItem('secret'),
            data: {
                vehicle_id: this.state.vehicleData.vehicle_id,
                plate_id: this.state.vehicleData.plate_id
            }
        };
        const vehicleData = {
            construction_year: this.state.formValue.selectedYear,
            vehicleData: this.state.vehicleData,
            images: this.state.selectedCarImage,
            brand: { id: this.state.formValue.selectedBrandId, name: this.state.brandName },
            model: { id: this.state.formValue.selectedModelId, name: this.state.modelName },
            fuel: { id: this.state.formValue.selectedFuelId, name: this.state.fuelName },
            service_expire: this.state.service_expire
        }
        console.log(vehicleData, reqObj, "req");
        this.props.setOrderVehicleData({ vehicle: vehicleData });
        axios.post(`/booking-service/order-synchronization`, reqObj);
        this.props.handleNext();
    }

    /**
     *  vehicle search handler
     */
    onSearchClicked = () => {
        this.setState({ ...this.state, displayCarImage: false });
        if (this.state.vehicleData.plate_id) {
            axios.get(`/vehicle-information-service/information?license-plate=${this.state.vehicleData.plate_id}`)
                .then(response => {
                    this.setState({
                        ...this.state,
                        vehicleData: {
                            ...this.state.vehicleData,
                            plate_id: response.data.plate,
                            vehicle_id: response.data.vehicle_id
                        },
                        models: [],
                        fuelType: [],
                        constructionYears: [],
                        formValue: {
                            ...this.state.formValue,
                            selectedBrandId: response.data.brand && response.data.brand.id,
                            selectedModelId: response.data.model && response.data.model.id,
                            selectedFuelId: response.data.fuel && response.data.fuel.id,
                            selectedYear: response.data.construction_year && new Date(response.data.construction_year).getFullYear()
                        },
                        selectedCarImage: response.data.images.length ? response.data.images[0].location : require("assets/images/no_car_image.jpg"),
                        brandName: response.data.brand && response.data.brand.name,
                        modelName: response.data.model && response.data.model.name,
                        fuelName: response.data.fuel && response.data.fuel.name,
                        service_expire: response.data.mandatory_service_expiry_date ? readableDate(response.data.mandatory_service_expiry_date) : '',
                        year: response.data.construction_year && moment(response.data.construction_year).format('YYYY'),
                        displayCarImage: true
                    }, () => {
                        if (response.data.model && response.data.model.id) {
                            this.getModels();
                        }
                        if (response.data && response.data.fuel) {
                            this.getFuelTypes();
                        }
                        if (response.data.construction_year) {
                            this.getVehicleYears();
                        }
                    })
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        this.setState({
                            ...this.state,
                            error: true,
                            errorMsg: this.props.localeState.locale === 'en' ? 'The License plate could not be found.' : 'Het kenteken kon niet worden gevonden.'
                        })
                    }
                })
        } else {
            axios.get(`/vehicle-information-service/information?brand_id=${this.state.formValue.selectedBrandId}&model_id=${this.state.formValue.selectedModelId}&fuel_id=${this.state.formValue.selectedFuelId}&construction_year=${this.state.formValue.selectedYear}`)
                .then(response => response.data)
                .then(vehicleResponseData => {
                    this.setState({
                        ...this.state,
                        vehicleData: {
                            vehicle_id: vehicleResponseData.vehicle_id,
                            plate_id: vehicleResponseData.plate_id ? vehicleResponseData.plate_id : this.state.vehicleData.plate_id
                        },
                        selectedCarImage: vehicleResponseData.images.length ? vehicleResponseData.images[0].location : require("assets/images/no_car_image.jpg"),
                        brandName: vehicleResponseData.brand && vehicleResponseData.brand.name,
                        modelName: vehicleResponseData.model && vehicleResponseData.model.name,
                        fuelName: vehicleResponseData.fuel && vehicleResponseData.fuel.name,
                        service_expire: vehicleResponseData.mandatory_service_expiry_date ? readableDate(vehicleResponseData.mandatory_service_expiry_date) : '',
                        year: vehicleResponseData.construction_year && vehicleResponseData.construction_year,
                        displayCarImage: true
                    })
                })
                .catch(error => console.log(error))
        }
    };

    resetError = () => {
        this.setState({
            ...this.state,
            error: false,
            errorMsg: '',
        })
    };

    render() {
        /**
         *  next button visible handler
         */
        const status = this.state.vehicleData.vehicle_id;

        return (
            <div className="row">
                {this.state.error &&
                    <AlertPopUp show={this.state.error} type={"danger"} title={this.state.errorMsg} confirmBtnBsStyle={"danger"}
                        onConfirm={this.resetError} />}
                <div className="col-md-6">
                    {!this.props.orderId &&
                        <div className="col-md-12 col-8 mt-4 manage-margin d-flex">
                            <Autocomplete
                                className="w-100 mb-2 h-75"
                                id="support-code"
                                options={this.state.supportCodeData}
                                getOptionLabel={(option: { code: string }) => option.code.toString()}
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label={<IntlMessages
                                    id="vehicleStepperStep1.supportCode" />} variant="outlined" />}
                                onInputChange={(event) => this.getSupportCodeList(event)}
                                onChange={(event, value, reason) => this.getAutoFillVehicleData(event, value, reason)}
                            />
                            <div className="d-flex">
                                <TextField type="number" variant='outlined' fullWidth style={{ width: 100 }} error={this.state.searchError} onChange={this.onSearchChange} helperText={this.state.searchErrorMsg} />
                                <button className="search-icon" onClick={this.addOrderId}><i className="zmdi zmdi-search zmdi-hc-lg" /></button>
                            </div>
                        </div>
                    }
                    <div className="col-md-3 col-8">
                        <FormControl className="w-100 mb-2 h-75">
                            <TextField
                                id="vehiclePlate"
                                label={<IntlMessages id="vehicleStepperStep1.licensePlate" />}
                                value={this.state.vehicleData.plate_id}
                                margin="normal"
                                onChange={(event) => this.setLicensePlateSearchData(event)}
                                fullWidth
                            />
                        </FormControl>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="ml-3"><IntlMessages id="vehicleStepperStep1.or" /></div>
                    <br></br>
                    <div className="col-lg-3 col-sm-6 col-8">
                        <FormControl className="w-100 mb-2 h-75">
                            <InputLabel id={'brandListSelect'}>{!this.state.formValue.selectedBrandId &&
                                <IntlMessages id="vehicleStepperStep1.brandList" />}</InputLabel>
                            <Select
                                labelId={'brandListSelect'}
                                value={this.state.formValue.selectedBrandId}
                                onChange={(event) => this.setBrandId(event)}
                                required
                            >
                                <MenuItem value="">
                                    <em><IntlMessages id="vehicleStepperStep1.none" /></em>
                                </MenuItem>
                                {this.state.brands.map((data: IBrands) => <MenuItem
                                    value={data.id}>{data.name}</MenuItem>)}
                            </Select>
                            <br></br>
                        </FormControl>
                        <FormControl className="w-100 mb-2 h-75">
                            <InputLabel id={'modelListSelect'}>{!this.state.formValue.selectedModelId &&
                                <IntlMessages id="vehicleStepperStep1.modelList" />}</InputLabel>
                            <Select
                                labelId={'modelListSelect'}
                                value={this.state.formValue.selectedModelId}
                                onChange={(event) => this.setModelId(event)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.state.models.map((data: IModels) => <MenuItem
                                    value={data.id}>{data.name}</MenuItem>)}
                            </Select>
                            <br></br>
                        </FormControl>

                        <FormControl className="w-100 mb-2 h-75">
                            <InputLabel id={'modelListSelect'}>{!this.state.formValue.selectedFuelId &&
                                <IntlMessages id="vehicleStepperStep1.fuelType" />}</InputLabel>
                            <Select
                                labelId={'fuelListSelect'}
                                value={this.state.formValue.selectedFuelId}
                                onChange={(event) => this.setFuelType(event)}
                                required
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.state.fuelType.map((data: IFuelType) => <MenuItem
                                    value={data.id}>{data.name}</MenuItem>)}
                            </Select>
                            <br></br>
                        </FormControl>

                        <FormControl className="w-100 mb-2 h-75">
                            <InputLabel id={'yearListSelect'}>{!this.state.formValue.selectedYear &&
                                <IntlMessages id="vehicleStepperStep1.constructionYear" />}</InputLabel>
                            <Select
                                labelId={'yearListSelect'}
                                value={this.state.formValue.selectedYear}
                                onChange={(event) => this.setConstructionYear(event)}
                                required
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.state.constructionYears.map(data =>
                                    <MenuItem value={data}>{data}</MenuItem>
                                )}
                            </Select>
                            <br></br>
                        </FormControl>
                        <Button onClick={this.onSearchClicked} variant="contained" color="primary"><IntlMessages
                            id="vehicleStepperStep1.searchButton" /></Button>
                    </div>
                    <br></br>
                    <div className="mt-2">
                        <div>
                            <Button
                                disabled={this.props.activeStep === 0}
                                onClick={this.props.handleBack}
                                className="jr-btn"
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.saveInformations}
                                className="jr-btn"
                                disabled={!status}
                            >
                                {this.props.activeStep === this.props.steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    {this.state.displayCarImage &&
                        <div className="col-8">
                            <Card className="shadow border-0">
                                <CardImg top width="100%" src={this.state.selectedCarImage} alt="Vehicle Image" />
                                <CardBody>
                                    <h3 className="card-title"> {this.state.brandName} {this.state.modelName} </h3>
                                    <CardSubtitle> {this.state.fuelName} {this.state.year} </CardSubtitle>
                                    <CardSubtitle> <IntlMessages id={'vehicle.vehicleID'} /> : {this.state.vehicleData.vehicle_id} </CardSubtitle>
                                    {this.state.service_expire && <CardSubtitle> <IntlMessages id={'vehicle.serviceExpire'} /> : {this.state.service_expire} </CardSubtitle>}
                                    {!this.state.service_expire && <CardSubtitle className={"bg-warning"}> <IntlMessages id={'vehicle.serviceExpire'} /> : <IntlMessages id={'vehicle.serviceExpireNotFound'} /> </CardSubtitle>}
                                </CardBody>
                            </Card>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

/**
 *  reducer dispatch
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        /**
         *  set vehicle data to reducer
         * @param data
         */
        setOrderVehicleData: (data: { vehicle: IVehicleData }) => dispatch({ type: SET_NEW_ORDER, payload: data }),

        /**
         *  save support code data to reducer
         * @param data
         */
        setSupportCodeData: (data: IResponseData) => dispatch({ type: SET_SUPPORTCODE_DATA, payload: data }),
        /**
         *  save order data to reducer
         * @param data
         */
        setOrderPrefillData: (data: any) => dispatch({ type: SET_ORDER_PREFILL_DATA, payload: data }),
    }
};

/**
 *  reducer state
 * @param state
 */
const mapStateToProps = (state: IRootVehicleStep1State) => {
    return {
        /**
         *  orderState of orderCreate
         */
        orderState: state.orderState.orderCreate.order,
        localeState: state.settings.locale
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VehiclesStep1);
