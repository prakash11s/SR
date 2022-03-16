import { IOrder } from '../../../../reducers/Interface/OrderInterface';

export interface ICouriersStep5Props {
	activeStep: number,
	handleBack: () => void,
	handleNext: () => void,
 steps: string[], 
}

export interface IService {
 id: number,
 name: string,
 checked: boolean, 
 service_price:{
  price: number
 }
}

export interface IRootCouriersStep5State {
orderState: IOrder
}

export interface ILifecycleProps {
 from: ICoordinates,
 to: ICoordinates,
 }
 
 interface ICoordinates {
 latitude: number,
 longitude: number,
 placeId: string
 }