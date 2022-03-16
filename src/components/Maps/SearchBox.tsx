import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import {
    withScriptjs,
} from "react-google-maps";

import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    InputBase
} from '@material-ui/core';
const BootstrapInput = withStyles((theme) => ({
    root: {
        width: "100%",
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '18px 34px 18px 18px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        }
    },
}))(InputBase);

export const SearchBox = compose<any, { callback: (payload: any) => void }>(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API}&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `100%` }} />,
        // containerElement: <div style={{ height: `65vh` }} />,
        // mapElement: <div style={{ height: `100%` }} />
    }),
    lifecycle({
        componentWillMount() {
            const refs: any = { searchBox: {} }
            this.setState({
                places: [],
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();

                    this.setState({
                        places,
                    });
                },
            })
        },
    }),
    withScriptjs
)((props: any) => {
    React.useEffect(() => {
        props.callback({ places: props.places })
    }, [props.places]);
    
    return <div data-standalone-searchbox="">
        <StandaloneSearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            onPlacesChanged={props.onPlacesChanged}
        >
            <BootstrapInput placeholder="Search" type="text" />
        </StandaloneSearchBox>
    </div>
}
);

