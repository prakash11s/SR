import React from 'react';
import {Route, Switch} from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';
import OrderPage from '../../../Pages/OrderPage';
import OrderOverView from '../../../Pages/OrderPage/orderOverView'
import OrderProcessing from "../../../components/OrderProcessing";
import EmailDetail from 'components/Emails/EmailDetail';


const OrdersStatus = (props: any) => {

	return (
		<div className="app-wrapper">
			<Switch>
				<Route exact path="/support/orders" component={OrderPage}/>
				<Route exact key="/support/orders/create" path="/support/orders/create" component={OrderProcessing}/>
				<Route exact key="/support/orders/:id/edit" path="/support/orders/:id/edit" component={OrderProcessing}/>
				<Route exact key="/support/orders/:id" path="/support/orders/:id" component={asyncComponent(() => import('../../../Pages/OrderPage/orderOverView'))} />
				<Route exact key="/support/orders/:id/emails/:notifyId" path="/support/orders/:id/emails/:notifyId" component={asyncComponent(() => import('../../../Pages/OrderPage/EmailDetail'))} />
				<Route component={asyncComponent(() => import('components/Error404'))}/>
			</Switch>
		</div>
	);
}

export default OrdersStatus;
