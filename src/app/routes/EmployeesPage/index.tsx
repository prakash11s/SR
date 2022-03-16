import React from 'react';
import { Route, Switch } from 'react-router-dom';

import appRoutes from './../../../routes/appRoutes';
import asyncComponent from '../../../util/asyncComponent';

const getEmployeeRoutes = () => {
    const element:any = appRoutes.admin.routes.find(route => route.path === '/admin/employees');
    if (element) {
        return element.child.map((childRoute:any) => {
            return (<Route path={childRoute.path} exact key={childRoute.path} component={childRoute.component}>
            </Route>);
        });
    }
}

const EmployeesPage = () => {
    return (
        <div className="app-wrapper">
            <Switch>
                <Route exact path="/admin/employees/" component={asyncComponent(() => import('./../../../components/EmployeesTable'))} />
                {getEmployeeRoutes()}
                <Route component={asyncComponent(() => import('components/Error404'))} />
            </Switch>
        </div>
    );
}

export default EmployeesPage;
