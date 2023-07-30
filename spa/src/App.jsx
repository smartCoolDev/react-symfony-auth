// @flow

import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';

import type { Dispatch } from 'redux';

import Error401Page from './views/Error/Error401Page';
import Error403Page from './views/Error/Error403Page';
import Error404Page from './views/Error/Error404Page';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoginPage from './views/Login/LoginPage';
import RegistrationPage from './views/Register/RegistrationPage';
import UserDetailsPage from './views/UserDetails/UserDetailsPage';
import withError404 from './components/hoc/withError404';
import {
  ROUTE_LOGIN,
  ROUTE_REGISTRATION,
  ROUTE_USER_DETAILS,
} from './constants/routeConstants';
import appActionCreators from './actions/appActionCreators';

import type { AppState, RootState } from '../reducers/reducerTypes.js.flow';
import type { AppActionCreators } from '../actions/actionCreatorTypes.js.flow';

type Router = {| +location: Object |};

type MappedState = {| +app: AppState |};

type MappedDispatch = {| +appMethods: AppActionCreators |};

type Props = Router & MappedState & MappedDispatch;

class App extends React.Component<Props> {
  constructor(props: Props): void {
    super(props);
    this.getAlerts = this.getAlerts.bind(this);
  }

  getAlerts: Function;
  getAlerts(): React$Node {
    const alerts = [];
    this.props.app.notifications.forEach((item, index) => {
      if (!item.redirect) {
        const alert = (
          <div key={Symbol(index).toString()} className={`alert alert-${item.tag} fade show`}>
            <button type="button" className="close" onClick={this.handleAlertClosing} data-index={index}>
              <span aria-hidden="true">&times;</span>
            </button>
            {item.message}
          </div>
        );
        alerts.push(alert);
      }
    });

    return alerts.length > 0 ? alerts : null;
  }

  handleAlertClosing = (event: SyntheticEvent<HTMLButtonElement>): void => {
    const index = Number(event.currentTarget.dataset.index);
    this.props.appMethods.removeNotification(index);
  }

  render(): React$Node {
    if (this.props.app.errorCode === 401) {
      return <Error401Page />;
    }
    if (this.props.app.errorCode === 403) {
      return <Error403Page />;
    }
    if (this.props.app.errorCode === 404) {
      return <Error404Page />;
    }

    const alerts:React$Element<'div'> = (
      <div className="fixed-top w-50 mt-4 mr-4 ml-auto">
        {this.getAlerts()}
      </div>
    );

    return (
      <div>
        {alerts.props.children !== null ? alerts : null}
        <Header />
        <div className="container d-flex justify-content-center">
            <Switch>
              <Route exact path={ROUTE_LOGIN} component={LoginPage} />
              <Route exact path={ROUTE_REGISTRATION} component={RegistrationPage} />
              <Route exact path={ROUTE_USER_DETAILS} component={UserDetailsPage} />
              <Route component={withError404(() => (null))} />
            </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { app: state.app };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { appMethods: bindActionCreators(appActionCreators, dispatch) };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
