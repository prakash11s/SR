import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';


const EmailPage = () => {
    return (
        <div className="app-wrapper">
            <Switch>
                <Route exact path="/support/email" component={asyncComponent(() => import('../../routes/mail/basic'))} />                      
                <Route component={asyncComponent(() => import('../../../components/Error404'))} />
            </Switch>
        </div>
    );
}

export default EmailPage;
