import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import 'assets/vendors/style';
import defaultTheme from './themes/defaultTheme';
import AppLocale  from '../lngProvider/index';
import MainApp from '../app/index';
import { getUser, setInitUrl, setUserOnline } from '../actions/Actions/Auth';
import RTL from 'util/RTL';
import axios from 'util/Api';
import {
  base64URLEncode,
  sha256
} from '../util/react-pkce/helpers/sha256-base64-url-encode';
import createCodeVerifier from '../util/react-pkce/helpers/create-code-verifier';
import getEncodedVerifierKey from '../util/react-pkce/helpers/getEncodedVerifierKey';
import hashed from '../util/react-pkce/helpers/hashed';
import { getCodeFromLocation } from '../util/react-pkce/helpers/getCodeFromLocation';
import { getVerifierFromStorage } from '../util/react-pkce/helpers/getVerifierFromStorage';
import { fetchToken } from '../util/react-pkce/helpers/fetchToken';
import { removeCodeFromLocation } from '../util/react-pkce/helpers/removeCodeFromLocation';
import { removeVerifierFromStorage } from '../util/react-pkce/helpers/removeVerifierFromStorage';
import Login from '../containers/Login/Login';
import AutoLogin from '../containers/AutoLogin';
import Loader from './Loader/Loader';
import Error404 from './PageNotFound/Error404';
import RBACContext from "../rbac/rbac.context";
import RBAC from "../rbac/rbac.service";
import Helmet from 'react-helmet';
import WebSocket from '../services/webSocket.service';

declare var window: any;
const userCan = (abilities:any, ability:any) => {
  const isAllowed = RBAC.isAllowed(abilities, ability);
  if (!isAllowed) {
    console.debug(`User is missing the required permission: ${ability}`);
  }
  return isAllowed;
};

const RestrictedRoute = ({ component: Component, token, matchUrl, abilities, ...rest }:any) => (
  <Route
    {...rest}
    render={props =>
      token
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />}
  />
);

const partnerScopes = ['administer.account.access', 'partner.access'];
const dashboardScopes = ['administer.account.access', 'access.dashboard'];
const clientId = process.env.REACT_APP_CLIENT_ID;
const provider = process.env.REACT_APP_PROVIDER;
const redirectUri = window.location.origin;// process.env.REACT_APP_REDIRECT_URI;
const homePage = window.location.hostname.split('.')[0] === "partners" ? '/partner' : '/support';
const tokenEndpoint = process.env.REACT_APP_TOKEN_ENDPOINT;

class App extends Component <any,any>{
  constructor(props:any) {
    super(props);

    this.state = {
      loading: false,
      sendAuthUserRequest: true,
      websocketInit: false,
    };
  }

  componentDidMount() {
    const { history: { location: { pathname } } } :any= this.props;
    ReactGA.set({ page: pathname });
    ReactGA.pageview(pathname);
  }

  componentWillMount() {
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
    if (this.props.initURL === '') {
      this.props.setInitUrl(this.props.history.location.pathname);
    }
  }

  componentWillReceiveProps(nextProps:any) {
    // TODO: Remove componentWillReceiveProps - React does not recommend
    if (nextProps.token && !nextProps.token.error) {
      axios.defaults.headers.common['Authorization'] =
        nextProps.token.token_type + ' ' + nextProps.token.access_token;
    }
    if (nextProps.authUser && nextProps.token.access_token && !this.state.websocketInit) {
      // Initializing Web Socket
		  WebSocket.initWebSocket(window.location.href.indexOf("partner") > 0, nextProps.authUser.id, nextProps.token.access_token, this.props.setUserOnline);
      this.setState({
        websocketInit: true
      });
    }

    if (nextProps.token && !nextProps.authUser && this.state.sendAuthUserRequest) {
      this.props.getUser();
      this.setState({
        sendAuthUserRequest: false
      });
    }
  }
  // componentDidUpdate(prevProps, prevState) {
  //   let department = localStorage.getItem("department")
  //   let locale = localStorage.getItem("locale")
  //   locale = JSON.parse(locale)
  //
  //   if (department) {
  //     axios.defaults.headers['X-Department'] = department
  //   }
  //   axios.defaults.headers['X-Country'] = locale ? locale["ISO"] : "3166-1NL"
  // }

  componentDidCatch(error:any, info:any) {
    // Display fallback UI
    this.setState({ loading: false });
  }

  verifyCodeAndVerifier(code:any, verifier:any) {
    fetchToken({
      clientId,
      tokenEndpoint,
      code,
      verifier,
      redirectUri
    })
      .then(tokenResponse => {
        localStorage.setItem('token', JSON.stringify(tokenResponse));
        return tokenResponse;
      })
      .then(() => {
        removeCodeFromLocation();
        removeVerifierFromStorage({ clientId, localStorage });
        // localStorage.
        const redirectLocation = localStorage.getItem('redirect_location');
        if (redirectLocation !== null) {
          localStorage.removeItem('redirect_location');
          window.location.href = redirectLocation;
        }
      })
      .catch(e => {
        this.setState({
          loading: false
        });
      });
  }

  /**
   * Navigate to the auth endpoint
   */
  authorizeUser(loginType?:any) {
    localStorage.setItem('redirect_location', homePage);

    const encodedVerifier = base64URLEncode(createCodeVerifier());

    // set the item
    localStorage.setItem(getEncodedVerifierKey(clientId), encodedVerifier);

    const query:any = {
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge: base64URLEncode(sha256(encodedVerifier)),
      code_challenge_method: 'S256'
    };
    if (loginType === 'facebook') {
      query.method = 'facebook';
    }
    if (loginType === 'linkedin') {
      query.method = 'linkedin';
    }
    const isPartnerLogin = window.location.hostname.split('.')[0] === "partners";

    if (!isPartnerLogin && dashboardScopes && dashboardScopes.length > 0) {
      query.scope = dashboardScopes.join(' ');
    } else if (isPartnerLogin && partnerScopes && partnerScopes.length > 0) {
      query.scope = partnerScopes.join(' ');
    }
    const url = `${provider}/authorize?${hashed(query)}`;

    window.location.href = url;

    return this.setState({
      loading: false
    });
  }

  // On click of service right login button
  onServiceRightClick = (loginType:any) => {
    const { token } = this.props;
    this.authorizeUser(loginType);
    // start loading so user dont get 4O4 Error it will only stops if componet is going to redirect or component gets an error
    this.setState({
      loading: true
    });
    if (token === null) {
      const code = getCodeFromLocation({ location: window.location });
      const verifier = getVerifierFromStorage({ clientId, localStorage });
      if (code && verifier) {
        this.verifyCodeAndVerifier(code, verifier);
      }
    } else if (token.error) {
      this.authorizeUser();
    } else {
      // if everything goes well it will redirect on sample-page
      return this.setState(
        {
          loading: false
        },
        () => <Redirect to={homePage} />
      );
    }
  };
  render() {
    const {
      location,
      locale,
      token,
      isDirectionRTL,
      authUser,
      department,
      isloading
    } = this.props;

    if (location.pathname === '/auto-login' && this.state.loading) {
      return <Loader />;
    }
    if ((location.pathname === '/' || location.pathname === '/auto-login' || location.pathname === "/login") && !this.state.loading) {
      if (token === null) {
        const code = getCodeFromLocation({ location: window.location });
        const verifier = getVerifierFromStorage({ clientId, localStorage });
        if (code && verifier && this.state.loading === false) {
          this.setState({
            loading: true
          });
          this.verifyCodeAndVerifier(code, verifier);
        }
      } else {
        // the user has a token redirect the user
        return (<Redirect to={homePage} />)
      }
    }
    const applyTheme = createMuiTheme(defaultTheme as any);

    if (isDirectionRTL) {
      applyTheme.direction = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
      applyTheme.direction = 'ltr';
    }


    // @ts-ignore
    const currentAppLocale = AppLocale[locale.locale];
    const { loading } = this.state;
    const url = location.pathname.split('/');
    let matchUrl = url.length > 1 ? `/${url[1]}` : '/';
    return (
      <RBACContext.Provider value={{ userCan, abilities: (authUser && authUser.abilities) || [] } as any}>
        <MuiThemeProvider theme={applyTheme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <IntlProvider
              locale={locale.locale}
              messages={currentAppLocale.messages}
            >
              <RTL>
                { authUser && authUser.id &&
                  <Helmet>
                    <meta name="authenticated-user-id" content={`${authUser.id}`} />
                  </Helmet>
                }
                <div className='app-main'>
                  {((this.state.loading || isloading || !authUser || department.error) && token) ? (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      position: 'absolute',
                      top: '40%',
                    }}>
                      <h1>{department.error ? department.error : authUser ? 'Redirecting to ServiceRight' : 'Welcome back Signin you in'}</h1>
                      {department.error ? null : <Loader />}
                    </div>
                  ) : (
                      <Switch>
                        {matchUrl !== '/' && matchUrl !== '/auto-login' && matchUrl !== '/login' && <RestrictedRoute path={matchUrl} token={token} component={MainApp} />}

                        {/*// the login url*/}
                        <Route exact path='/' component={() => (
                          // onServiceRightClick is the props of Login component and it will
                          // pass an event when user clicks on "Login with ServiceRight" Button
                          <Login onServiceRightClick={this.onServiceRightClick} />
                        )}
                        />
                        {/*// the auto-login url*/}
                        <Route exact path='/auto-login' component={() => (
                          <AutoLogin onServiceRightClick={this.onServiceRightClick} />
                        )}/>
                        <Route exact path='/login' component={() => (
                          <Redirect to="/auto-login" />
                        )}/>
                        <Route component={() => <Error404 loading={loading} />} />
                      </Switch>
                    )}
                </div>
              </RTL>
            {/*{localStorage.getItem('token') && <SidePanel/>}*/}
            </IntlProvider>
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </RBACContext.Provider>
    );
  }
}

const mapStateToProps = ({ settings, auth, department, commonData }:any) => {
  const { sideNavColor, locale, isDirectionRTL } = settings;
  const { authUser, token, initURL } = auth;
  const { loading } = commonData;
  return { sideNavColor, token, locale, isDirectionRTL, authUser, initURL, department, isloading: loading };
};

export default connect(mapStateToProps, { setInitUrl, getUser, setUserOnline })(App);
