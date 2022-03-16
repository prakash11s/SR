
import React from "react";
import { useSelector } from 'react-redux';
import SipCallService from "./SipCallService";
import axios from '../../../src/util/Api';
import { Link } from "react-router-dom";


const IncomingPhoneCall: React.FC<any> = (props) => {

    const callQueueStatus: boolean = useSelector((state: any) => state.callQueueState.callQueueStatus);
    const noActionTaken: boolean = useSelector((state: any) => {
        const dataList = state.callQueueState.callQueueListData.data.filter((data: any) => data.noActionTaken);
        return state.callQueueState.callQueueListData.data.length && dataList.length === state.callQueueState.callQueueListData.data.length;
    });
    const callState = useSelector((state: any) => state.softPhone.Call);
    const callPhoneNumber = useSelector((state: any) => state.softPhone.phoneNumber);

    const endCall = () => {
        SipCallService.rejectCall();
    }

    const receiveCall = () => {
        SipCallService.receiveCall()
    }

    const [userInfo, setUserInfo] = React.useState<any>(undefined);

    const fetchInboundUserDetails = (phone: any) => {
        axios.get(`/customers/searchphone?phone=${phone}`)
                .then(response => {
                    setUserInfo(response);
                })
                .catch(error => {
                    console.log(error.response);
                });
    };

    React.useEffect(() => {
        if(callPhoneNumber) {
            fetchInboundUserDetails(callPhoneNumber);
        }
    }, [callPhoneNumber])

    return (
        <div
            className="phone d-flex flex-column justify-content-between align-items-center"
            data-cy="active-phone-call"
        >
            <div className="status position-relative p-4 m-3">
                <h1 className="m-0 font-weight-bold text-center" />
            </div>

            <div className="current-call d-flex flex-column text-center">
                <div className="info">
                    {/* <div className="mb-3 customer-icon">A</div> */}
                    {userInfo?.avatar ? (
                        <span className="call-avatar" style={{ backgroundImage: `url(${userInfo?.avatar})` }}>
                          {userInfo &&  <Link to={`/support/customers/${userInfo?.id}`} > <button className="user-detail-btn" title="see info" /></Link> }
                        </span>
                    ) : (
                        <span className="call-avatar" style={{ backgroundImage: `url(${require("assets/images/Profile_avatar_placeholder_large.png")})` }}> 
                       {userInfo && <Link to={`/support/customers/${userInfo?.id}`} > <button className="user-detail-btn" title="see info" /></Link>  } </span>
                    )}
                    
                    
                    {userInfo && <h4><b>{`${userInfo.first_name} ${userInfo.last_name}`}</b></h4>}
                    
                    {/* <p>{callState.callerName}</p>
                    <p>{callState.callerName}</p> */}
                </div>
            </div>
            <div className="controls mb-4">
                <div className="general-controls">
                    <div
                        className="buttons d-flex align-items-center justify-content-center"
                    >
                        <button className="btn btn-danger p-3" onClick={endCall}>
                            <svg
                                className="MuiSvgIcon-root"
                                focusable="false"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                role="presentation"
                            >
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                    d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"></path>
                            </svg>
                        </button>
                        <button className="btn btn-success p-3" onClick={receiveCall}>
                            <svg
                                className="MuiSvgIcon-root"
                                focusable="false"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                role="presentation"
                            >
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path transform="scale(1, -1) translate(0, -25)"
                                    d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"></path>
                            </svg>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomingPhoneCall;
