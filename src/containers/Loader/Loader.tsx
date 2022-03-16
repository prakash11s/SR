import React from "react";
import CircularProgress from "components/CircularProgress";
import './_loader.scss'

// Loading component
export default function Loader() {
    return (
        <div className="loader-container">
            <div className="loader-logo">
                <CircularProgress className=""/>
            </div>
        </div>
    );
}
