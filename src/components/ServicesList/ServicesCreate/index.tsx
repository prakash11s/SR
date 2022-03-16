import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
	Card,
	CardHeader,
	CardContent,
	FormControl,
	TextField,
	InputLabel,
	Select,
	Input,
	MenuItem,
	Fab,
	IconButton
} from '@material-ui/core';
import {Row, Col, Modal, ModalHeader} from 'reactstrap';
import {
	getServiceCategories,
	getServicePriceDrive, 
	resetServiceLoadingError, 
	submitServiceAction
} from "../../../actions/Actions/ServicesActions";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import {IServicesPayload, IServicesCreateInterface} from "./Interface/ServicesCreateInterface";
import {ICategory, IPriceDriver} from "../../../reducers/Interface/ServicesReducerInterface";

/**
 * Component for Create Service
 */
const ServicesCreate = (props: IServicesCreateInterface) => {

	/**
	 * Created dispatch for to dispatch actions
	 */
	const dispatch = useDispatch();

	const [serviceName, setServiceName] = useState<string>('');
	const [serviceCategory, setServiceCategory] = useState<string>('');
	const [servicePriceDrive, setServicePriceDrive] = useState<string>('');
	const [serviceDescription, setServiceDescription] = useState<string>('');

	const [fields, setFields] = useState<string[]>([]);
	const [validations, setValidations] = useState<object>({});

	const [categories, setCategories] = useState<[]>([]);
	const [priceDrivers, setPriceDrivers] = useState<[]>([]);

	/**
	 * get services list state from redux
	 * */
	const servicesState = useSelector((state: any) => state.servicesState);

	useEffect(() => {
		if (!Boolean(categories.length)) {
			dispatch(getServiceCategories())
		}
		if (!Boolean(priceDrivers.length)) {
			dispatch(getServicePriceDrive())
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (servicesState.categories) {
			setCategories(servicesState.categories)
		}
	}, [servicesState.categories]);

	useEffect(() => {
		if (servicesState.price_driver) {
			setPriceDrivers(servicesState.price_driver)
		}
	}, [servicesState.price_driver]); // eslint-disable-line react-hooks/exhaustive-deps

	const onChangeHandler = (e: any, field: string) => {
		switch (field) {
			case 'name':
				setServiceName(e.target.value);
				break;
			case 'description':
				setServiceDescription(e.target.value);
				break;
			case 'category':
				setServiceCategory(e.target.value);
				break;
			case 'priceDrive':
				setServicePriceDrive(e.target.value);
				const price = priceDrivers.find((price: IPriceDriver) => price.driver === e.target.value);
				if (price && 'fields' in price) {
					setFields(Object.keys(price['fields']));
					const fields = Object.keys(price['fields']);
					const validation = {};
					Object.values(price['fields']).forEach((value: unknown, index: number) => {
						validation[fields[index]] = value;
					});
					setValidations(validation)
				}
				break;
		}
	};

	/**
	 *  render service category selection
	 */
	const renderCategories = (
		<Select
			value={serviceCategory}
			labelId={'service.category'}
			onChange={(event: any) => onChangeHandler(event, 'category')}
			input={<Input id="category"/>}
		>
			<MenuItem value="" disabled>
				Select Category
			</MenuItem>
			{categories && categories.map((category: ICategory) => {
				return (
					<MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
				)
			})}
		</Select>
	);

	/**
	 *  render service price driver selection
	 */
	const renderPriceDriver = (
		<Select
			value={servicePriceDrive}
			labelId={'service.priceDrive'}
			onChange={(event: any) => onChangeHandler(event, 'priceDrive')}
			input={<Input id="priceDriver"/>}
		>
			<MenuItem value="" disabled>
				Select Price Driver
			</MenuItem>
			{priceDrivers && priceDrivers.map((price: IPriceDriver) => {
				return (
					<MenuItem key={price.name} value={price.driver}>{price.name}</MenuItem>
				)
			})}
		</Select>
	);

	/**
	 * render feilds
	 */
	const renderFields = (
		<>
			{fields && fields.map((field: string) => {
				console.log(field)
				console.log(validations[field])
			})}
		</>
	);

	const onSubmit = () => {
		if (serviceName && serviceCategory && servicePriceDrive && serviceDescription) {
			const data: IServicesPayload = {
				name: serviceName,
				category_id: serviceCategory,
				description: serviceDescription,
				price_driver_class: servicePriceDrive
			};
			dispatch(submitServiceAction(data, props.history))
		}
	};

	const renderModal = () => {
		return (
			<Modal isOpen={servicesState.loading}>
				<ModalHeader>
					<Col sm={{size: 11}}>
						{servicesState.error === '' && <h2>Loading..</h2>}
						{servicesState.error !== '' && <h2>{servicesState.error}</h2>}
					</Col>
					<Col sm={{size: 1}}>
						{servicesState.error !== '' &&
												<IconButton onClick={() => dispatch(resetServiceLoadingError())}>
													<CancelIcon/>
												</IconButton>}
					</Col>
				</ModalHeader>
			</Modal>
		)
	};

	return (
		<div className="app-wrapper">
			{servicesState.loading && renderModal()}
			<Card>
				<CardHeader title={"Create Service"}/>
				<CardContent>
					<Row>
						<Col sm={{size: 5, offset: 1}}>
							<Row>
								<FormControl className="w-50 mb-2 h-75">
									<TextField
										id="service.name"
										label="Name"
										value={serviceName}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeHandler(event, 'name')}
									/>
								</FormControl>
							</Row>
							<Row>
								<FormControl className="w-50 mb-2 h-75">
									<InputLabel id="service.category">Service Category</InputLabel>
									{Boolean(categories.length) && renderCategories}
								</FormControl>
							</Row>
							<Row>
								<FormControl className="w-50 mb-2 h-75">
									<InputLabel id="service.priceDrive">Service Price Driver</InputLabel>
									{Boolean(priceDrivers.length) && renderPriceDriver}
								</FormControl>
							</Row>
							{servicePriceDrive && renderFields}
							<Row>
								<FormControl className="w-50 mb-2 h-75">
									<TextField
										id="service.name"
										label="Description"
										multiline={true}
										rows={5}
										value={serviceDescription}
										onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChangeHandler(event, 'description')}
									/>
								</FormControl>
							</Row>
							<Row>
								<Col sm={{size: 5, offset: 1}}>
									<Fab color="primary" aria-label="add"
										 onClick={onSubmit}>
										<SaveIcon/>
									</Fab>
								</Col>
							</Row>
						</Col>
					</Row>
				</CardContent>
			</Card>
		</div>
	);
};

export default ServicesCreate;
