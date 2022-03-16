import {applyMiddleware, compose, createStore} from 'redux';
import reducers from '../reducers/Reducers';
import {createBrowserHistory} from 'history'
import {routerMiddleware} from 'connected-react-router';
import thunk from 'redux-thunk';
declare var window: any;
const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);

const middlewares = [thunk, routeMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store:any

export default function configureStore(initialState?:any | undefined) {
  store = createStore(reducers(history), initialState,
      composeEnhancers(applyMiddleware(...middlewares)));
  if ((module as any).hot) {
    // Enable Webpack hot module replacement for reducers
    (module as any).hot.accept('../reducers/Reducers/index', () => {
      const nextRootReducer = require('../reducers/Reducers');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
export {history, store};
