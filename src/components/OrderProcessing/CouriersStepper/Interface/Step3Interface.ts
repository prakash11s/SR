import { IOrder } from '../../../../reducers/Interface/OrderInterface';

export interface ICouriersStep3Props {
 activeStep: number,
 handleBack: () => void,
	handleNext: () => void,
 steps: string[],
 onHeadingChange: (p1: string, p2: number) => void;
}

export interface IRootCouriersStep3State {
 orderState: IOrder
}

export interface IPayload {
 salutation: string,
 name: string,
 email: string,
 phone: string,
 country: string,
 zip_code: string,
 street_number: string,
 street: string,
 city: string,
 services: { id: number }[],
 news_letter_acceptance: boolean | string,
 tos_acceptance: boolean,
 preferred_delivery_moments: [
  {
   //to
   datetime: string
  }
 ],
 preferred_pickup_moments: [
  {
   //from
   datetime: string
  }
 ],
 from: string,
 from_street_number: string,
 to: string,
 to_street_number: string,
 sender_details?: {
  name?: string,
  salutation?: string,
  email?: string,
  phone?: string,
  company?: string,
  department?: string
 },
 receiver_details?:{
  name?: string,
  salutation?: string,
  email?: string,
  phone?: string,
  company?: string,
  department?: string
 },
 comment?: string,
 dimensions?: {
    width: number,
    height: number,
    length: number,
    weight: number
 }
};

export interface IService {
 name: string,
 checked: boolean, 
 service_price:{
  price: number
 }
}