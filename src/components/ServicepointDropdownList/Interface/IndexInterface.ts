import * as H from 'history';
import { IDepartmentReducer } from 'reducers/Interface/DepartmentReducerInterface';
import { IServicePointReducer } from '../../../reducers/Interface/ServicePointReducerInterface';

export interface IServicepointDropdownListProps {
 setServicepointStartAsync: (p1: any) => void;
 handleRequestClose: () => void;
 servicepoint: IServicePoint
 departmentsList: any
 addSelectedServicepoint: (p1: IServicePointDetails) => void;
 history?: H.History;
}

export interface IServicePoint {
     selectedServicepoint: IServicePointDetails,
     servicepointsList: {
         data: IServicePointDetails[];
     }};

export interface IServicePointDetails {
 city: string,
 coc: string | null,
 country: string,
 created_at: string,
 deleted_at: string | null,
 department: string,
 description: string | null,
 email: string,
 geolocation: { lat: string | null, lng: string | null }
 id: string,
 media: []
 name: string,
 opening_hours: { 
     fri: {from: string, until: string}
     mon: {from: string, until: string}
     sat: {from: string, until: string}
     thu: {from: string, until: string}
     tue: {from: string, until: string}
     wed: {from: string, until: string}
 }
 phone: string,
 phone_2: string,
 street: string,
 street_number: string,
 updated_at: string,
 website: null
 zip_code: string,
}

export interface IRootServicepointDropdownListState {
 servicepoint: IServicePointReducer,
 department: IDepartmentReducer
}