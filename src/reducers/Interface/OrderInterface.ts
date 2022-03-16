export interface IOrder {
  order: [],
  preferredDates: [],
  cancelOrder: ICancelOrder,
  orderCreate: IOrderCreate,
  service_points: [],
  service_point_details: {},
  service_point_dissociation: IDissociationReason
}
export interface ICreatePreferredDate {
  start_date: string,
  end_date?: string,
  description?: string
}

interface ICancelOrder {
  message: undefined,
  success: boolean
}

interface IDissociationReason {
  message: undefined,
  success: boolean,
  loading: boolean,
  reason: any
}

export interface IOrderCreate {
  order: any,
  services: any,
  orderDetails: any,
  supportCodeData?: any,
  autoCompleteAddress?: IAutoCompleteAddress | null
  orderPrefillData?: any,
  selectedServices?: Array<any>,
  isUpdated?: boolean,
  isUpdatingPrice: boolean,
  serviceError: string;
  senderDetails: IDetails;
  receiverDetails: IDetails;
  clientDetails: IClientDetails;
  others: IOthers
}

export interface IOrderCreateService {
  id:any;
  checked:boolean
  service_price:{
    price:number
  }
}

interface IAutoCompleteAddress {
  Address?: any,
  error?:string
}
export interface IService {
  id:number,
  service_price:object
  checked:any
}

export interface IDetails {
  title?: string;
  name?: string;
  phone?: string | number;
  address?: string;
  email?: string;
  houseNumber?: string | number;
  company?: string;
  department?: string | number
}
export interface IClientDetails {
  title?: string;
  name?: string;
  phone?: string | number;
  address?: string;
  email?: string;
  houseNumber?: string | number;
  postalCode?: string;
  place?: string | number
}
export interface IOthers {
  comment?: string;
  paymentBy?: string
}
