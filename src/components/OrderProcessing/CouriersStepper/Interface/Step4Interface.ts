import {IOrder} from '../../../../reducers/Interface/OrderInterface';

export interface IService {
	id: number,
	name: string,
	checked: boolean,
	service_price: {
		price: number
	}
}

export interface IRootCouriersStep4State {
	orderState: IOrder
}

export interface IServiceEdit {
	id: number,
	price_per_unit?: number
}

export interface IService {
	id: number,
	name: string,
	checked: boolean,
	service_price: {
		price: number
	}
}