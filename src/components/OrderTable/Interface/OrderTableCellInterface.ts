import * as H from 'history';
import { IdataListObject } from '../../OrderTable/Interface/IndexInterface';

export interface IOrderTableCellProps {
  data: IdataListObject,
  deleteOrder: (id: number) => void,
  handleRequestClose: (id: number) => void,
  history: H.History,
  location: H.Location,
  match: match<MatchParams>,
  menuState: boolean|undefined,
  openSearchServiceModal: () => void,
  }

  interface MatchParams {
   name: string;
   id: number | string;
  }

  interface match<P> {
   params: P;
   isExact: boolean;
   path: string;
   url: string;
  }

export interface IOrderTableCellState {
	anchorEl: Element | undefined,
	menuState: boolean,
	popUp: boolean,
	callNumber: string,
	callName: string,
	callAlert: boolean,
	lockAlert: boolean,
    lockPopUp: boolean,
    unlockPopUp: boolean,
    lock: number,
    setLockedAlertSuccess: boolean,
    setunLockedAlertSuccess: boolean,
    setSweetAlertError: boolean,
    success: string,
    message: string,
    showPopUpValue: boolean,
    popUpType: string,
    actionType: string,
    popUpMsg: string,
    x: number,
    y: number,
    isLockMenuOpen: boolean,
    empList: any,
    empListLoader: boolean,
    lockListOptions: any,
    isEmpModalOpen: boolean
} 
 