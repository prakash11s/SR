import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';

const PhoneSystemPage = (props:any) => {
  return (
    <div className="app-wrapper">
      <Switch>
        <Route exact path="/support/phone-system/call-histories" component={asyncComponent(() => import('../PhoneSystem/basic'))} />
          <Route component={asyncComponent(() => import('components/Error404'))} />
      </Switch>
    </div>
  );
}

export default PhoneSystemPage;
