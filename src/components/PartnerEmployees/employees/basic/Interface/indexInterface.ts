import {IPartnerEmployeesReducer} from 'reducers/Interface/PartnerEmployeesReducerInterface';
import {IAuth} from 'reducers/Interface/AuthInterface';
import {ISetting} from 'reducers/Interface/SettingInterface';

export interface IPartnerEmployeesProps {
 width: number,
 first_name: string,
 last_name: string,
 avatar: string,
 partnerEmployees: [],
 getPartnerEmployees: (limit:number, page:number) => void,
 }
 
 export interface IPartnerEmployeesState {
   noContentFoundMessage: string,
   alertMessage: string,
   showMessage: boolean,
   selectedSectionId: number,
   drawerState: boolean,
   user: {
     name: string,
     email: string,
     avatar: string
   },
   searchUser: string,
   filterOption: string,
   allContact: any,
   contactList: any,
   selectedContact: null,
   selectedContacts: number,
   addContactState: boolean,
 }

 export interface IRootReducerPartnerEmployeesState {
  settings: ISetting
  partnerEmployeeState: IPartnerEmployeesReducer,
  auth: IAuth,
 }