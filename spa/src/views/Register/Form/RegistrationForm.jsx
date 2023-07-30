// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import type { Dispatch } from 'redux';

import { URL_APP_ACCOUNT_ACTIVATION_CONFIRMATION } from '../../../constants/callConstants';
import userActionCreators from '../../../actions/userActionCreators';

import type { UserState, RootState } from '../../../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../../../actions/actionCreatorTypes.js.flow';

import Button from '../../../components/common/Button';
import '../register.css'
import { ROUTE_LOGIN } from '../../../constants/routeConstants';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

type State = {|
  isTouched: boolean,
  isSubmitted: boolean,
  values: {| email: string, password: string, passwordRepeat: string |},
  errors: { email: string, password: string, passwordRepeat: string },
|};

function getDefaultState(): State {
  return {
    isTouched: false,
    isSubmitted: false,
    values: { name: '', email: '', password: '', passwordRepeat: '' },
    errors: { name:'',  email: '', password: '', passwordRepeat: '' },
  };
}

class RegistrationForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.validate = this.validate.bind(this);
  }

  state = getDefaultState();

  componentWillReceiveProps(nextProps: Props): void {
    const nextErrors = nextProps.user.registrationForm.errors;
    if (Object.keys(nextErrors).length > 0) {
      const errors = this.state.errors;
      Object.keys(nextErrors).forEach((item) => {
        errors[item] = nextErrors[item][0];
      });
      this.setState({ isSubmitted: false, errors });
    }

    if (nextProps.user.registrationForm.reset) {
      this.setState(getDefaultState());
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

    const data = {
      name: this.state.values.name,
      email: this.state.values.email,
      password: this.state.values.password,
      appURL: URL_APP_ACCOUNT_ACTIVATION_CONFIRMATION,
    };
    this.props.userMethods.register(data);
    this.setState({ isSubmitted: true });
  }

  validate: Function;
  validate(form: HTMLFormElement): boolean {
    let isValid = true;
    const errors = this.state.errors;
    let password = '';
    [...form.elements].forEach((item) => {
      if (item.name === 'name') {
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
        password = item.value;
        errors[item.name] = error;
      }
      if (item.name === 'passwordRepeat') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        let error = '';
        if (item.value !== password) {
          error = 'Passwords are not the same.';
          isValid = false;
        }
        errors[item.name] = error;
      }
    });
    this.setState({ errors });

    return isValid;
  }

  render(): React$Node {
    let nameInput = (
      <input
        name="name"
        value={this.state.values.name}
        className="form-control"
        placeholder='Name'
        onChange={this.handleChange}
        required
      />
    );
    let emailInput = (
      <input
        name="email"
        placeholder='Email'
        value={this.state.values.email}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    let passwordInput = (
      <input
        placeholder='Password'
        type="password"
        name="password"
        value={this.state.values.password}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    let passwordRepeatInput = (
      <input
        type="password"
        name="passwordRepeat"
        value={this.state.values.passwordRepeat}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    if (this.state.isTouched) {
      emailInput = React.cloneElement(
        emailInput,
        { className: this.state.errors.email !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
      passwordInput = React.cloneElement(
        passwordInput,
        { className: this.state.errors.password !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
      passwordRepeatInput = React.cloneElement(
        passwordRepeatInput,
        { className: this.state.errors.passwordRepeat !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
    }

    return (
      <form onSubmit={this.handleSubmitting} noValidate>
        <div className="form-group">
          <div className='mb-4'>
            {nameInput}
            <div className="invalid-feedback">{this.state.errors.email}</div>
          </div>         
          <div className="mb-4">
            {emailInput}
            <div className="invalid-feedback">{this.state.errors.email}</div>
          </div>
          <div className="mb-4">
            {passwordInput}
            <div className="invalid-feedback">{this.state.errors.password}</div>
          </div>
          <Button className='mb-4' disabled={this.state.isSubmitted} size='large'>Get Started</Button>
          <div className='d-flex justify-content-center align-items-center'>
            Already have an account? 
          <NavLink to={ROUTE_LOGIN} className="nav-link signup-navlink" activeClassName="active">Log in</NavLink>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
