import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';
import CampaignOverView from "../../../components/Marketing/CampaignOverview";
import EmailsOpen from "../../../components/Marketing/EmailsOpen";
import Campaign from "../../../components/Marketing/Campaign";
import EmailUnsubscribe from "../../../components/Marketing/EmailUnsubscribe";
import OutboxMessages from "../../../components/Marketing/OutboxMessages";
import EmailTemplate from "../../../components/Marketing/EmailTemplate";
/**
 * Sample page has been rendered temporarily, this should be replaced with the actual components once they are created
 */
const MarketingPage = () => {
 return (
  <Switch>
    <Route exact path="/marketing" component={asyncComponent(() => import('../SamplePage'))} />
    <Route exact path="/marketing/campaigns" component={CampaignOverView} />
    <Route exact path="/marketing/campaigns/:id" component={Campaign} />
    <Route exact path="/marketing/campaigns/:id/opens" component={EmailsOpen} />
    <Route exact path="/marketing/campaigns/:id/unsubscribe" component={EmailUnsubscribe} />
    <Route exact path="/marketing/campaigns/:id/outbox" component={OutboxMessages} />
    <Route exact path="/marketing/email-template" component={EmailTemplate} />
    <Route exact component={asyncComponent(() => import('../../../components/Error404'))} />
  </Switch>
 );
}

export default MarketingPage;
