import React, { useEffect, useState } from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import { useDispatch, useSelector } from "react-redux";
import "react-phone-input-2/lib/style.css";
import {
  dialNumber,
  forwardCallAction,
  getPhoneAgents,
  onForwardPadToggle,
  callTransfer,
  setShowCallListeningPopup,
} from "actions/Actions/SoftPhoneActions";
import { Input } from "reactstrap";
import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";
import ClearIcon from "@material-ui/icons/Clear";
import "./Style/forwardCall.css";
import CustomScrollbars from "../../util/CustomScrollbars";
import SipCallService from "./SipCallService";
import { selectHasActiveUser } from "../../selectors/softPhone.selectors"
import { store } from "store";

const ForwardCallPad: React.FC<any> = (props) => {
  const dispatch = useDispatch();

  const data = useSelector((state: any) => state.softPhone.agentNumbers);
  const { hasActiveUser } = props;

  const [searchText, setSearchText] = useState<string>("");
  const [displayList, setDisplayList] = useState<any>(data);

  const closeForwardPad = () => {
    dispatch(onForwardPadToggle());
  };

  const onForwardCall = (id: number) => {
    dispatch(forwardCallAction(id));
  };

  useEffect(() => {
    console.log("forward agent numbers", data);
    if (searchText) {
      setDisplayList(
        displayList.filter((data: any) =>
          data.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setDisplayList(data);
    }
  }, [searchText, data]);

  useEffect(() => {
    dispatch(getPhoneAgents());
  }, []);

  // https://www.voip-info.org/asterisk-manager-api-action-extensionstate/?__cf_chl_jschl_tk__=35f14f10ce2a8dd906ebd6a8f6d4f3b75e85adbc-1621353582-0-AbY-6ytEgkzOfUQfqKLYlg1JLciI6hqYQ_A591llU_RYzJtnZtkhp-gV-O-7mWuUgLnslSojNkVrx-SRbjWQ3oDBzIhDE-m9vwOMbFceNtVr1b39JqxHn7gTiMBfK4wPKmnxozr4xHG3GV8frbQdUJ5DCKlwkGE-UsqxuLhTPDqJSIp2hdQUENnhPFpmZN4UVMmj8G6vZe2PVrmI6CH_esLBJaW-R1vkwYHT4MID3AGafFSWk5MOckLkqKapjVrUfvbfacEbnXKUPW4OGKkzP989vCHjpXz1wX-R1s1MMzVsJLjgfdKKMa0z9MfAy4kSdS4rOotsNmvQx6G3gLZU-jXtSaXUD1T9S7dKJRSjMfJjUi5e2rTKBdOPb0z4hgoIq7Mr-K5-QV7M2kwfT86Ew6RWoxjuzg_1BKLDwWXP3w9WMJpzlwpE4fDktGNbypd2VAAe_gqdzNkSJextB2-B3IPiTMlkQRBCLLjKOps6JuhOb3Pz_2XLUZrd1i51IQHj8OWskLOSiOdPboIzyZS_rSI
  // Possible Status codes from above doc:
  // -1 = Extension not found
  // 0 = Idle
  // 1 = In Use
  // 2 = Busy
  // 4 = Unavailable
  // 8 = Ringing
  // 16 = On Hold
  return (
    <div>
      <div className="phone d-flex flex-column justify-content-between">
        <List
          className="pinned-list"
          style={{
            height: "500px",
          }}
          subheader={
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={3}
              style={{
                backgroundColor: "#3aa4e2",
                marginTop: 0,
              }}
            >
              <Grid item sm={7}>
                <Input
                  type="text"
                  placeholder="Filter colleagues"
                  value={searchText}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchText(event.target.value as string)
                  }
                  className={"searchInput"}
                />
              </Grid>
              <Grid item sm={2}>
                <div className={"callButtonContainer"}>
                  <CallIcon fontSize={"default"} />
                </div>
              </Grid>
              <Grid item sm={2}>
                <div
                  className={"cancelButtonContainer"}
                  onClick={closeForwardPad}
                >
                  <ClearIcon fontSize={"default"} />
                </div>
              </Grid>
            </Grid>
          }
        >
          <CustomScrollbars
            className="scrollbar"
            style={{ height: "80%", marginTop: 15 }}
          >
            {Boolean(displayList.length) &&
              displayList
                .sort((a, b) => a.status_id - b.status_id)
                .map((data: any) => {
                  let color: string;
                  switch (data.status_id) {
                    case 0:
                    case 8:
                      color = "green";
                      break;
                    case 1:
                      color = "orange";
                      break;
                    default:
                      color = "red";
                  }
                  return (
                    <ListItem
                      className="agentNumbersRow"
                      key={data.agent_id}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={`${data.agent_name}`}
                          src={data.agent_avatar}
                        >
                          {/* {data.name.charAt(0)} */}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={data.agent_name}
                        secondary={data.id}
                      />
                      <ListItemSecondaryAction>
                        <svg
                          focusable="false"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          style={{padding: "0px 2px"}}
                        >
                          <circle fill={color} cx="12" cy="12" r="8"></circle>
                        </svg>
                        {hasActiveUser == "" &&
                          <svg
                            onClick={(e) => {
                              e.stopPropagation();
                              // SipCallService.startCall(data.id);
                              // store.dispatch(callTransfer(201, data.id));
                              // store.dispatch(dialNumber(data.id));
                              SipCallService.startTransfer(data.id);
                              closeForwardPad();
                            }}
                            aria-hidden="true"
                            focusable="false"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            style={{padding: "0px 2px"}}
                          >
                            <path
                              fill="currentColor"
                              d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48zm-16.39 307.37l-15 65A15 15 0 0 1 354 416C194 416 64 286.29 64 126a15.7 15.7 0 0 1 11.63-14.61l65-15A18.23 18.23 0 0 1 144 96a16.27 16.27 0 0 1 13.79 9.09l30 70A17.9 17.9 0 0 1 189 181a17 17 0 0 1-5.5 11.61l-37.89 31a231.91 231.91 0 0 0 110.78 110.78l31-37.89A17 17 0 0 1 299 291a17.85 17.85 0 0 1 5.91 1.21l70 30A16.25 16.25 0 0 1 384 336a17.41 17.41 0 0 1-.39 3.37z"
                            ></path>
                          </svg>
                        }
                        {hasActiveUser != "" &&
                          <svg
                            onClick={(e) => {
                              e.stopPropagation();
                              // SipCallService.startCall(data.id);
                              // store.dispatch(callTransfer(201, data.id));
                              // store.dispatch(dialNumber(data.id));
                              SipCallService.startTransfer(data.id);
                              closeForwardPad();
                            }}
                            aria-hidden="true"
                            focusable="false"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            style={{padding: "0px 2px"}}
                          >
                            <path
                              fill="currentColor"
                              d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"
                            ></path>
                          </svg>
                        }
                        {hasActiveUser == "" &&
                          <svg
                            onClick={(e) => {
                              e.stopPropagation();
                              store.dispatch(setShowCallListeningPopup(data.id));
                            }}
                            aria-hidden="true"
                            focusable="false"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            style={{padding: "0px 2px"}}
                          >
                            <path
                              fill="currentColor"
                              d="M216 260c0 15.464-12.536 28-28 28s-28-12.536-28-28c0-44.112 35.888-80 80-80s80 35.888 80 80c0 15.464-12.536 28-28 28s-28-12.536-28-28c0-13.234-10.767-24-24-24s-24 10.766-24 24zm24-176c-97.047 0-176 78.953-176 176 0 15.464 12.536 28 28 28s28-12.536 28-28c0-66.168 53.832-120 120-120s120 53.832 120 120c0 75.164-71.009 70.311-71.997 143.622L288 404c0 28.673-23.327 52-52 52-15.464 0-28 12.536-28 28s12.536 28 28 28c59.475 0 107.876-48.328 108-107.774.595-34.428 72-48.24 72-144.226 0-97.047-78.953-176-176-176zm-80 236c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM32 448c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm480-187.993c0-1.518-.012-3.025-.045-4.531C510.076 140.525 436.157 38.47 327.994 1.511c-14.633-4.998-30.549 2.809-35.55 17.442-5 14.633 2.81 30.549 17.442 35.55 85.906 29.354 144.61 110.513 146.077 201.953l.003.188c.026 1.118.033 2.236.033 3.363 0 15.464 12.536 28 28 28s28.001-12.536 28.001-28zM152.971 439.029l-80-80L39.03 392.97l80 80 33.941-33.941z"
                            ></path>
                          </svg>
                        }
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
          </CustomScrollbars>
        </List>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  hasActiveUser: selectHasActiveUser
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ForwardCallPad);
