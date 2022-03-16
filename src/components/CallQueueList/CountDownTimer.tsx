import React, { Component } from "react";

import { Badge } from 'reactstrap';

import { ICountDownTimerState } from './Interface/CountDownTimerInterface';

class CountDownTimer extends Component<{}, ICountDownTimerState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            timer: 10
        }        
    }

    componentDidMount() {
        this.startTimer();
    }

    startTimer() {

        let timer = setInterval(() => {

            this.setState((prevState: { timer: number}) => ({
                timer: prevState.timer - 1
            }))

            if (this.state.timer === 0) {
                clearInterval(timer);
            }
        }, 1000);
    }

    render() {
        const { timer } = this.state;
        return (<Badge color="dark" className="cursor-pointer mb-0" id="countDownTimer" >
            {timer}
        </Badge>);
    }
}

export default CountDownTimer;
