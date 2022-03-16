import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';

const UsefulLinks = (props:any) => {
	return (
		<div className="app-wrapper">
			<Switch>
				<Route exact path="/support/useful-links" component={localStorage.getItem('department') === 'vehicles' ? asyncComponent(() => import('../../../components/UsefulLinks')) : asyncComponent(() => import('components/Error404'))} />
				<Route exact path="/support/useful-links/haynes-test-page" component={localStorage.getItem('department') === 'vehicles' ? asyncComponent(() => import('../../../components/HaynesPage')) : asyncComponent(() => import('components/Error404'))} />
				<Route component={asyncComponent(() => import('components/Error404'))} />
			</Switch>
		</div>
	);
}

export default UsefulLinks;
