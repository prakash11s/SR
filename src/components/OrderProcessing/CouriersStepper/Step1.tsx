import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { default as SupportCodeSelection } from "@material-ui/lab/Autocomplete";
import { Button, TextField } from "@material-ui/core";
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";
import IntlMessages from "../../../util/IntlMessages";
import axios from "../../../util/Api";
import {
  SET_NEW_ORDER,
  SET_ORDER_PREFILL_DATA,
  SET_SUPPORTCODE_DATA,
} from "../../../constants/ActionTypes";
import { connect } from "react-redux";

import "./Style/Step1Style.scss";

import {
  ICourierStep1Props,
  ICourierStep1State,
} from "./Interface/Step1Interface";
import AlertPopUp from "../../../common/AlertPopUp";
import { NotListedLocationTwoTone } from "@material-ui/icons";

const windowClone: any = window;
const google = windowClone.google;

const geocoder = new google.maps.Geocoder();
const directionsService = new google.maps.DirectionsService();

export interface IMap {
  from: {};
  to: {};
  setDistance?: (value: string) => void;
  directions?: any;
  onDirectionsMounted?: any;
}

const renderMap = (props: IMap) => {
  return (
    <GoogleMap
      defaultZoom={7}
      defaultCenter={new google.maps.LatLng(41.85073, -87.65126)}
    >
      {props.directions && (
        <DirectionsRenderer
          ref={props.onDirectionsMounted}
          directions={props.directions}
        />
      )}
    </GoogleMap>
  );
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
  lifecycle<any, any, any>({
    renderData() {
      const DirectionsService = new google.maps.DirectionsService();
      const origin = {
        lat: this.props.from.latitude,
        lng: this.props.from.longitude,
      };
      const destination = {
        lat: this.props.to.latitude,
        lng: this.props.to.longitude,
      };
      DirectionsService.route(
        {
          origin: new google.maps.LatLng(origin.lat, origin.lng),
          destination: new google.maps.LatLng(destination.lat, destination.lng),
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result,
              onDirectionsMounted: (ref) => {
                if (ref) {
                  ref.DrawingManager = ref;
                }
              },
            });
            this.props.setDistance(result.routes[0].legs[0].distance.text);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    },
    componentDidMount() {
      this.renderData();
    },
    componentDidUpdate(prevProps: any) {
      if (this.props !== prevProps) {
        this.renderData();
      }
    },
  })
)(renderMap);

class CouriersStep1 extends Component<ICourierStep1Props, ICourierStep1State> {
  state: any = {
    fromInput: "",
    toInput: "",
    fromInputLatLng: {},
    toInputLatLng: {},
    distance: "",
    supportCodeData: [],
    uuid: localStorage.getItem("uuid"),
    secret: localStorage.getItem("secret"),
    error: false,
    errorMsg: "",
    search: "",
    searchError: false,
    searchErrorMsg: "",
  };

  componentDidMount() {
    if (this.state.uuid && this.state.secret) {
      this.getExistingOrder();
    }
    if (this.props.orderId && this.props.orderId !== 0) {
      this.getOrderDetails(this.props.orderId);
    }
    if (this.props.orderState) {
      if (this.props.orderState.courier) {
        const {
          locationName,
          locationsLatLng,
          distance,
        } = this.props.orderState.courier;
        this.setState({
          ...this.state,
          fromInput: locationName.fromInput,
          fromInputLatLng: {
            latitude: locationsLatLng[0].latitude,
            longitude: locationsLatLng[0].longitude,
            placeId: locationsLatLng[0].placeId,
          },
          toInput: locationName.toInput,
          toInputLatLng: {
            latitude: locationsLatLng[1].latitude,
            longitude: locationsLatLng[1].longitude,
            placeId: locationsLatLng[1].placeId,
          },
          distance: distance,
        });
      }
    }
  }

  contains = (target: any, pattern: any) => {
    let value = 0;
    pattern.forEach(function(word: any) {
      value = value + target.includes(word);
    });
    return value === 1;
  };

  setDistanceState = (distance: string) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        distance,
      };
    });
  };

  renderFunc = (
    { getInputProps, getSuggestionItemProps, suggestions, loading }: any,
    placeholder: string
  ) => {
    return (
      <div>
        <TextField
          label={placeholder}
          variant="outlined"
          {...getInputProps()}
        />
        <div className="Demo__autocomplete-container">
          {loading && <div style={{ padding: "0 10px" }}>Loading...</div>}
          {suggestions
            .filter((suggestion: any) => {
              if (
                suggestion.description === this.state.fromInput ||
                suggestion.description === this.state.toInput
              ) {
                return false;
              }
              const data = ["country", "locality"];
              return !this.contains(suggestion.types, data);
            })
            .map((suggestion: any) => {
              const className = classnames(
                "Demo__suggestion-item",
                "itemContainer",
                {
                  "Demo__suggestion-item--active": suggestion.active,
                }
              );
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  textFormat = () => {
    return (
      <React.Fragment>
        <IntlMessages id="fromTitle" /> : {this.state.fromInput} -{" "}
        <IntlMessages id="toTitle" /> : {this.state.toInput},{" "}
        <IntlMessages id="servicePoint.distance" /> - {this.state.distance}
      </React.Fragment>
    );
  };

  componentDidUpdate() {
    if (
      Object.keys(this.state.fromInputLatLng).length &&
      Object.keys(this.state.toInputLatLng).length
    ) {
      this.props.onHeadingChange(this.textFormat(), 0);
      // this.props.onHeadingChange(`${this.getCurrentLocale() === 'en' ? 'From' : 'Van' } : ${this.state.fromInput} -  ${this.getCurrentLocale() === 'en' ? 'To' : 'Naar' } : ${this.state.toInput}, distance - ${this.state.distance}`, 0);
    }
  }

  getCurrentLocale = () => {
    const data = localStorage.getItem("locale");
    if (data) {
      return JSON.parse(data && data).locale;
    } else {
      return "en";
    }
  };

  /**
   *  set distance list
   * @param value
   */
  setDistance = (value: string) => {
    this.setState({ distance: value });
  };

  /**
   *  get support code list
   * @param event
   */
  getSupportCodeList = (event: any) => {
    if (Boolean(event.target.value) && event.target.value.length > 1) {
      axios
        .get(
          `/support-codes?code=${event.target.value}`
        )
        .then((response: any) => response.data.data)
        .then((res: any) => {
          if (res) {
            this.setState({ supportCodeData: res });
          }
        })
        .catch((error) => console.log(error.response));
    }
  };

  /**
   *  get order details
   * @param orderId
   */
  getOrderDetails = (orderId: number) => {
    axios
      .get(`/orders/${orderId}`)
      .then((res) => res.data)
      .then((response: any) => {
        const locationData = response.additional_data.find(
          (data: any) => data.key === "route_information"
        ).json_value;
        geocoder.geocode(
          { placeId: locationData.origin.place_id },
          (results: any, status: string) =>
            this.getLocation(results[0], status, "from")
        );
        geocoder.geocode(
          { placeId: locationData.destination.place_id },
          (results: any, status: string) =>
            this.getLocation(results[0], status, "to")
        );
        this.props.setOrderPrefillData(response);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          this.setState({
            ...this.state,
            error: true,
            errorMsg: "Order Not Found",
          });
        }
      });
  };

  getLocation = (locationData: any, status: string, field: string) => {
    if (status === "OK") {
      const lat = locationData.geometry.location.lat();
      const lng = locationData.geometry.location.lng();
      if (field === "from") {
        this.setState({
          ...this.state,
          fromInput: locationData.formatted_address,
          fromInputLatLng: {
            latitude: lat,
            longitude: lng,
            placeId: locationData.place_id,
          },
        });
      }
      if (field === "to") {
        this.setState({
          ...this.state,
          toInput: locationData.formatted_address,
          toInputLatLng: {
            latitude: lat,
            longitude: lng,
            placeId: locationData.place_id,
          },
        });
      }
    }
  };

  /**
   *  fill vehicle data from support code
   * @param event
   * @param value
   * @param reason
   */
  getAutoFillData = (event: any, value: { code: number }, reason: string) => {
    if (reason === "select-option") {
      axios
        .get(`/support-codes/${value.code}`)
        .then((response: any) => {
          const res = response.data.data;
          if (!res) {
            this.setState({
              ...this.state,
              error: true,
              errorMsg: <IntlMessages id="supportcode.error" />,
            });
          }
          const locationData = res.locationData
            ? JSON.parse(res.locationData)
            : null;
          if (locationData) {
            this.setState({
              ...this.state,
              fromInput: locationData.locationName.fromInput,
              fromInputLatLng: {
                latitude: locationData.locationsLatLng[0].latitude,
                longitude: locationData.locationsLatLng[0].longitude,
                placeId: locationData.locationsLatLng[0].placeId,
              },
              toInput: locationData.locationName.toInput,
              toInputLatLng: {
                latitude: locationData.locationsLatLng[1].latitude,
                longitude: locationData.locationsLatLng[1].longitude,
                placeId: locationData.locationsLatLng[1].placeId,
              },
            });
            this.props.setSupportCodeData(res);
          } else if (res.from && res.to) {
            geocoder.geocode(
              { placeId: res.from },
              (results: any, status: string) =>
                this.getLocation(results[0], status, "from")
            );
            geocoder.geocode(
              { placeId: res.to },
              (results: any, status: string) =>
                this.getLocation(results[0], status, "to")
            );
            this.props.setSupportCodeData(res);
          } else {
            this.setState({
              ...this.state,
              error: true,
              errorMsg: <IntlMessages id="supportcode.error" />,
            });
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  /**
   *  get existing order data
   */
  getExistingOrder = () => {
    axios
      .get(
        `/booking-service/order-synchronization?uuid=${this.state.uuid}&secret=${this.state.secret}`
      )
      .then((response: any) => {
        if (response.data.from && response.data.to) {
          this.setState({ distance: response.data.distance });
          const geocoder = new google.maps.Geocoder();
          let instance = this;
          geocoder.geocode({ placeId: response.data.from }, function(
            results,
            status
          ) {
            if (status === "OK") {
              // instance.setState({fromPlaceDetails: results[0]})
            }
          });
          geocoder.geocode({ placeId: response.data.to }, function(
            results,
            status
          ) {
            if (status === "OK") {
              // instance.setState({toPlaceDetails: results[0]})
            }
          });
        }
      })
      .catch((error) => console.log(error));
  };

  /**
   *  save information
   */
  saveInformations = () => {
    const { fromInputLatLng, toInputLatLng, fromInput, toInput } = this.state;
    if (
      Object.keys(fromInputLatLng).length &&
      Object.keys(toInputLatLng).length
    ) {
      const locationData = {
        locationName: {
          fromInput: fromInput,
          toInput: toInput,
        },
        locationsLatLng: [
          {
            latitude: fromInputLatLng["latitude"],
            longitude: fromInputLatLng["longitude"],
            placeId: fromInputLatLng["placeId"],
          },
          {
            latitude: toInputLatLng["latitude"],
            longitude: toInputLatLng["longitude"],
            placeId: toInputLatLng["placeId"],
          },
        ],
        distance: this.state.distance,
      };
      const reqObj = {
        uuid: this.state.uuid,
        secret: this.state.secret,
        data: {
          from: fromInputLatLng["placeId"],
          to: toInputLatLng["placeId"],
          distance: this.state.distance,
        },
      };
      this.props.setOrderCourierLocation({ courier: locationData });
      axios.post(`/booking-service/order-synchronization`, reqObj);
      this.props.handleNext();
    }
  };

  fromHandleChange = (address: string) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        fromInputLatLng: {},
        fromInput: address,
      };
    });
  };

  toHandleChange = (address: any) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        toInputLatLng: {},
        toInput: address,
      };
    });
  };

  fromHandleSelect = (address: any, placeId: string) => {
    this.selectHandler(address, "from", placeId);
  };

  toHandleSelect = (address: any, placeId: string) => {
    this.selectHandler(address, "to", placeId);
  };

  selectHandler = (address: any, field: string, placeId: string) => {
    field === "from"
      ? this.setState((prevState) => {
          return {
            ...prevState,
            fromInput: address,
          };
        })
      : this.setState((prevState) => {
          return {
            ...prevState,
            toInput: address,
          };
        });
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        field === "from"
          ? this.setState((prevState) => {
              return {
                ...prevState,
                fromInputLatLng: {
                  latitude: latLng.lat,
                  longitude: latLng.lng,
                  placeId: placeId,
                },
              };
            })
          : this.setState((prevState) => {
              return {
                ...prevState,
                toInputLatLng: {
                  latitude: latLng.lat,
                  longitude: latLng.lng,
                  placeId: placeId,
                },
              };
            });
      })
      .catch((error) => console.error("Error", error));
  };

  OnMapError = (status: any, clearSuggestions: any) => {
    clearSuggestions();
  };

  onSearchChange = (event) => {
    this.setState({ search: event.target.value });
  };

  addOrderId = () => {
    axios
      .get(`/orders/${this.state.search}`)
      .then((res) => res.data)
      .then((response: any) => {
        this.props.handleOrderReset(this.state.search);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          this.setState({
            ...this.state,
            searchError: true,
            searchErrorMsg: "Not Found",
          });
        }
      });
  };

  resetError = () => {
    this.setState({
      ...this.state,
      error: false,
      errorMsg: "",
    });
  };

  render() {
    const status =
      Object.keys(this.state.fromInputLatLng).length &&
      Object.keys(this.state.toInputLatLng).length;
    const searchOptions = {
      types: ["address"],
    };

    return (
      <div className="row">
        {this.state.error && (
          <AlertPopUp
            show={this.state.error}
            type={"danger"}
            title={this.state.errorMsg}
            confirmBtnBsStyle={"danger"}
            onConfirm={this.resetError}
          />
        )}
        <div className="col-12">
          <div className="row">
            {!this.props.orderId && (
              <div className="col-4">
                <SupportCodeSelection
                  className="w-100 mb-1 h-25"
                  id="support-code"
                  options={this.state.supportCodeData}
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
                  onInputChange={(event: any) => this.getSupportCodeList(event)}
                  onChange={(event: any, value: any, reason: any) =>
                    this.getAutoFillData(event, value, reason)
                  }
                />
              </div>
            )}
            {!this.props.orderId && (
              <div className="col-4 d-flex">
                <TextField
                  type="number"
                  variant="outlined"
                  fullWidth
                  style={{ width: 100 }}
                  error={this.state.searchError}
                  onChange={this.onSearchChange}
                  helperText={this.state.searchErrorMsg}
                />
                <button
                  className="search-icon"
                  onClick={this.addOrderId}
                  style={{ height: "80%" }}
                >
                  <i className="zmdi zmdi-search zmdi-hc-lg" />
                </button>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-3">
              <PlacesAutocomplete
                value={this.state.fromInput}
                onChange={this.fromHandleChange}
                onSelect={this.fromHandleSelect}
                onError={this.OnMapError}
                searchOptions={searchOptions}
              >
                {(e) => this.renderFunc(e, "From Location")}
              </PlacesAutocomplete>
            </div>
            <div className="col-3">
              <PlacesAutocomplete
                value={this.state.toInput}
                onChange={this.toHandleChange}
                onSelect={this.toHandleSelect}
                onError={this.OnMapError}
                searchOptions={searchOptions}
              >
                {(e) => this.renderFunc(e, "To Location")}
              </PlacesAutocomplete>
            </div>
          </div>
        </div>
        <div className="col-12 margin5">
          {Object.keys(this.state.fromInputLatLng).length &&
          Object.keys(this.state.toInputLatLng).length ? (
            <MapWithADirectionsRenderer
              from={this.state.fromInputLatLng}
              to={this.state.toInputLatLng}
              setDistance={this.setDistanceState}
            />
          ) : null}
        </div>
        <div className="col-12">
          {this.state.distance !== "" && (
            <h2>
              <IntlMessages id="partnerOrders.distance" />:{" "}
              {this.state.distance}{" "}
            </h2>
          )}
        </div>
        <div className="mt-2">
          <div>
            <Button
              disabled={this.props.activeStep === 0}
              onClick={this.props.handleBack}
              className="jr-btn"
            >
              <IntlMessages id="appModule.back" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!status}
              onClick={this.saveInformations}
              className="jr-btn"
            >
              {this.props.activeStep === this.props.steps.length - 1 ? (
                <IntlMessages id="appModule.finish" />
              ) : (
                <IntlMessages id="appModule.next" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
     *  save courier location data to reducer
     * @param data
     */
    setOrderCourierLocation: (data: any) =>
      dispatch({ type: SET_NEW_ORDER, payload: data }),
    /**
     *  save support code data to reducer
     * @param data
     */
    setSupportCodeData: (data: any) =>
      dispatch({ type: SET_SUPPORTCODE_DATA, payload: data }),
    /**
     *  save order data to reducer
     * @param data
     */
    setOrderPrefillData: (data: any) =>
      dispatch({ type: SET_ORDER_PREFILL_DATA, payload: data }),
  };
};

const mapStateToProps = (state: any) => {
  return {
    orderState: state.orderState.orderCreate.order,
    departmentState: state.department.selectedDepartment.key,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CouriersStep1);

const isObject = (val: any) => {
  return typeof val === "object" && val !== null;
};

const classnames = (...args: any) => {
  const classes: any = [];
  args.forEach((arg: any) => {
    if (typeof arg === "string") {
      classes.push(arg);
    } else if (isObject(arg)) {
      Object.keys(arg).forEach((key) => {
        if (arg[key]) {
          classes.push(key);
        }
      });
    } else {
      throw new Error(
        "`classnames` only accepts string or object as arguments"
      );
    }
  });

  return classes.join(" ");
};
