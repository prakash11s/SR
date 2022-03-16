import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';

const ServicesPage = () => {
	return (
		<div className="app-wrapper">
			<Switch>
				<Route exact path="/admin/services" component={asyncComponent(() => import('../../../components/ServicesList/ServicesList'))} />
				<Route exact path="/admin/services/create" component={asyncComponent(() => import('../../../components/ServicesList/ServicesCreate'))} />
				<Route component={asyncComponent(() => import('../../../components/Error404'))} />
			</Switch>
		</div>
	);
}

export default ServicesPage;
