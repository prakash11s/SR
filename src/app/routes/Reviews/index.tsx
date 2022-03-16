import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';

const Reviews = (props:any) => {
	return (
		<div className="app-wrapper">
			<Switch>
				<Route exact path="/support/reviews" component={asyncComponent(() => import('../../../components/Reviews'))} />
				<Route exact path="/support/reviews/:id/edit" component={asyncComponent(() => import('../../../components/Reviews/editReview'))} />
				<Route component={asyncComponent(() => import('components/Error404'))} />
			</Switch>
		</div>
	);
}

export default Reviews;
