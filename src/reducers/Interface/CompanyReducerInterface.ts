import {bool} from "prop-types";

export interface ICompanyReducer {
	company: ICompany,
	queueEntries: {
		data: [],
		meta: {}
	},
	isTableLoading: boolean,
	subscriptions: ISubscription,
	invoices: IInvoices,
	error: ''
}

export interface ISubscription {
	loading: boolean,
	error: string,
	subscriptionList: [],
	meta: any
}

export interface IInvoices {
	meta: any,
	loading: boolean,
	error: string,
	invoiceList: []
}

export interface ICompany {
	id: string,
	department: string,
	name: string,
	coc: string,
	street: string,
	street_number: number,
	city: string,
	zip_code: string,
	lng: string,
	lat: string,
	country: string,
	phone: string,
	phone_2: string,
	email: string,
	website: string,
	description: string,
	opening_hours: IOpeningHours | null,
	old_service_point_id: number,
	created_at: string,
	updated_at: string,
	deleted_at: string,
	public_visibility: number,
}

export interface IOpeningHours {
	mon: IHour,
	tue: IHour,
	wed: IHour,
	thu: IHour,
	fri: IHour,
	sat: IHour,
	sun: IHour,
}

export interface IHour {
	open_status: boolean,
	open: string,
	close: string
}
