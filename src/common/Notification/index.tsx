import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { setNotificationHide, setSnackbarShow } from '../../actions/Actions/NotificationActions';

import { createStructuredSelector } from 'reselect';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { Button } from 'reactstrap';
import { selectCallQueueId } from '../../selectors/callQueueListSelectors';
import './notification.scss';
import { INotificationComponentProps } from './Interface/IndexInterface';

class NotificationComponent extends React.Component<INotificationComponentProps> {

    handleChange = () => {
        this.props.setNotificationHide();
    }

    handleRequestClose = () => {
        this.props.setSnackbarShow();
    }

    render() {
        const { show, message, url } = this.props;
        const action = (
            <Link to={url} className="button-alignment" >
                <Button variant="contained" color="secondary" size="small" onClick={this.handleChange} >
                    Go!
                </Button>
            </Link>
        );
        return (
            <div className="snackbar">
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={show}
                ><SnackbarContent
                        message={message}
                        action={[action,
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                onClick={this.handleRequestClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        ]}
                    />

                </Snackbar>
                );
        </div>

        )
    }
}
const mapDispatchToProps = (dispatch:any) => {
    return {
        setNotificationHide: () => dispatch(setNotificationHide()),
        setSnackbarShow: () => dispatch(setSnackbarShow()),
    }
};

const mapStateToProps = createStructuredSelector(
    {
        id: selectCallQueueId,
    });

export default connect(mapStateToProps, mapDispatchToProps)(NotificationComponent);

