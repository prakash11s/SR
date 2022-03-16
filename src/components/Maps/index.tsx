import React, { useEffect, useState } from "react";
import IntlMessages from "../../util/IntlMessages";
import ContainerHeader from "../ContainerHeader";
import { IMapsInterface } from "./Interface/MapsInterface";
import { Card, CardBody } from "reactstrap";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  Circle,
} from "react-google-maps";
import { compose, withProps } from "recompose";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  // TextField,
  Select,
  // Input,
  MenuItem,
  Grid,
  InputLabel,
  FormControl,
  ListItemText,
  Checkbox,
  InputBase,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { getServicePointListAction } from "../../actions/Actions/AssignServicePointAction";
import { useDispatch, useSelector } from "react-redux";
import {
  getServicePointList,
  dispatchSingleCoordinate,
  fetchCategories,
  fetchPoints,
  fetchPrices,
} from "../../actions/Actions/MapActions";
import MarkerWrapper from "./MarkerWrapper";
import { useIntl } from "react-intl";
// import { AnyNsRecord } from "dns";
// import { LensTwoTone } from "@material-ui/icons";
import { SearchBox } from "./SearchBox";
// import MultiSelect from "react-multi-select-component";
import markerImg from "../../assets/images/dashboard/marker.png";

const windowClone: any = window;
const google = windowClone.google;

interface ICompanyMap {
  isSelected: boolean;
  zoom: number;
  setZoom: (value: number) => void;
  setSelectedServicePoint: (servicePoint: any) => void;
  servicePointList: any[];
  selectedServicePoint: any;
  markerIcon: string;
  getSingleCoordinate: (id: string, callback: any) => void;
  setSelectedServicePointId: (id: string) => void;
  selectedServicePointId: string;
  circles: any[any[any]];
}

const RenderMap = (props: ICompanyMap) => {
  // const cityCircle = new google.maps.Circle({
  // 	strokeColor: "#FF0000",
  // 	strokeOpacity: 0.8,
  // 	strokeWeight: 2,
  // 	fillColor: "#FF0000",
  // 	fillOpacity: 0.35,
  // 	map: props.servicePointList,
  // 	radius: Math.sqrt(700) * 100,
  // });
  // 	const input = document.getElementById("pac-input");
  //   		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  // 	 const autocomplete = new google.maps.places.Autocomplete(input);
  //   // Bind the map's bounds (viewport) property to the autocomplete object,
  //   // so that the autocomplete requests use the current map bounds for the
  //   // bounds option in the request.
  //   autocomplete.bindTo("bounds", map);
  let lat =
    (props.circles &&
      props.circles.places[0] &&
      props.circles.places[0].geometry &&
      props.circles.places[0].geometry.location &&
      props.circles.places[0] &&
      props.circles.places[0].geometry &&
      props.circles.places[0].geometry.location.lat()) ||
    51.5763918;
  let lng =
    (props.circles &&
      props.circles.places[0] &&
      props.circles.places[0].geometry &&
      props.circles.places[0].geometry.location &&
      props.circles.places[0] &&
      props.circles.places[0].geometry &&
      props.circles.places[0].geometry.location.lng()) ||
    5.3205685;
  let id =
    props.circles && props.circles.places[0] && props.circles.places[0].id;

  let [showCircle, setShowCircle] = useState<Boolean>(false);
  let [searchedServicePoint, setSearchedServicePoint] = useState<any>();
  let [centerLat, setCenterLat] = useState<any>(lat);
  let [centerLng, setCenterLng] = useState<any>(lng);

  useEffect(() => {
    setCenterLat(
      props.circles &&
        props.circles.places[0] &&
        props.circles.places[0].geometry &&
        props.circles.places[0].geometry.location &&
        props.circles.places[0] &&
        props.circles.places[0].geometry &&
        props.circles.places[0].geometry.location.lat()
    );
    setCenterLng(
      props.circles &&
        props.circles.places[0] &&
        props.circles.places[0].geometry &&
        props.circles.places[0].geometry.location &&
        props.circles.places[0] &&
        props.circles.places[0].geometry &&
        props.circles.places[0].geometry.location.lng()
    );
  }, [props.circles]);

  useEffect(() => {
    setShowCircle(false);
    if (props.circles && props.circles.places[0] && props.circles.places[0]) {
      props.servicePointList.forEach((servicepoint) => {
        if (lat && lng) {
          let googleLatBeforeDot = `${lat}`.split(".")[0];
          let googleLatAfterDot = `${lat}`.split(".")[1];
          let googleLngBeforeDot = `${lng}`.split(".")[0];
          let googleLngAfterDot = `${lng}`.split(".")[1];
          let servicepointLatBeforeDot = `${servicepoint.lat}`.split(".")[0];
          let servicepointLatAfterDot = `${servicepoint.lat}`.split(".")[1];
          let servicepointLngBeforeDot = `${servicepoint.lng}`.split(".")[0];
          let servicepointLngAfterDot = `${servicepoint.lng}`.split(".")[1];

          if (
            googleLatBeforeDot == servicepointLatBeforeDot &&
            googleLatAfterDot.substr(0, 2) ==
              servicepointLatAfterDot.substr(0, 2) &&
            googleLngBeforeDot == servicepointLngBeforeDot &&
            googleLngAfterDot.substr(0, 2) ==
              servicepointLngAfterDot.substr(0, 2)
          ) {
            setSearchedServicePoint(servicepoint);
          }
        }
      });
      if (!searchedServicePoint) {
        setSearchedServicePoint({
          lat,
          lng,
          id,
          has_active_subscription: true,
          department: "couriers",
        });
      }
      setShowCircle(true);
    }
  }, [props.circles]);

  return (
    <GoogleMap
      zoom={props.zoom}
      defaultCenter={new google.maps.LatLng(lat, lng)}
      center={new google.maps.LatLng(centerLat, centerLng)}
    >
      {showCircle &&
        props.circles &&
        props.circles.places &&
        props.circles.places.map((item, i) => {
          return (
            <>
              <MarkerWrapper
                servicePoint={searchedServicePoint}
                google={google}
                setSelectedServicePoint={props.setSelectedServicePoint}
                markerIcon={""}
                getSingleCoordinate={props.getSingleCoordinate}
                setSelectedServicePointId={props.setSelectedServicePointId}
                selectedServicePointId={props.selectedServicePointId}
              />
              <Circle
                key={i}
                center={new google.maps.LatLng(lat, lng)}
                radius={9000}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#FF0000",
                  fillOpacity: 0.35,
                }}
              />
            </>
          );
        })}
      {props.servicePointList.length > 0 &&
        props.servicePointList.map((servicePoint: any, i: number) => {
          if (servicePoint.lat && servicePoint.lng) {
            return (
              <MarkerWrapper
                key={servicePoint["id"]}
                servicePoint={servicePoint}
                google={google}
                setSelectedServicePoint={props.setSelectedServicePoint}
                markerIcon={props.markerIcon}
                setLat={setCenterLat}
                setLng={setCenterLng}
                getSingleCoordinate={props.getSingleCoordinate}
                setSelectedServicePointId={props.setSelectedServicePointId}
                selectedServicePointId={props.selectedServicePointId}
              />
            );
          }
        })}
    </GoogleMap>
  );
};

const MapRenderer = compose<any, ICompanyMap>(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API}&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `65vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props: ICompanyMap) => <RenderMap {...props} />);

const BootstrapInput = withStyles((theme) => ({
  root: {
    width: "100%",
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "18px 34px 18px 18px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
    maxWidth: "100%",
    width: "100%",
  },
}));

const Maps: React.FC<IMapsInterface> = (props) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const classes = useStyles();

  const [servicePoints, setServicePoints] = useState<any>([]);

  const selectedDepartment = useSelector(
    (state: any) => state.department.selectedDepartment
  );

  const [servicePointSearchLoading, setServicePointSearchLoading] = useState<
    boolean
  >(false);
  const [zoom, setZoom] = useState<number>(7);

  const [isServicePointSelected, setIsServicePointSelected] = useState<boolean>(
    false
  );
  const [selectedServicePoint, setSelectedServicePoint] = useState<any>({});
  const [servicePointList, setServicePointList] = useState<any>([]);
  const [selectedServicePointId, setSelectedServicePointId] = useState<string>(
    ""
  );

  // States for service points
  const [points, setPoints] = useState<any[]>([]);
  const [pointsError, setPointsError] = useState<string>("");
  const [fetchingPoints, setFetchingPoints] = useState<Boolean>(false);
  const [selectedPoints, setSelectedPoints] = useState<any[]>([]);

  // State for service categories
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesError, setCategoriesError] = useState<string>("");
  const [statement, setStatement] = useState<string>("and");
  const [fetchingCategories, setFetchingCategories] = useState<Boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  // States for service prices
  const [prices, setPrices] = useState<any[]>([]);
  const [pricesError, setPricesError] = useState<string>("");
  const [fetchingPrices, setFetchingPrices] = useState<Boolean>(false);
  const [selectedPrices, setSelectedPrices] = useState<any[]>([]);

  // Subscription states
  const [selectedSubscription, setSubscription] = useState<string>("All");
  const subscriptions = [
    "All",
    "Has active subscription",
    "No active subscription",
  ];
  const [circles, setCirlces] = useState<any[]>([]);

  const prepareData = () => {
    let type_ids = selectedCategories.sort((a, b) => a - b);
    let recognition_ids = selectedPoints.sort((a, b) => a - b);
    let service_ids = selectedPrices.sort((a, b) => a - b);
    let payload = {
      type_ids,
      recognition_ids,
      service_ids,
      statement,
    };
    if (selectedSubscription !== "All") {
      payload["has_active_subscription"] =
        selectedSubscription === "Has active subscription" ? true : false;
    }
    console.log({ payload }, "payload");
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  };

  useEffect(() => {
    dispatch(
      getServicePointList("", (result: string, response: any) => {
        setServicePointList(result === "success" ? response : []);
      })
    );
    setFetchingCategories(true);
    dispatch(
      fetchCategories((status: string, response: any) => {
        if (status === "success") {
          const filteredCats = response.filter(
            (cat) => cat.department == selectedDepartment.slug
          );
          setCategories(filteredCats);
        } else setCategoriesError(response);
        setFetchingCategories(false);
      })
    );
    setFetchingPoints(true);
    dispatch(
      fetchPoints((status: string, response: any) => {
        if (status === "success") setPoints(response);
        else setPointsError(response);
        setFetchingPoints(false);
      })
    );
    setFetchingPrices(true);
    dispatch(
      fetchPrices((status: string, response: any) => {
        if (status === "success") setPrices(response);
        else setPricesError(response);
        setFetchingPrices(false);
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      getServicePointList(prepareData(), (result: string, response: any) => {
        setServicePointList(result === "success" ? response : []);
      })
    );
  }, [
    selectedCategories,
    selectedPoints,
    selectedPrices,
    selectedSubscription,
    statement,
  ]);

  const getOptions = (event: any) => {
    if (Boolean(event.target.value) && event.target.value.length > 1) {
      setServicePointSearchLoading(true);
      dispatch(
        getServicePointListAction(
          event.target.value,
          (result: string, response: any) => {
            setServicePoints(result === "success" ? response : []);
            setServicePointSearchLoading(false);
          }
        )
      );
    }
  };

  const getSingleCoordinate = (id: string, callback: any) => {
    setSelectedServicePointId(id);
    dispatch(
      dispatchSingleCoordinate(id, (result: string, response: any) => {
        callback(result === "success" ? response : {});
      })
    );
  };

  const getSelectedOption = (event: any, value: any, reason: string) => {
    if (reason === "select-option") {
      setSelectedServicePoint(value);
      setZoom(10);
    }
  };

  useEffect(() => {
    if (selectedServicePoint.id) {
      setIsServicePointSelected(true);
    }
  }, [selectedServicePoint]);

  const onServicePointClick = (servicePoint: any) => {
    setSelectedServicePoint(servicePoint);
    setZoom(10);
  };
  const handlePriceSelection = (event) => {
    let value: any = event.target && event.target.value;
    let arr = selectedPrices;
    let id = value[value.length - 1];
    if (arr.includes(id)) {
      let filterdArr = arr.filter((i) => i !== id);
      arr = filterdArr;
    } else {
      arr.push(id);
    }
    setSelectedPrices([...arr]);
  };

  const handleCategorySelection = (event) => {
    let value: any = event.target && event.target.value;
    let arr = selectedCategories;
    let id = value[value.length - 1];
    if (arr.includes(id)) {
      let filterdArr = arr.filter((i) => i !== id);
      arr = filterdArr;
    } else {
      arr.push(id);
    }
    setSelectedCategories([...arr]);
  };

  const handlePointSelection = (event) => {
    let value: any = event.target && event.target.value;
    let arr = selectedPoints;
    let id = value[value.length - 1];
    if (arr.includes(id)) {
      let filterdArr = arr.filter((i) => i !== id);
      arr = filterdArr;
    } else {
      arr.push(id);
    }
    setSelectedPoints([...arr]);
  };
  const handlePlace = (data: any) => {
    setCirlces(data || []);
    setZoom(10);
  };

  return (
    <div>
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="sidebar.maps" />}
      />
      <Card
        className={`shadow border-0 `}
        id="order-details-table"
        style={{ marginBottom: 50 }}
      >
        <CardBody>
          <Grid container spacing={4} className="mb-2">
            {/* <Grid item xs={3}>
							<Autocomplete
								className="mb-2 h-75"
								id="support-code"
								options={servicePoints}
								getOptionLabel={(option: { name: string, city: string }) => `${option.name} - ${option.city}`}
								style={{ width: '100%', zIndex: 10000 }}
								loading={servicePointSearchLoading}
								renderInput={(params) => <TextField {...params}
									label={<IntlMessages id="orderOptions.search-service-point" />}
									variant="outlined" />}
								onInputChange={(event) => getOptions(event)}
								onChange={(event, value, reason) => getSelectedOption(event, value, reason)}
							/>
						</Grid> */}
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id={"price-checkbox-label"}>
                  {formatMessage({ id: "companies.prices" })}
                </InputLabel>
                <FormControl className="w-100">
                  <Select
                    labelId="price-checkbox-label"
                    id="price-checkbox"
                    multiple
                    value={
                      Array.isArray(prices) &&
                      prices
                        .filter((item) => selectedPrices.includes(item.id))
                        .map((item) => item.name)
                    }
                    onChange={handlePriceSelection}
                    input={<BootstrapInput />}
                    variant="outlined"
                    renderValue={(selected: any) => {
                      return selected.join(", ");
                    }}
                  >
                    {(Array.isArray(prices) &&
                      prices.map(
                        ({ name, id }: { name: string; id: number }) => (
                          <MenuItem key={name} value={id}>
                            <Checkbox
                              color="primary"
                              checked={Boolean(selectedPrices.indexOf(id) > -1)}
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        )
                      )) || (
                      <MenuItem>
                        {fetchingPrices ? "...loading" : pricesError || ""}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id={"category-label"}>
                  {formatMessage({ id: "companies.categories" })}
                </InputLabel>
                <FormControl className="w-100">
                  <Select
                    labelId="category-label"
                    id="category-checkbox"
                    multiple
                    value={
                      (Array.isArray(categories) &&
                        categories
                          .filter((item) =>
                            selectedCategories.includes(item.id)
                          )
                          .map((item) => item.name)) ||
                      []
                    }
                    onChange={handleCategorySelection}
                    input={<BootstrapInput />}
                    renderValue={(selected: any) => selected.join(", ")}
                    // MenuProps={MenuProps}
                  >
                    {(Array.isArray(categories) &&
                      categories.map(
                        ({ name, id }: { name: string; id: number }) => (
                          <MenuItem key={name} value={id}>
                            <Checkbox
                              color="primary"
                              checked={Boolean(
                                selectedCategories.indexOf(id) > -1
                              )}
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        )
                      )) || (
                      <MenuItem>
                        {fetchingCategories
                          ? "...loading"
                          : categoriesError || ""}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id={"points-label"}>
                  {formatMessage({ id: "companies.points" })}
                </InputLabel>
                <FormControl className="w-100">
                  <Select
                    labelId="points-label"
                    id="points-checkbox"
                    multiple
                    value={
                      Array.isArray(points) &&
                      points
                        .filter((item) => selectedPoints.includes(item.id))
                        .map((item) => item.name)
                    }
                    onChange={handlePointSelection}
                    input={<BootstrapInput />}
                    renderValue={(selected: any) => {
                      return selected.join(", ");
                    }}
                  >
                    {(Array.isArray(points) &&
                      points.map(
                        ({ name, id }: { name: string; id: number }) => (
                          <MenuItem key={name} value={id}>
                            <Checkbox
                              color="primary"
                              checked={Boolean(selectedPoints.indexOf(id) > -1)}
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        )
                      )) || (
                      <MenuItem>
                        {fetchingPoints ? "...loading" : pointsError || ""}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                {/* <InputLabel id={formatMessage({ id: 'companies.subscription' })}>{formatMessage({ id: 'companies.subscription' })}</InputLabel> */}
                <FormControl className="w-100">
                  <Select
                    placeholder={formatMessage({
                      id: "companies.subscription",
                    })}
                    labelId="subscription-label"
                    id="subscription"
                    value={selectedSubscription}
                    onChange={(e: any) => setSubscription(e.target.value)}
                    input={<BootstrapInput />}
                    variant="outlined"
                  >
                    {subscriptions.map((name: string) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <SearchBox
                callback={(data: any) => {
                  handlePlace(data);
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                {/* <InputLabel id={formatMessage({ id: 'companies.subscription' })}>{formatMessage({ id: 'companies.subscription' })}</InputLabel> */}
                <FormControl className="w-100">
                  <Select
                    placeholder={formatMessage({
                      id: "companies.statement",
                    })}
                    labelId="subscription-label"
                    id="subscription"
                    value={statement}
                    onChange={(e: any) => setStatement(e.target.value)}
                    input={<BootstrapInput />}
                    variant="outlined"
                  >
                    <MenuItem key="1" value="or">
                      OR
                    </MenuItem>
                    <MenuItem key="2" value="and">
                      AND
                    </MenuItem>
                  </Select>
                </FormControl>
              </FormControl>
            </Grid>
          </Grid>
          <MapRenderer
            isSelected={isServicePointSelected}
            zoom={zoom}
            circles={circles}
            setZoom={setZoom}
            servicePointList={servicePointList}
            selectedServicePoint={selectedServicePoint}
            setSelectedServicePoint={onServicePointClick}
            getSingleCoordinate={getSingleCoordinate}
            selectedServicePointId={selectedServicePointId}
            setSelectedServicePointId={setSelectedServicePointId}
            markerIcon={markerImg}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Maps;
