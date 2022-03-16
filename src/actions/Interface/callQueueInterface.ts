import path from "path";

export interface ICallQueue {
  id:string
  phone:string
}


export interface IHistory {
  push:(path:string) => void
}

export interface IRescheduleConnect {
  id:string;
  time:string;
  history:object | undefined;
  onChangeHandlerId:number
}
