// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom'

import type { Dispatch } from 'redux';

import userActionCreators from '../../../actions/userActionCreators';

import type { UserState, RootState } from '../../../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../../../actions/actionCreatorTypes.js.flow';

import Button from '../../../components/common/Button';
import '../login.css'
import { ROUTE_REGISTRATION } from '../../../constants/routeConstants';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

type State = {|
  isTouched: boolean,
  isSubmitted: boolean,
  values: {| email: string, password: string |},
  errors: { email: string, password: string },
|};

class LoginForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.validate = this.validate.bind(this);
  }

  state = {
    isTouched: false,
    isSubmitted: false,
    values: { email: '', password: '' },
    errors: { email: '', password: '' },
  };

  componentWillReceiveProps(nextProps: Props): void {
    const nextErrors = nextProps.user.loginForm.errors;
    if (Object.keys(nextErrors).length > 0) {
      const errors = this.state.errors;
      Object.keys(nextErrors).forEach((item) => {
        errors[item] = nextErrors[item][0];
      });
      this.setState({ isSubmitted: false, errors });
    }
  }

  handleChange = (event: SyntheticEvent<HTMLInputElement>): void => {
    const values = this.state.values;
    values[event.currentTarget.name] = event.currentTarget.value;
    this.setState({ values });
  }

  handleSubmitting = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.setState({ isTouched: true });
    if (!this.validate(event.currentTarget)) {
      return;
    }

    this.props.userMethods.logIn(this.state.values);
    this.setState({ isSubmitted: true });
  }

  validate: Function;
  validate(form: HTMLFormElement): boolean {
    let isValid = true;
    const errors = this.state.errors;
    [...form.elements].forEach((item) => {
      if (item.name === 'email') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        let error = '';
        if (item.value === '') {
          error = 'Please enter a value.';
          isValid = false;
        } else if (!/^.+@\S+\.\S+$/.test(item.value)) {
          error = 'Incorrect email address.';
          isValid = false;
        }
        errors[item.name] = error;
      }
      if (item.name === 'password') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        let error = '';
        if (item.value === '') {
          error = 'Please enter a value.';
          isValid = false;
        }
        errors[item.name] = error;
      }
    });
    this.setState({ errors });

    return isValid;
  }

  render(): React$Node {
    let emailInput = (
      <input
        name="email"
        value={this.state.values.email}
        className="form-control w-100"
        onChange={this.handleChange}
        placeholder='Enter your email'
        required
      />
    );
    let passwordInput = (
      <input
        type="password"
        name="password"
        value={this.state.values.password}
        className="form-control w-100"
        onChange={this.handleChange}
        required
      />
    );
    if (this.state.isTouched) {
      emailInput = React.cloneElement(
        emailInput,
        { className: this.state.errors.email !== '' ? 'form-control is-invalid w-100' : 'form-control is-valid w-100' },
      );
      passwordInput = React.cloneElement(
        passwordInput,
        { className: this.state.errors.password !== '' ? 'form-control is-invalid w-100' : 'form-control is-valid w-100' },
      );
    }

    return (
      <form onSubmit={this.handleSubmitting} noValidate>
        <div className="form-group">
          <div className='mb-4'>
            <label htmlFor="email">Email</label>
            {emailInput}
            <div className="invalid-feedback">{this.state.errors.email}</div>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            {passwordInput}
            <div className="invalid-feedback">{this.state.errors.password}</div>
          </div>
        </div>
        <Button disabled={this.state.isSubmitted} size='large'>Sign in</Button>
        <div className='d-flex justify-content-center align-items-center'>
          Don't have an account? 
          <NavLink to={ROUTE_REGISTRATION} className="nav-link signup-navlink" activeClassName="active">Sign Up</NavLink>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { user: state.user };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { userMethods: bindActionCreators(userActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
