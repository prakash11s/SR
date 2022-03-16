
import * as H from 'history';
import { NumericDictionary } from 'lodash';

export interface IEmployeeAccountOverviewState {
 employeeData: IemployeeData;
 permissionsList: IpermissionList;
 checked: ICheckedObj[];
 showPopUpValue: boolean;
 errorCode: null;
 warningValue: boolean;
 successValue: boolean;
 deleteError: boolean;
}

export interface ICheckedObj {
 created_at: string;
 delete_protection: number;
 entity_id: null;
 entity_type: null;
 id: string;
 name: string;
 only_owned: number;
 options: []
 scope: null;
 title: string;
 updated_at: string;
}


interface IemployeeData {
 first_name: string;
 last_name: string;
 alias: string;
 salutation: string;
 email: string;
 phone: string;
 roles: string;
}

interface IpermissionList {
 data: ICheckedObj[];
}

export interface IEmployeeAccountOverviewProps{
 title: string;
 match: match<MatchParams>;  
 deleteEmployee: Function;
 history: H.History;  
}

interface MatchParams {
 name: string;
 id: string;
}

interface match<P> {
params: P;
isExact: boolean;
path: string;
url: string;
}