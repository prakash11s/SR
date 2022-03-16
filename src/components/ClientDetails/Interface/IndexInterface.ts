export interface IClientDetailsProps {
	title:string;
	address:string;
	place:string;
	name:string;
	email:string;
	phone:string;
 	postalCode:string;
	houseNo:string;
	onChangeTitle:(e: string) => void;
	onChangeName:(e: string) => void;
	onChangeEmail:(e: string) => void;
	onChangePhone:(e: string) => void;
	onChangePostalCode:(e: string) => void;
	onChangeHouseNo:(e: string) => void;
	onChangeAddress:(e: string) => void;
	onChangePlace:(e: string) => void;
	autoCompleteData:{
		Address: {
			street: string, 
			city: string
		}, error?: {
			message: string
		}}
}

export interface IAddressError {
	error: boolean,
	errorMsg: string
}