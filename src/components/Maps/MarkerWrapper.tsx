import React, { useState, FC } from "react";
import { IntlProvider } from "react-intl";
import { MarkerInterface } from "./Interface/MapsInterface";
import { Marker } from "react-google-maps";
import OkGrey from "../../assets/images/widget/ok_grey.gif";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import AppLocale from "../../lngProvider/index";
import Loader from "../../containers/Loader/Loader";
import IntlMessages from "../../util/IntlMessages";
import "./styles/markerWrapper.css";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { useDispatch, useSelector } from "react-redux";
import SipCallService from "../Phone/SipCallService";
import { updatePartnerDetails } from "actions/Actions/PartnerSettingActions";
import UserHasPermission from "../../util/Permission";

const MarkerWrapper: FC<MarkerInterface> = (props) => {
  const dispatch = useDispatch();
  const [singleCoordinate, setSingleCoordinate] = useState<any>({});
  const [descriptionField, setDescriptionField] = useState<string>();
  const [loadingState, setLoadingState] = useState<number>(0);
  const {
    servicePoint,
    setSelectedServicePoint,
    google,
    markerIcon,
    getSingleCoordinate,
    selectedServicePointId,
    setLat,
    setLng,
    setSelectedServicePointId,
  } = props;

  const department = useSelector(
    (state: any) => state.department.selectedDepartment
  );

  const locale = useSelector((state: any) => state.settings.locale);

  const onClickSave = () => {
    if (singleCoordinate.id) {
      setLoadingState(1);
      dispatch(
        updatePartnerDetails(
          singleCoordinate.id,
          {
            ...singleCoordinate,
            note: descriptionField,
          },
          false,
          (res) => {
            setLoadingState(2);
          }
        )
      );
    }
  };
  const currentAppLocale = AppLocale[locale.locale];

  return (
    <Marker
      position={{ lat: servicePoint.lat, lng: servicePoint.lng }}
      title={servicePoint.department}
      animation={google["maps"]["Animation"].DROP}
      icon={
        servicePoint.has_active_subscription === true
          ? markerIcon && markerIcon
          : OkGrey
      }
      onClick={() => {
        setSelectedServicePoint(servicePoint);
        setLoadingState(0);
        getSingleCoordinate(servicePoint.id, (res) => {
          if (res) {
            setSingleCoordinate(res);
            setDescriptionField(res["note"] || "");
            // if (res.geolocation && setLat && setLng) {
            //   setLat(res.geolocation.lat);
            //   setLng(res.geolocation.lng);
            // }
          }
        });
      }}
    >
      {selectedServicePointId == servicePoint.id && (
        <InfoBox
          onCloseClick={() => {
            setSelectedServicePointId("");
            setLoadingState(0);
          }}
          options={{ closeBoxURL: ``, enableEventPropagation: true }}
          visible={true}
          position={
            new google["maps"].LatLng(servicePoint["lat"], servicePoint["lng"])
          }
        >
          <>
            {loadingState === 2 && (
              <Card style={{ maxWidth: 345, zIndex: 10000 }}>
                <IntlProvider
                  locale={locale.locale}
                  messages={currentAppLocale.messages}
                >
                  {singleCoordinate["name"] !== null && (
                    <CardHeader
                      action={
                        <IconButton
                          color="primary"
                          aria-label="add to shopping cart"
                          onClick={() => {
                            setSelectedServicePointId("");
                            setLoadingState(0);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      }
                      title={singleCoordinate["name"]}
                    />
                  )}
                  <div className="d-flex align-items-center flex-column">
                    <h3>
                      <IntlMessages id="marker.noteSaved" />.
                    </h3>
                    <Button
                      className="save-notes-btn"
                      onClick={() => {
                        setSelectedServicePointId("");
                        setLoadingState(0);
                      }}
                      variant="outlined"
                    >
                      <IntlMessages id="marker.close" />
                    </Button>
                  </div>
                </IntlProvider>
              </Card>
            )}
            {loadingState === 1 && (
              <Card style={{ maxWidth: 345, zIndex: 10000 }}>
                <div className="d-flex justify-content-center">
                  <CircularProgress className="infinite-loader" />
                </div>
              </Card>
            )}
            {loadingState === 0 && (
              <Card style={{ maxWidth: 345, zIndex: 10000 }}>
                {singleCoordinate["name"] !== null && (
                  <CardHeader
                    action={
                      <IconButton
                        color="primary"
                        aria-label="add to shopping cart"
                        onClick={() => setSelectedServicePointId("")}
                      >
                        <ClearIcon />
                      </IconButton>
                    }
                    title={singleCoordinate["name"]}
                  />
                )}
                {singleCoordinate["avatar"] !== null && (
                  <CardMedia
                    style={{
                      height: 140,
                    }}
                    image={singleCoordinate["avatar"]}
                    title={"servicePointDetail.name"}
                  />
                )}
                <CardContent>
                  <IntlProvider
                    locale={locale.locale}
                    messages={currentAppLocale.messages}
                  >
                    {singleCoordinate["name"] ? (
                      <div>
                        {singleCoordinate["city"] && (
                          <h4>
                            <IntlMessages id="companiesTable.city" />:{" "}
                            {singleCoordinate["city"]}
                          </h4>
                        )}
                        {singleCoordinate["zip_code"] && (
                          <h4>
                            <IntlMessages id="partnerSettings.zipcode" />:{" "}
                            {singleCoordinate["zip_code"]}
                          </h4>
                        )}
                        {singleCoordinate["phone"] && (
                          <h4
                            onClick={() =>
                              SipCallService.startCall(
                                singleCoordinate["phone"],
                                singleCoordinate["name"]
                              )
                            }
                          >
                            <IntlMessages id="marker.phone1" />:{" "}
                            {singleCoordinate["phone"]}
                          </h4>
                        )}
                        {singleCoordinate["phone_2"] && (
                          <h4
                            onClick={() =>
                              SipCallService.startCall(
                                singleCoordinate["phone_2"],
                                singleCoordinate["name"]
                              )
                            }
                          >
                            <IntlMessages id="marker.phone2" />:{" "}
                            {singleCoordinate["phone_2"]}
                          </h4>
                        )}
                        {singleCoordinate["recognitions"] && (
                          <div style={{ display: "flex" }}>
                            <h4>
                              <IntlMessages id="marker.recognitions" />:{" "}
                            </h4>
                            <div style={{ paddingLeft: 10, display: "flex" }}>
                              {singleCoordinate["recognitions"].map(
                                (recognition: any) => {
                                  return (
                                    <Avatar
                                      alt={recognition.name}
                                      src={
                                        recognition.image
                                          ? recognition.image
                                          : department &&
                                            department.image &&
                                            department.image.small
                                          ? department.image.small
                                          : ""
                                      }
                                      className="user-avatar"
                                    />
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                        <UserHasPermission permission="update-servicepoint-sales-notes">
                          <div>
                            <div className="marker-notes-wrap">
                              <h4>
                                <IntlMessages id="invoices.table.notes" />:{" "}
                              </h4>
                              <div className="marker-notes">
                                <textarea
                                  value={descriptionField}
                                  onChange={(e) =>
                                    setDescriptionField(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <Button
                              className="save-notes-btn"
                              onClick={onClickSave}
                              variant="outlined"
                            >
                              <IntlMessages id="callQueueListEdit.save" />
                            </Button>
                          </div>
                        </UserHasPermission>
                      </div>
                    ) : (
                      <div className="infoBoxLoader">
                        <Loader />
                      </div>
                    )}
                  </IntlProvider>
                </CardContent>
              </Card>
            )}
          </>
        </InfoBox>
      )}
    </Marker>
  );
};
export default MarkerWrapper;
