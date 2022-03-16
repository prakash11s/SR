import * as H from 'history';

export interface IServicesPayload {
	name: string,
	category_id: string,
	description: string,
	price_driver_class: string
}

export interface IServicesCreateInterface {
	history: H.History
}
