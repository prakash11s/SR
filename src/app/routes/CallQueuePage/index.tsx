import React from 'react';
import { Route, Switch } from 'react-router-dom';
import appRoutes from './../../../routes/appRoutes';

import asyncComponent from '../../../util/asyncComponent';

const getOrderRoutes = () => {
    const element: any = appRoutes.support.routes.find(route => route.path === '/support/call-queues');
    if (element) {
        return element.child.map((childRoute: any) => {
            return (<Route path={childRoute.path} exact key={childRoute.path} component={childRoute.component}>
            </Route>
            );
        });
    }
}


const CallQueuePage = () => {
    return (
        <div className="app-wrapper">
            <Switch>
                <Route exact path="/support/call-queues/" component={asyncComponent(() => import('../../../components/CallQueueTable'))}/>
                <Route exact path="/support/call-queues/:id/edit" component={asyncComponent(() => import('../../../components/CallQueueIdEdit'))} />
                <Route exact path = "/support/call-queues/:id/entries" component = {asyncComponent(() => import('../../../components/CallQueueIdEntries'))} />
                <Route exact path="/support/call-queues/:id/entries/:entry" component={asyncComponent(() => import('../../../components/CallQueueEntriesDetails'))} />
                <Route exact path="/support/call-queues/error/403" component={asyncComponent(() => import('../../../components/Error403'))} />
                {getOrderRoutes()}
                <Route component={asyncComponent(() => import('../../../components/Error404'))} />
            </Switch>
        </div>
    );
}


export default CallQueuePage;
