import { IOrder } from '../../../../reducers/Interface/OrderInterface';

export interface IRootStep4State {
 orderState: IOrder
}

export interface IService {
 id: number,
 name: string,
 checked: boolean,
 custom_description?: string,
 service_price:{
  price: number
 }
}

export interface IServiceEdit {
	id: number,
	price: number,
	price_per_unit?: number,
	custom_description?: string
}

export interface IVehiclesStep4Props {
	activeStep: number,
	handleBack: () => void,
	handleNext: () => void,
	steps: string[]
}

export interface ISelectedServiceItem {
	name: string,
	service_price:{
		price: number
	}
	custom_description?: string
}
