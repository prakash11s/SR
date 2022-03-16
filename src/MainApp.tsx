import React from 'react';
import ReactGA from 'react-ga';
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import configureStore, { history } from './store';
import App from './containers/App';


export const store = configureStore();


ReactGA.initialize('G-7LT4QZ3FRT', {
    debug: process.env.NODE_ENV === "development",
    testmode: process.env.NODE_ENV === "development",
} as any);

history.listen((location) => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
});

const MainApp = () =>
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        </ConnectedRouter>
    </Provider>;

export default MainApp;
