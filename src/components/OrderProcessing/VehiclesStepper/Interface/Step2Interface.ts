import { IOrder } from '../../../../reducers/Interface/OrderInterface';

export interface IVehiclesStep2Props {
	activeStep: number,
	handleBack: () => void,
	handleNext: () => void,
 steps: string[],
 onHeadingChange: (p1: string, p2: number) => void,
 additional_services_text: string,
 setAdditionalText: (p1: string) => void
}

export interface IRootStep2State {
 orderState: IOrder
}

export interface IService {
 name: string,
 id: string,
 checked: boolean,
 service_price:{
  price: number
 }
}
