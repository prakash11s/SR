import { bool } from 'prop-types';
export interface ICallQueueReducer {
  callQueueListData: ICallQueueList
  callQueueId: null,
  loader: boolean,
  show: boolean,
  promptShow: boolean,
  callQueueOverviewData: [],
  spinner: boolean,
  callQueueStatus: boolean,
  activeCaller?: any,
  showTimer: boolean,
  snackBar: boolean,
  callQueueIdData: {
    created_at: string,
department: string,
description: string,
id: number|null,
image: string,
name: string,
order: number|null,
updated_at: string,
  },
  editSuccess: boolean,
  editFailed: boolean,
  toggleAlertPopUp: boolean
}

export interface ICallQueueList {
  data: [],
  meta: null
}


export interface IData {
  id:number
  noActionTaken:boolean
}
