import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';
import OrderProcessing from '../../../components/OrderProcessing'

const OrderProcessingPage = () => {
    return (
        <div className="app-wrapper">
            <Switch>  
                <Route exact path="/support/orders/create" component={OrderProcessing} />
                <Route exact path="/support/orders/:id/edit" component={OrderProcessing} />
                <Route component={asyncComponent(() => import('../../../components/Error404'))} />
            </Switch>
        </div>
    );
}

export default OrderProcessingPage;
