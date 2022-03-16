import {FormControl, Input, MenuItem, Select, TextField, InputLabel} from "@material-ui/core";
import React from "react";

import IntlMessages from "../../util/IntlMessages";
import { IClientDetailsProps, IAddressError } from "./Interface/IndexInterface";

const ClientDetails = (props: IClientDetailsProps) => {

	const address_error: (IAddressError) = {
		error: false,
		errorMsg: ''
	};
	if (props.autoCompleteData) {
		if (props.autoCompleteData.error) {
			address_error.error = true;
			address_error.errorMsg = props.autoCompleteData.error.message;
		}
	}

	const renderTitle = (
		<Select
			labelId={'clientDetails.title'}
			value={props.title || ''}
			onChange={(event: React.ChangeEvent<{ name?: string | undefined;  value: unknown;}>) => props.onChangeTitle(event.target.value as string)}
			input={<Input id="title"/>}
		>
			<MenuItem value={'mr. mrs.'}>Mr. Mrs.</MenuItem>
			<MenuItem value={'mr.'}>Mr.</MenuItem>
			<MenuItem value={'mrs.'}>Mrs.</MenuItem>
		</Select>
	);
	
	return (
		<>
			<div className="row">
				<div className="col-3">
					<FormControl className="w-100 mb-2">
						<InputLabel id={'clientDetails.title'}><IntlMessages id={'clientDetails.title'} /></InputLabel>
						{renderTitle}
					</FormControl>
				</div>
				<div className="col-9">
					<FormControl className="w-100 mb-2">
						<TextField
							required
							label={<IntlMessages id={'clientDetails.name'} />}
							value={props.name}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangeName(event.target.value)}
							className="w-80 mb-2 h-75 form-control"/>
					</FormControl>
				</div>
			</div>
			<FormControl className="w-100 mb-2">
				<TextField
					type='email'
					required
					label={<IntlMessages id={'clientDetails.email'} />}
					value={props.email}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangeEmail(event.target.value)}
					className="w-80 mb-2 h-75 form-control"/>
			</FormControl>
			<FormControl className="w-100 mb-2">
				<TextField
					type='text'
					required
					label={<IntlMessages id={'clientDetails.phone'} />}
					value={props.phone}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangePhone(event.target.value)}
					className="w-80 mb-2 h-75 form-control"/>
			</FormControl>
			<div className="row">
				<div className="col-7">
					<FormControl className="w-100 mb-2">
						<TextField
							type='text'
							// required
							label={<IntlMessages id={'clientDetails.postalcode'} />}
							value={props.postalCode}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangePostalCode(event.target.value)}
							className="w-100 mb-2 h-75 form-control"/>
					</FormControl>
				</div>
				<div className="col-5">
					<FormControl className="w-100 mb-2">
						<TextField
							type='text'
							// required
							label={<IntlMessages id={'clientDetails.houseNo'} />}
							value={props.houseNo}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangeHouseNo(event.target.value)}
							className="w-100 mb-2 h-75 form-control"/>
					</FormControl>
				</div>
			</div>
			<div className="row">
				<div className="col-7">
					<FormControl className="w-100 mb-2">
						<TextField
							type='text'
							// required
							error={address_error.error}
							helperText={address_error.errorMsg}
							label={<IntlMessages id={'clientDetails.address'} />}
							value={props.address}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangeAddress(event.target.value)}
							className="w-100 mb-2 h-75 form-control"/>
					</FormControl>
				</div>
				<div className="col-5">
					<FormControl className="w-100 mb-2">
						<TextField
							type='text'
							// required
							error={address_error.error}
							helperText={address_error.errorMsg}
							label={<IntlMessages id={'clientDetails.place'} />}
							value={props.place}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangePlace(event.target.value)}
							className="w-100 mb-2 h-75 form-control"/>
					</FormControl>
				</div>
			</div>
		</>
	);
}

export default ClientDetails;