import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';

const Reports = (props:any) => {
	return (
		<div className="app-wrapper">
			<Switch>
				<Route exact path="/support/reports/open-quotes" component={asyncComponent(() => import('../../../components/Reports/openQuotes'))} />
				<Route exact path="/support/reports/canceled-orders" component={asyncComponent(() => import('../../../components/Reports/canceledOrders'))} />
				<Route exact path="/support/reports/assigned-orders" component={asyncComponent(() => import('../../../components/Reports/assignedOrders'))} />
				<Route component={asyncComponent(() => import('components/Error404'))} />
			</Switch>
		</div>
	);
}

export default Reports;
