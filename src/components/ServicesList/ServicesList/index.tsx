import React, {useEffect} from "react";
import {getServicesAction} from "../../../actions/Actions/ServicesActions";
import {useDispatch, useSelector} from "react-redux";
import ContainerHeader from "../../ContainerHeader";
import IntlMessages from "../../../util/IntlMessages";
import ServicesTable from './ServicesTable'
import {CircularProgress, Fab} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add'
import {IServicesList} from "./Interface/ServicesListInterface";

/**
 * Component for Service List
 */
const ServicesList: React.FC<IServicesList> = (props) => {

	/**
	 * Created dispatch for to dispatch actions
	 */
	const dispatch = useDispatch();

	/**
	 * get services list state from redux
	 * */
	const servicesState = useSelector((state: any) => state.servicesState);

	
	useEffect(() => {
		dispatch(getServicesAction());
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const renderInfoContainer = (
		(servicesState.loading && !servicesState.error) ?
			<div className="page-heading justify-content-center align-items-center d-flex">
				<CircularProgress/>
			</div> :
			(!servicesState.loading && servicesState.error) ?
				<div className="page-heading justify-content-center align-items-center d-flex">
					<h1>{servicesState.error}</h1>
				</div> : null
	);

	return (
		<div>
			<ContainerHeader title={<IntlMessages id="sidebar.services"/>} match={props.match}/>
			{renderInfoContainer}
			{!servicesState.loading && !servicesState.error && servicesState.services &&
						<>
							<div className="justify-content-end align-items-center d-flex">
								<Fab color="primary" aria-label="add" onClick={() => props.history.push('/admin/services/create')}>
									<AddIcon/>
								</Fab>
							</div>
							<ServicesTable dataList={servicesState.services}/>
						</>}
		</div>
	);
};

export default ServicesList;
