import React from "react";

import { ITimerComponentProps } from './Interface/IndexInterface';

function TimerComponent(props: ITimerComponentProps): JSX.Element {

  const { callDuration } = props;
  const secondsToTime = (secs: number) => {    
    let hours = Math.floor(secs / (60 * 60));

    let divisorForMinutes = secs % (60 * 60);
    let minutes = Math.floor(divisorForMinutes / 60);

    let divisorForSeconds = divisorForMinutes % 60;
    let seconds = Math.ceil(divisorForSeconds);
    let obj = {
      hours,
      minutes: minutes < 10 && `0${minutes}` || minutes,
      seconds: seconds < 10 && `0${seconds}` || seconds
    };
    return obj.hours ? `${obj.hours}:${obj.minutes}:${obj.seconds}`: `${obj.minutes}:${obj.seconds}`;
  };

  return (
    <div>
      {secondsToTime(callDuration)}
    </div>
  );
}

export default TimerComponent;
