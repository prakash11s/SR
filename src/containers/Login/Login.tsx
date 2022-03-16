import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import {
    NotificationContainer,
    NotificationManager
} from "react-notifications";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
class SignIn extends React.Component <any,any>{
    constructor(props:any) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }
    componentDidUpdate() {
        if (this.props.showMessage) {
            setTimeout(() => {
                this.props.hideMessage();
            }, 100);
        }
        if (this.props.authUser !== null) {
            this.props.history.push("/");
        }
    }
    render() {
        const { showMessage, loader, alertMessage } = this.props;
        return (
            <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
                <div className="app-login-main-content">
                    <div className="app-logo-content d-flex align-items-center justify-content-center">
                        <Link className="logo-lg" to="/" title="Jambo">
                            <img
                                src={require("assets/images/serviceRight.png")}
                                style={{ width: "100%" }}
                                alt="jambo"
                                title="jambo"
                            />
                        </Link>
                    </div>
                    <div className="app-login-content">
                        <div className="app-login-header mb-4">
                            <h1>
                              <IntlMessages id="loginpage.loginTitle" />
                            </h1>
                        </div>
                        <div className="app-login-form">
                            <form>
                                <fieldset>
                                    <div style={{ maxWidth: "220px", margin: "0 auto" }} >
                                        <div className="mb-4 text-center">
                                            <a href="javascript:;"
                                                // passing the click to the parrent component
                                                onClick={this.props.onServiceRightClick}
                                            >
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    className="btn-block"
                                                >
                                                    <IntlMessages id="loginpage.servicerightLogin" />
                                                </Button>
                                            </a>
                                        </div>
                                        {/*<div className="mb-4 text-center">*/}
                                        {/*    <a>*/}
                                        {/*        <Button*/}
                                        {/*            color="primary"*/}
                                        {/*            variant="contained"*/}
                                        {/*            className="btn-block facebook"*/}
                                        {/*            onClick={() => this.props.onServiceRightClick('facebook')}*/}
                                        {/*        >*/}
                                        {/*            <IntlMessages id="loginpage.facebookLogin" />*/}
                                        {/*        </Button>*/}
                                        {/*    </a>*/}
                                        {/*</div>*/}
                                        {/*<div className="mb-4 text-center">*/}
                                        {/*    <a>*/}
                                        {/*        <Button*/}
                                        {/*            color="primary"*/}
                                        {/*            variant="contained"*/}
                                        {/*            className="btn-block linkedin"*/}
                                        {/*            onClick={() => this.props.onServiceRightClick('linkedin')}*/}
                                        {/*        >*/}
                                        {/*            <IntlMessages id="loginpage.linkedinLogin" />*/}
                                        {/*        </Button>*/}
                                        {/*    </a>*/}
                                        {/*</div>*/}
                                        {/*<a className="d-block text-center" href="https://signin.serviceright.nl/auth/register">*/}
                                        {/*    <IntlMessages id="loginpage.createAnAccount"/>*/}
                                        {/*</a>*/}
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
                {loader && (
                    <div className="loader-view">
                        <CircularProgress />
                    </div>
                )}
                {showMessage && NotificationManager.error(alertMessage)}
                <NotificationContainer />
            </div>
        );
    }
}
export default SignIn;
