import React from 'react';
import {Route, Switch} from 'react-router-dom';
import appRoutes from '../../../../src/routes/appRoutes';
import asyncComponent from '../../../util/asyncComponent';

const getEditRoutes = () => {
    const element:any = appRoutes.support.routes.find(route => route.path === '/support/companies');
    if (element) {
        return element.child.map((childRoute) => {
            return (<Route path={childRoute.path} exact key={childRoute.path} component={childRoute.component}>
            </Route>
            );
        });
    }
}

const CompaniesPage = () => {
    return (
        <div className="app-wrapper">
            <Switch>
                <Route exact path="/support/companies" component={asyncComponent(() => import('../../../components/Companies'))} />
                <Route exact path="/support/companies/maps" component={asyncComponent(() => import('../../../components/Maps'))} />
                <Route exact path="/support/companies/error/403" component={asyncComponent(() => import('../../../components/Error403'))} /> 
                <Route exact path="/support/companies/create" component={asyncComponent(() => import('../../../components/Companies/CompaniesCreate'))} />
                <Route exact path="/support/companies/error/404" component={asyncComponent(() => import('../../../components/Error404'))} />
                <Route exact path="/support/companies/:id/edit" component={asyncComponent(() => import('../../../components/Companies/CompaniesEdit'))} />
                <Route exact path="/support/companies/:id/" component={asyncComponent(() => import('../../../components/Companies/Companies'))} />
				<Route exact path="/support/companies/:id/services" component={asyncComponent(() => import('../../../components/ServicesList/index'))} />
                <Route exact path="/support/companies/:id/invoices/:invoiceId" component={asyncComponent(() => import('../../../components/Companies/InvoiceDetail'))} />
                <Route exact path="/support/companies/:id/:activeTab/" component={asyncComponent(() => import('../../../components/Companies/Companies'))} />
                <Route exact path="/support/companies/:id/:activeTab/:activeTabId" component={asyncComponent(() => import('../../../components/Companies/Companies'))} />
                <Route exact path="/support/companies/:id/:activeTab/:activeTabId/activeTabEdit" component={asyncComponent(() => import('../../../components/Companies/Companies'))} />
                {getEditRoutes()}
                <Route component={asyncComponent(() => import('../../../components/Error404'))} />
            </Switch>
        </div>
    );
}

export default CompaniesPage;