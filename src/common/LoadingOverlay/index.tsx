import * as React from 'react';
import {
	CircularProgress
} from '@material-ui/core';
import './loadingOverlay.scss';

const LoadingOverlay = (props:any): JSX.Element => {
    return (
        <div className="loading-overlay" >
            <CircularProgress size={20} />
        </div>)
}

export default LoadingOverlay;
