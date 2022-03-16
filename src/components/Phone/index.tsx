import React from "react";
import CallHistory2 from "./CallHistory2";
import ActivePhoneCall from "./ActivePhoneCall";
import { connect } from 'react-redux'

const PhoneComponent = (props:any) => {

    // currently mocked
    const showHistory = true;
    const { hasActivePhoneCall } = props.softPhone;
    const hasPhoneActivated = true;

    return (
        <div className="digital-phone position-absolute d-flex">
            {showHistory &&
            <CallHistory2/>
            }

            {hasActivePhoneCall &&
            <ActivePhoneCall/>
            }

            {hasPhoneActivated &&
            <div className="bottom-bar position-absolute pt-2 pb-2">
                <div className="container">
                    <div className="row">
                        <div className="call col-6 col-lg-3 d-flex align-items-center justify-content-start">
                            <img src="http://placekitten.com/200/200" alt="person" className="mr-3" />

                            <div className="info">
                                <p className="mb-1 font-weight-bold">Beneat Willam</p>
                                <p className="m-0">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="status col-6 col-lg-2 d-flex align-items-center">
                            <p className="mb-0 mr-2 font-weight-bold">Calling</p>
                            <p className="mb-0">00:59</p>

                            <div className="strength d-flex align-items-end justify-content-start">
                                <div className="bar active"></div>
                                <div className="bar active"></div>
                                <div className="bar active"></div>
                                <div className="bar"></div>
                            </div>
                        </div>

                        <div className="controls col-10 col-lg-6 d-flex align-items-center mt-3 mt-lg-0">
                            <div className="row">
                                <div className="general-controls d-flex col-6 col-lg-3">
                                    <div className="btn-round d-flex align-items-center justify-content-center mr-4">
                                        <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24"
                                             aria-hidden="true" role="presentation">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                        </svg>
                                    </div>

                                    <div
                                        className="btn-round btn-danger d-flex align-items-center justify-content-center">
                                        <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24"
                                             aria-hidden="true" role="presentation">
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                            <path
                                                d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div
                                    className="call-controls d-flex align-items-center justify-content-start col-6 col-lg-9">
                                    <div className="btn-round d-flex align-items-center justify-content-center mr-4">
                                        <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24"
                                             aria-hidden="true" role="presentation">
                                            <path
                                                d="M7 24h2v-2H7v2zm5-11c1.66 0 2.99-1.34 2.99-3L15 4c0-1.66-1.34-3-3-3S9 2.34 9 4v6c0 1.66 1.34 3 3 3zm-1 11h2v-2h-2v2zm4 0h2v-2h-2v2zm4-14h-1.7c0 3-2.54 5.1-5.3 5.1S6.7 13 6.7 10H5c0 3.41 2.72 6.23 6 6.72V20h2v-3.28c3.28-.49 6-3.31 6-6.72z"></path>
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                        </svg>
                                    </div>

                                    <div className="volume position-relative">
                                        <div
                                            className="btn-round d-flex align-items-center justify-content-center mr-4 active">
                                            <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24"
                                                 aria-hidden="true" role="presentation">
                                                <path
                                                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                                                <path fill="none" d="M0 0h24v24H0z"></path>
                                            </svg>
                                        </div>

                                        <div className="volume-control position-absolute progress">
                                            <div className="progress-bar" role="progressbar" style={{ width: 80 + '%'}}
                                                 aria-valuenow={`75` as any} aria-valuemin={`0` as any} aria-valuemax={`100` as any}> </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="col-2 col-lg-1 maximize d-flex align-items-center justify-content-end mt-3 mt-lg-0">
                            <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"
                                 role="presentation">
                                <path
                                    d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"></path>
                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
};


const mapStateToProps = ({ softPhone }:any) => ({
    softPhone
})

export default connect(mapStateToProps, null )(PhoneComponent);
