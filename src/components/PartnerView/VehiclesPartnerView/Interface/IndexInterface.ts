
import { IDepartmentReducer } from 'reducers/Interface/DepartmentReducerInterface';
import {IServicePointReducer} from '../../../../reducers/Interface/ServicePointReducerInterface';
export interface IPartnerViewProps {
 match: match<MatchParams>;
}

interface MatchParams {
 name: string;
}

interface match<P> {
params: P;
isExact: boolean;
path: string;
url: string;
}

export interface IRootPartnerViewState {
 servicepoint: IServicePointReducer;
 department: IDepartmentReducer;
}

export interface IMapData {
 id: number,
 licensePlate: string,
 services: IservicesObj[],
 date: string,
 price: string,
 distance: number,
 additional_data: {
  created_at: string
  id: number
  json_value: any
  key: string
  order_id: number
  updated_at: string
  value: any
 }[]
 address:{
  city: string,
  zip_code: string
 },
 meta: {
   total_price: number
 }
 created_at: string,
 length: any
}

interface IservicesObj {
 name: string
}