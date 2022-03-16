import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';

const Emails = (props:any) => {
	return (
		<div className="app-wrapper">
			<Switch>
				<Route exact path="/support/emails" component={asyncComponent(() => import('../../../components/Emails/index'))} />
				<Route exact path="/support/emails/:id" component={asyncComponent(() => import('../../../components/Emails/EmailDetail'))} />
				<Route component={asyncComponent(() => import('components/Error404'))} />
			</Switch>
		</div>
	);
}

export default Emails;
