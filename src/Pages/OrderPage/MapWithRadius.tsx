import React, {Fragment} from "react";
import { Circle, GoogleMap, KmlLayer, Marker, withGoogleMap } from "react-google-maps";

const MapsWithRadius = (props:any) => {

  return  <GoogleMap
      center={{ lat: 40.64, lng: -73.96 }}
      zoom={12}
    >
        <KmlLayer
            url="http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml"
            options={{preserveViewport: true}}
        />
        {props.places.map((place:any) => {
            return (
                <Fragment key={place.id}>
                    <Marker
                        position={{
                            lat: parseFloat(place.latitude),
                            lng: parseFloat(place.longitude)
                        }}
                    />
                    {place.circle && <Circle
                        defaultCenter={{
                            lat: parseFloat(place.latitude),
                            lng: parseFloat(place.longitude)
                        }}
                        radius={place.circle.radius}
                        options={place.circle.options}
                        editable
                    />}
                </Fragment>
            );
        })}
    </GoogleMap>
};

export default withGoogleMap(MapsWithRadius)
