import {
    Invitation,
    Inviter,
    Referral,
    Registerer,
    RegistererOptions,
    SessionState,
    UserAgent,
    UserAgentOptions, Web,
} from "sip.js";
import {
    callDisconnect,
    onCallStart,
    onIncomingCallReceive,
    muteToggle,
    callInviteError,
    onCallConnected,
    holdAction,
    setCallerName,
    dialNumber,
    setAvatar
} from "../../actions/Actions/SoftPhoneActions";
import {store} from "../../store";
import {ISoftphoneAgent} from "../../reducers/Interface/SoftphoneReducerInterface";
// import {
//     goToNextCallInQueue
// } from "../../actions/Actions/callQueueListActionsNew";

let userAgent;
let inviter;
let registerer;
let outgoingSession: any;
let transferSession: any;
let incomingSession: any;
let audio;

let mediaElement;
let remoteStream;

const callRing = new Audio(require(`../../assets/rings/CallRing.mp3`))

const extraHeaders = [ 'X-Foo: foo', 'X-Bar: bar' ];

const dtmfOptions = {
    'duration': 160,
    'interToneGap': 1200,
    'extraHeaders': extraHeaders
};

class SipCallService {

    constructor() {
        audio = new Audio(require(`../../assets/rings/firestone.mp3`))
        audio.volume = 0.6
        callRing.loop = true
        callRing.volume = 0.6
    }
     
    setupSip = (user: ISoftphoneAgent, name: string) => {
        console.log('user----->', user);
        
        const userAgentOptions: UserAgentOptions = {
            uri: UserAgent.makeURI(`sip:${user.extension}@${process.env.REACT_APP_VOIP_ENDPOINT}`),
            transportOptions: {
                server: `wss://${process.env.REACT_APP_VOIP_ENDPOINT}:${process.env.REACT_APP_VOIP_ENDPOINT_PORT}/ws`,
                maxReconnectionAttempts: 5
            },
            authorizationPassword: user.password,
            authorizationUsername: user.extension.toString(),
            sessionDescriptionHandlerFactoryOptions: {
                constraints:{
                    audio: true,
                    video: false
                },
            },
            displayName: name,
            noAnswerTimeout: 30,
            logBuiltinEnabled: process.env.NODE_ENV === 'development'
        };
        userAgent = new UserAgent(userAgentOptions);

        const registererOptions: RegistererOptions = {
            expires: 86400 // 24 hours
        };
        registerer = new Registerer(userAgent, registererOptions);

        userAgent.start().then(() => {
            registerer.register().then(() => {
                /*
                * Setup handling for incoming INVITE requests
                */
                userAgent.delegate = {
                    onInvite(invitation: Invitation): void {

                        // if(outgoingSession.state === 'Established' || outgoingSession.state === 'Establishing') {
                        //     invitation.reject();
                        // }
                        // invitation.accept().then(() => store.dispatch(onCallStart()));
                        audio.play()

                        //receive call
                        store.dispatch(onIncomingCallReceive(invitation.remoteIdentity.displayName));

                        // An Invitation is a Session
                        incomingSession = invitation;

                        // Setup incoming session delegate
                        incomingSession.delegate = {
                            // Handle incoming REFER request.
                            onRefer(referral: Referral): void {
                                referral.accept().then(() => {
                                    // referral.makeInviter().invite();
                                });
                            },
                        };

                        // Handle incoming session state changes.
                        incomingSession.stateChange.addListener((newState: SessionState) => {
                            switch (newState) {
                                case SessionState.Establishing:
                                    console.log("INCOMING CALL START ============================================>")
                                    store.dispatch(onCallStart('in'))
                                    break;
                                case SessionState.Established:
                                    console.log("INCOMING CALL STARTED ===========================================>")
                                    mediaElement = new Audio();;
                                    remoteStream = new MediaStream();
                                    incomingSession.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
                                        if (receiver.track) {
                                          remoteStream.addTrack(receiver.track);
                                        }
                                      });
                                      mediaElement.srcObject = remoteStream;
                                      mediaElement.play();
                                    audio.pause()
                                    store.dispatch(onCallConnected())
                                    break;
                                case SessionState.Terminated:
                                    console.log("INCOMING CALL END ===========================================>")
                                    audio.pause()
                                    store.dispatch(callDisconnect())
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                };
            })
        });
    }

    startCall = (number: any, name?: string, avatar?: string) => {
        if (userAgent) {
            userAgent.start().then(() => {
                const target = UserAgent.makeURI(`sip:${number}@${process.env.REACT_APP_VOIP_ENDPOINT}`);
                if (!target) {
                    store.dispatch(callInviteError("Failed to create target URI"))
                    store.dispatch(callDisconnect())
                    // throw new Error("Failed to create target URI.");
                } else {
                    inviter = new Inviter(userAgent, target, {
                        sessionDescriptionHandlerOptions: {
                            constraints: {audio: true, video: false}
                        }
                    });

                    // Send the INVITE request
                    inviter.invite()
                      .then(() => {
                          {name &&
                          store.dispatch(setCallerName(name));
                              store.dispatch(dialNumber(number));
                          }
                          {avatar && store.dispatch(setAvatar(avatar));}
                          console.log("CALL INVITE SENT =====> ")
                      })
                      .catch((error: Error) => {
                          console.log(`CALL INVITE ERROR ====> ${number}`, error)
                          store.dispatch(callInviteError(error.message))
                      });


                    // An Inviter is a Session
                    outgoingSession = inviter;

                    // Setup outgoing session delegate
                    outgoingSession.delegate = {
                        // Handle incoming REFER request.
                        onRefer(referral: Referral): void {
                            console.log(referral)
                        }
                    };

                    // Handle outgoing session state changes.
                    outgoingSession.stateChange.addListener((newState: SessionState) => {
                        switch (newState) {
                            case SessionState.Establishing:
                                callRing.play();
                                store.dispatch(onCallStart('out'))
                                console.log("CALL INIT ===========================================>");
                                break;
                            case SessionState.Established:
                                mediaElement = new Audio();;
                                remoteStream = new MediaStream();
                                outgoingSession.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
                                    if (receiver.track) {
                                        remoteStream.addTrack(receiver.track);
                                    }
                                });
                                mediaElement.srcObject = remoteStream;
                                mediaElement.play();
                                callRing.pause();
                                store.dispatch(onCallConnected())
                                console.log("CALL STARTED ===========================================>");
                                break;
                            case SessionState.Terminated:
                                callRing.pause();
                                store.dispatch(callDisconnect())
                                // store.dispatch(goToNextCallInQueue());
                                console.log("CALL END ===========================================>");
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
        }
    }

    startTransfer = (number: any, name?: string, avatar?: string) => {
        // check which of them is active
        const currentSession = outgoingSession || incomingSession;

        // OUTGOING SESSION blind-transfer
        if(currentSession) {
            const options = {
                extraHeaders: [
                    'X-Referred-By: ' + currentSession.localIdentity.displayName,
                    'X-Referred-From: ' +  currentSession.remoteIdentity.uri.user
                ]
            };

            // @ts-ignore
            const transferTarget = UserAgent.makeURI(`sip:${number}@${process.env.REACT_APP_VOIP_ENDPOINT}`);
            if (!transferTarget) {
                store.dispatch(callInviteError("Failed to create target URI"))
                store.dispatch(callDisconnect())
                return
            }

            // leave this variable here
            const blindTransfer = true

            // @ts-ignore
            currentSession.refer(transferTarget, {
                // Example of extra headers in REFER request
                requestOptions: options,
                requestDelegate: {
                    onAccept(): void {
                        // disconnect the call here and close the popup
                        // only disconnecting the call works now but the call pad remains open
                        store.dispatch(callDisconnect())
                    }
                }
            });
        }
    }

    endCall = (type: string) => {
        const tempSession: any = type === "out" ? outgoingSession : incomingSession;
        console.log(tempSession)
        if (tempSession.state === 'Established') {
            tempSession.bye();
        } else if ( tempSession.state !== 'Established') {
            tempSession.cancel();
        }
        store.dispatch(callDisconnect())
    }

    rejectCall = () => {
        if (registerer.state === 'Registered' && incomingSession) {
            incomingSession.reject()
        }
    }

    receiveCall = () => {
        if (registerer.state === 'Registered' && incomingSession) {
            audio.pause()
            incomingSession.accept();
        }
    }

    sendDigit = (digit: string, callWay: string) => {
        console.log(digit)
        console.log(callWay)
        // if (callWay === 'out') {
        //     outgoingSession.sessionDescriptionHandler.sendDtmf(digit, dtmfOptions);
        // }
        const tempSession = callWay === "out" ? outgoingSession : incomingSession;
        tempSession.sessionDescriptionHandler.sendDtmf(digit, dtmfOptions);
    }

    holdCall = (type: string, status: boolean) => {
        console.log("HOLD TOGGLE =============================================================>", status)
        const tempSession = type === "out" ? outgoingSession : incomingSession;
        if (tempSession.state === 'Established') {
            if (status) {
                tempSession.invite({ sessionDescriptionHandlerModifiers: [Web.holdModifier]})
            } else {
                tempSession.invite({ sessionDescriptionHandlerModifiers: []})
            }
            store.dispatch(holdAction(status))
        }
    }

    muteToggle = (type: string, muted: boolean) => {
        console.log("MUTE TOGGLE =============================================================>")

        const tempSession = type === "out" ? outgoingSession : incomingSession;
        const pc = tempSession.sessionDescriptionHandler.peerConnection

        // this triggers the mute and it works fine now make sure it mutes/unmutes
        pc.getSenders().forEach(function (stream: any) {
            if (stream.track && stream.track.kind === 'audio') {
              stream.track.enabled = muted
                store.dispatch(muteToggle())
            }
        })
    }

}

export default new SipCallService();
