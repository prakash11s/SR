import React, {useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import 'react-phone-input-2/lib/style.css'
import {
	onActiveCallPadToggle,
} from 'actions/Actions/SoftPhoneActions';
import SipCallService from "./SipCallService";

const ActiveCallNumberPad: React.FC<any> = (props) => {

	const dispatch = useDispatch();

	const SoftPhoneState = useSelector((state: any) => state.softPhone.Call)

	const onCallNumberPadToggle = () => {
		dispatch(onCallNumberPadToggle())
	}

	const [number, setNumber] = useState<string>('');

	const toggleNumberPad = () => {
		dispatch(onActiveCallPadToggle())
	}

	const onDigitPress = (digit: string) => {
		setNumber(number + digit);
		SipCallService.sendDigit(digit, SoftPhoneState.callType);
	}

	return (
		<div>
			<div className="phone d-flex flex-column justify-content-between">
				<div className="number position-relative p-3 m-3">
					<h1>{number}</h1>
				</div>
				<div className="dialer">
					<div className="row no-gutters">
						<div
							onClick={() => onDigitPress('1')}
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
								<path
									d="M18.5 6C15.46 6 13 8.46 13 11.5c0 1.33.47 2.55 1.26 3.5H9.74c.79-.95 1.26-2.17 1.26-3.5C11 8.46 8.54 6 5.5 6S0 8.46 0 11.5 2.46 17 5.5 17h13c3.04 0 5.5-2.46 5.5-5.5S21.54 6 18.5 6zm-13 9C3.57 15 2 13.43 2 11.5S3.57 8 5.5 8 9 9.57 9 11.5 7.43 15 5.5 15zm13 0c-1.93 0-3.5-1.57-3.5-3.5S16.57 8 18.5 8 22 9.57 22 11.5 20.43 15 18.5 15z"></path>
							</svg>
						</div>
						<div
							onClick={() => onDigitPress('2')}
							data-cy="number-2"
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">2</h2>
							<p className="mb-0 text-uppercase">ABC</p>
						</div>
						<div
							onClick={() => onDigitPress('3')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">3</h2>
							<p className="mb-0 text-uppercase">DEF</p>
						</div>
						<div
							onClick={() => onDigitPress('4')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">4</h2>
							<p className="mb-0 text-uppercase">GHI</p>
						</div>
						<div
							onClick={() => onDigitPress('5')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">5</h2>
							<p className="mb-0 text-uppercase">JKL</p>
						</div>
						<div
							onClick={() => onDigitPress('6')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">6</h2>
							<p className="mb-0 text-uppercase">MNO</p>
						</div>
						<div
							onClick={() => onDigitPress('7')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">7</h2>
							<p className="mb-0 text-uppercase">PQRS</p>
						</div>
						<div
							onClick={() => onDigitPress('8')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">8</h2>
							<p className="mb-0 text-uppercase">TUV</p>
						</div>
						<div
							onClick={() => onDigitPress('9')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">9</h2>
							<p className="mb-0 text-uppercase">WXYZ</p>
						</div>
						<div
							onClick={() => onDigitPress('*')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column">
							<h2 className="m-0 font-weight-bold">*</h2>
						</div>
						<div
							onClick={() => onDigitPress('0')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column"
						>
							<h2 className="m-0 font-weight-bold">0</h2>
						</div>
						<div
							onClick={() => onDigitPress('#')}
							className="digit col-4 pt-3 pb-3 d-flex align-items-center justify-content-center text-center flex-column">
							<h2 className="m-0 font-weight-bold">#</h2>
						</div>
					</div>
				</div>
			</div>

			<div
          className="btn-round d-flex align-items-center justify-content-center marginAuto"
          onClick={() => toggleNumberPad()}
      >
          <svg xmlns="http://www.w3.org/2000/svg"
               width="50" height="100"
               viewBox="0 0 24 24">
              <path
                  d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
      </div>
		</div>
	);
};

export default ActiveCallNumberPad;
