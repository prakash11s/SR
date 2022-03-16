import React from "react";
import { Formik, Field } from "formik";
import { connect } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  dialNumber,
  onCallNumberPadToggle,
  onForwardPadToggle,
  openDialPad,
} from "actions/Actions/SoftPhoneActions";
import SoftPhoneService from "./softPhone.service";
import { store } from "../../store";
import SipCallService from "./SipCallService";

class NumberPad extends React.Component<any, any> {
  state = {
    callerPhoneNumber: "",
  }

  componentDidMount() {
    const phoneInput = document.getElementById("phone-input");
    (phoneInput as any).addEventListener("blur", () => {
      setTimeout(() => {
        (phoneInput as any).focus();
      }, 0);
    });
  }

  onBackspaceHandler(phoneNumber: any) {
    return phoneNumber.substring(0, phoneNumber.length - 1);
  }

  sendDigit(number: any) {
    SoftPhoneService.sendDigits(number);
  }

  numberpadKeyPress = (event: any) => {
    if (event.key == "Enter") {
      this.handleSubmit({phoneNumber: this.state.callerPhoneNumber});
    }

    if (event.key.match(/[0-9|*|#]/g)) {
      this.sendDigit(event.key);
    }
  };

  onKeyPress(event) {
    if (event.which === 13 /* Enter */) {
      console.log("ENTER CLICK ==========================>");
      event.preventDefault();
    }
  }

  handleSubmit = (value: any) => {
    const phoneNumber =
      value &&
      value.phoneNumber.length &&
      value.phoneNumber.replace(/[-()\s]/g, "");
    if (phoneNumber.length) {
      const phone =
        phoneNumber.substr(0, 1) === "+"
          ? phoneNumber.slice(1)
          : phoneNumber;
      SipCallService.startCall("00" + phone);
      store.dispatch(dialNumber(phone));
    }
  }

  render() {
    const {
      onCallNumberPadToggle,
      hasActivePhoneCall,
      softPhoneAgent,
    } = this.props;

    return (
      <Formik
        initialValues={{
          phoneNumber: "",
        }}
        onSubmit={(value: any) => this.handleSubmit(value)}
        onKeyPress={this.onKeyPress}
      >
        {({ values, handleSubmit, setFieldValue }: any) => (
          <form onSubmit={handleSubmit}>
            <div className="phone d-flex flex-column justify-content-between">
              <div className="number position-relative p-3 m-3">
                <Field data-cy="phone-number" name="phoneNumber">
                  {({ field: { value }, form: { setFieldValue } }: any) => (
                    <PhoneInput
                      inputProps={{
                        required: true,
                        autoFocus: true,
                        id: "phone-input",
                      }}
                      country={"nl"}
                      onlyCountries={["nl", "be"]}
                      value={value}
                      onChange={(number: any, countryCode: any) => {
                        setFieldValue(
                          "phoneNumber",
                          (number.length && number.trim()) || ""
                        );
                        this.setState({callerPhoneNumber: number});
                      }}
                      onFocus={(data: any, countryCode: any) => {
                        if (!values.phoneNumber) {
                          setFieldValue(
                            "phoneNumber",
                            countryCode.dialCode + values.phoneNumber
                          );
                        }
                      }}
                      onKeyDown={this.numberpadKeyPress}
                    />
                  )}
                </Field>
                <div className="remove position-absolute d-flex align-items-center">
                  <svg
                    className="MuiSvgIcon-root"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="presentation"
                    onClick={() =>
                      setFieldValue(
                        "phoneNumber",
                        this.onBackspaceHandler(values.phoneNumber)
                      )
                    }
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"></path>
                  </svg>
                </div>
              </div>
              <div className="dialer">
                <div className="row no-gutters">
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("1")
                      );
                      this.sendDigit("1");
                    }}
                    data-cy="number-1"
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">1</h2>
                    <svg
                      className="MuiSvgIcon-root"
                      focusable="false"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      role="presentation"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M18.5 6C15.46 6 13 8.46 13 11.5c0 1.33.47 2.55 1.26 3.5H9.74c.79-.95 1.26-2.17 1.26-3.5C11 8.46 8.54 6 5.5 6S0 8.46 0 11.5 2.46 17 5.5 17h13c3.04 0 5.5-2.46 5.5-5.5S21.54 6 18.5 6zm-13 9C3.57 15 2 13.43 2 11.5S3.57 8 5.5 8 9 9.57 9 11.5 7.43 15 5.5 15zm13 0c-1.93 0-3.5-1.57-3.5-3.5S16.57 8 18.5 8 22 9.57 22 11.5 20.43 15 18.5 15z"></path>
                    </svg>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("2")
                      );
                      this.sendDigit("2");
                    }}
                    data-cy="number-2"
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">2</h2>
                    <p className="mb-0 text-uppercase">ABC</p>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("3")
                      );
                      this.sendDigit("3");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">3</h2>
                    <p className="mb-0 text-uppercase">DEF</p>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("4")
                      );
                      this.sendDigit("4");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">4</h2>
                    <p className="mb-0 text-uppercase">GHI</p>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("5")
                      );
                      this.sendDigit("5");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">5</h2>
                    <p className="mb-0 text-uppercase">JKL</p>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("6")
                      );
                      this.sendDigit("6");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">6</h2>
                    <p className="mb-0 text-uppercase">MNO</p>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("7")
                      );
                      this.sendDigit("7");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">7</h2>
                    <p className="mb-0 text-uppercase">PQRS</p>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("8")
                      );
                      this.sendDigit("8");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">8</h2>
                    <p className="mb-0 text-uppercase">TUV</p>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("9")
                      );
                      this.sendDigit("9");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">9</h2>
                    <p className="mb-0 text-uppercase">WXYZ</p>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("*")
                      );
                      this.sendDigit("*");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">*</h2>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("0")
                      );
                      this.sendDigit("0");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">0</h2>
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue(
                        "phoneNumber",
                        values.phoneNumber.concat("#")
                      );
                      this.sendDigit("#");
                    }}
                    className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
                  >
                    <h2 className="m-0 font-weight-bold">#</h2>
                  </div>
                </div>
              </div>
              <div className="controls mb-4">
                <div className="buttons d-flex align-items-center justify-content-center">
                  <div className="settings extension position-absolute p-4">
                    {softPhoneAgent.length ? softPhoneAgent[0].extension : null}
                  </div>
                  {!hasActivePhoneCall && values.phoneNumber.length >= 8 ? (
                    <button
                      className="btn btn-success p-3 mr-0"
                      type="submit"
                      data-cy="call"
                      disabled={
                        this.props.isDeviceReady || !values.phoneNumber.length
                      }
                    >
                      <svg
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        role="presentation"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                      </svg>
                    </button>
                  ) : (
                    ""
                  )}
                  <div
                    onClick={this.props.onForwardPadToggle}
                    className="settings position-absolute p-4"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="users"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                    >
                      <path
                        fill="currentColor"
                        d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* <div className="controls mb-4"> */}

              {/* </div> */}
            </div>

            {hasActivePhoneCall && (
              <div
                className="btn-round d-flex align-items-center justify-content-center marginAuto"
                onClick={() => onCallNumberPadToggle()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="100"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            )}
          </form>
        )}
      </Formik>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onCallNumberPadToggle: () => dispatch(onCallNumberPadToggle()),
    onForwardPadToggle: () => dispatch(onForwardPadToggle()),
    openDialPad: () => dispatch(openDialPad()),
  };
};

const mapStateToProps = ({ softPhone }: any) => ({
  hasActivePhoneCall: softPhone.Call.hasActivePhoneCall,
  softPhoneAgent: softPhone.softPhoneAgent,
});

//   const mapStateToProps = createStructuredSelector(
//     {
//       callQueueStatus: selectCallQueueStatus,
//       noActionTaken: selectNoActionTaken
//     });

export default connect(mapStateToProps, mapDispatchToProps)(NumberPad);
