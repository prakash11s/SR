import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import { useSelector } from "react-redux";
import appRoutes from '../../../../src/routes/appRoutes';
import asyncComponent from '../../../util/asyncComponent';
import PartnerInvoiceList from '../../../components/PartnerInvoices';
import PartnerSubscriptions from '../../../components/PartnerSubscriptions';
import PartnerServices from '../../../components/ServicesList/PartnerServices';
import PartnerSubscriptionsDetails from '../../../components/PartnerSubscriptions/PartnerSubscriptionsDetails';
import PartnerOrderOverview from 'components/PartnerView/PartnerOrderOverview';


const getPartnerRoutes = () => {
    const element: any = appRoutes.support.routes.find(route => route.path === '/partner');
    if (element) {
        return element.child.map((childRoute) => {
            return (<Route path={childRoute.path} exact key={childRoute.path} component={childRoute.component}>
            </Route>
            );
        });
    }
}

const PartnerPage = () => {

    // const checkPartnerPermission = useSelector((state: any) => state.partnerSettingState.accessCheck);
    return (
        <div>
            {/* {checkPartnerPermission === 'show' ? */}
                <Switch>
                    <Route exact path="/partner/dashboard" component={asyncComponent(() => import('../../../components/PartnerView/Dashboard'))} />
                    <Route exact path="/partner/orders/processing" component={asyncComponent(() => import('../../../components/PartnerView'))} />
                    <Route exact path="/partner/orders/scheduled" component={asyncComponent(() => import('../../../components/PartnerView'))} />
                    <Route exact path="/partner/orders/completed" component={asyncComponent(() => import('../../../components/PartnerView'))} />
                    <Route exact path="/partner/orders/awaiting_completion" component={asyncComponent(() => import('../../../components/PartnerView'))} />
                    <Route exact path="/partner/orders/cancelled" component={asyncComponent(() => import('../../../components/PartnerView'))} />
                    <Route exact path="/partner/orders/:id" component={PartnerOrderOverview} />
                    <Route exact path="/partner/orders/processing/:id" component={PartnerOrderOverview} />
                    {/* <Route exact path="/partner/employees" component={asyncComponent(() => import('../../../components/PartnerEmployees/employees/basic'))} /> */}
                    <Route exact path="/partner/employees" component={asyncComponent(() => import('../../../components/PartnerEmployees'))} />
                    <Route exact path="/partner/subscriptions" component={PartnerSubscriptions} />
                    <Route exact path="/partner/subscriptions/:id" component={PartnerSubscriptionsDetails} />
                    <Route exact path="/partner/services" component={PartnerServices} />
                    <Route exact path="/partner/invoices" component={PartnerInvoiceList} />
                    <Route exact path="/partner/invoices/:id" component={asyncComponent(() => import('../../../components/PartnerInvoices/PartnerInvoiceDetail'))} />
                    <Route exact path="/partner/invoices/:id/cancel" component={asyncComponent(() => import('../../../components/PartnerInvoices/fail'))} />
                    <Route exact path="/partner/invoices/:id/success" component={asyncComponent(() => import('../../../components/PartnerInvoices/success'))} />
                    <Route exact path="/partner/settings" component={asyncComponent(() => import('../../../components/PartnerSettingsOverview'))} />
                    <Route exact path="/partner/settings/payout-methods" component={asyncComponent(() => import('../../../components/PartnerPayout'))} />
                    {/* <Route exact path="/partner/settings/employees" component={asyncComponent(() => import('../../../components/PartnerEmployees'))} /> */}
                    <Route exact path="/partner/settings/error/404" component={asyncComponent(() => import('../../../components/Error404'))} />
                    {getPartnerRoutes()}
                </Switch>{/*  :
                checkPartnerPermission === 'hide' ?
                <Switch>
                    <Route exact path="/partner/error/403" component={asyncComponent(() => import('../../../components/Error403'))} />
                    <Route component={asyncComponent(() => import('../../../components/Error403'))} />
                </Switch> : ''
            } */}
        </div>
    );
}

export default PartnerPage;