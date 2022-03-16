import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import appRoutes from './../../../routes/appRoutes';
import asyncComponent from '../../../util/asyncComponent';
import { ACCESS_ADMIN_ROLES_ROUTE } from "./../../../rbac/abilities.constants";
  import RBACContext from "./../../../rbac/rbac.context";

//   HIDING IT FOR FURURE USE
// const getRolesRoutes = () => {
//     const element = appRoutes.admin.routes.find(route => route.path === '/admin/roles');
//     if (element) {
//         return element.child.map((childRoute) => {
//             return (<Route path={childRoute.path} exact key={childRoute.path} component={childRoute.component}>
//             </Route>);
//         });
//     }
// }

const RolesPage = () => {
    return (
        <div className="app-wrapper">
            <Switch>
            <RBACContext.Consumer>
                        {({ userCan, abilities }:any) => (
                            userCan(abilities, ACCESS_ADMIN_ROLES_ROUTE) ? <Route exact path="/admin/roles/" component={asyncComponent(() => import('./../../../components/RolesOverview'))} /> : <Route component={asyncComponent(() => import('components/Error404'))} />
                        )}
                </RBACContext.Consumer>
                {/* {getRolesRoutes()} */}
                <Route component={asyncComponent(() => import('components/Error404'))} />
            </Switch>
        </div>
    );
}

export default RolesPage;

