import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';


const Subscriptions = () => {
    return (
        <div className="app-wrapper">
            <Switch>
                <Route exact path="/support/subscriptions" component={asyncComponent(() => import('../../../components/subscriptions'))} />
                <Route component={asyncComponent(() => import('../../../components/Error404'))} />
            </Switch>
        </div>
    );
}

export default Subscriptions;
