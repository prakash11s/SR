import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/Header/index';
import Sidebar from 'containers/SideNav/index';
import Footer from 'components/Footer';
import StagingNavBar from 'components/StagingNavBar';
import {
  ABOVE_THE_HEADER,
  BELOW_THE_HEADER,
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION,
} from 'constants/ActionTypes';
import { isIOS, isMobile } from 'react-device-detect';
import asyncComponent from '../util/asyncComponent';
import TopNav from 'components/TopNav';
import appRoutes from "../routes/appRoutes";
import NotificationComponent from 'common/Notification/index';
import CustomerDetail from 'components/Customers';

class App extends React.Component <any, any>{

  render() {
    const { match, drawerType, navigationStyle, horizontalNavPosition, show, message, url }:any = this.props;
    const drawerStyle = drawerType.includes(FIXED_DRAWER) ? 'fixed-drawer' : drawerType.includes(COLLAPSED_DRAWER) ? 'collapsible-drawer' : 'mini-drawer';

    //set default height and overflow for iOS mobile Safari 10+ support.
    if (isIOS && isMobile) {
      document.body.classList.add('ios-mobile-view-height')
    }
    else if (document.body.classList.contains('ios-mobile-view-height')) {
      document.body.classList.remove('ios-mobile-view-height')
    }

    return (
      <div className={`app-container ${drawerStyle}`}>
        <StagingNavBar />
        <NotificationComponent show={show} message={message} url={url} />
        <Sidebar />
        <div className="app-main-container">
          <div
            className={`app-header ${navigationStyle === HORIZONTAL_NAVIGATION ? 'app-header-horizontal' : ''}`}>
            {(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === ABOVE_THE_HEADER) &&
              <TopNav />}
            <Header />
            {(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === BELOW_THE_HEADER) &&
              <TopNav />}
          </div>
          <main className="app-main-content-wrapper">
            <div className="app-main-content">
              <Switch>
                {appRoutes[match.url.substring(1)] && appRoutes[match.url.substring(1)].routes.map(route => {
                  const { child, id, icon, ...properties } = route;
                  return (<Route key={route.path} {...properties} />);
                })
                }
                <Route exact path="/support/customers/:uuid" component={CustomerDetail}/>
                <Route component={asyncComponent(() => import('components/Error404'))} />
              </Switch>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ settings, notificationState }) => {
  const { drawerType, navigationStyle, horizontalNavPosition } = settings;
  const { show, message, url } = notificationState;
  return { drawerType, navigationStyle, horizontalNavPosition, show, message, url }
};

export default withRouter(connect(mapStateToProps,null)(App));
