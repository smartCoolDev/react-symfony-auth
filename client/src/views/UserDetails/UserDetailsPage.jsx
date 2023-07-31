// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import type { Dispatch } from 'redux';

import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';
import userActionCreators from '../../actions/userActionCreators';
import { getValueAlias } from '../../utils/userHelper';
import Button from '../../components/common/Button';

import type { UserState, RootState } from '../../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../../actions/actionCreatorTypes.js.flow';

import './details.css'

type Router = {| +match: Object |};

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = Router & MappedState & MappedDispatch;

type State = {|
  isLoaded: boolean,
  attributes: {
    id?: number,
    name?: string,
    email?: string,
    status?: number,
    houseNumber?: string,
    streetAddress?: string,
    city?: string,
    postcode?: string,
    createdAt?: Date,
  },
  error: string | null,
|};

class UserDetailsPage extends React.Component<Props, State> {
  state = {
    isLoaded: false,
    attributes: {},
    error: null,
    isTouched: false,
    isSubmitted: false,
    values: {
      name: '',
      email: '',
      houseNumber: '',
      streetAddress: '',
      city: '',
      postcode: ''
    },
    errors: {
      name: '',
      email: '',
      houseNumber: '',
      streetAddress: '',
      city: '',
      postcode: ''
    }
  };
  constructor(props: Props): void {
    super(props);
    this.validate = this.validate.bind(this);
  }
  componentDidMount(): void {
    this.props.userMethods.viewOne(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.user.details.updatedAt !== this.props.user.details.updatedAt) {
      const message = nextProps.user.details.message;
      if (message !== null) {
        this.setState({ isLoaded: true, error: message });
        return;
      }
      const attributes = nextProps.user.details.attributes;
      if (Object.keys(attributes).length > 0) {
        this.setState({
          isLoaded: true,
          attributes: { ...attributes },
          values: {
            name: attributes.name || '',
            email: attributes.email || '',
            houseNumber: attributes.houseNumber || '',
            streetAddress: attributes.streetAddress || '',
            city: attributes.city || '',
            postcode: attributes.postcode || ''
          }
        });
      }
    }
  }
  
  validate: Function;
  validate(form: HTMLFormElement): boolean {
    let isValid = true;
    const errors = this.state.errors;
    if (form && form.elements) {
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
      });
    this.setState({ errors });
    }
    return isValid;
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
    this.props.userMethods.updateDetails(this.props.match.params.id, this.state.values);
    this.setState({ isSubmitted: true });
  }

  render(): React$Node {
    const attributes = this.state.attributes;
    if (this.state.isLoaded) {
      const error = this.state.error;
      if (error !== null) {
        return <Error message={error} />;
      }
      let emailInput = (
      <input
        name="email"
        value={this.state.values.email}
        className="form-control"
        onChange={this.handleChange}
        placeholder='Email'
        required
      />
      );
      let nameInput = (
        <input
          name="name"
          value={this.state.values.name}
          className="form-control"
          onChange={this.handleChange}
          placeholder='Name'
          required
        />
      );
      let houseNumberInput = (
        <input
          name="houseNumber"
          value={this.state.values.houseNumber}
          className="form-control"
          onChange={this.handleChange}
          placeholder='100'
        />
      );
      let streetAddressInput = (
        <input
          name="streetAddress"
          value={this.state.values.streetAddress}
          className="form-control"
          onChange={this.handleChange}
          placeholder='Street Name'
        />
      );
      let cityInput = (
        <input
          name="city"
          value={this.state.values.city}
          className="form-control"
          onChange={this.handleChange}
          placeholder='London'
        />
      );
      let postCodeInput = (
        <input
          name="postcode"
          value={this.state.values.postcode}
          className="form-control"
          onChange={this.handleChange}
          placeholder='Postcode'
        />
      );
      if (this.state.isTouched) {
        emailInput = React.cloneElement(
          emailInput,
          { className: this.state.errors.email !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
        );
        nameInput = React.cloneElement(
          nameInput,
          { className: this.state.errors.name !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
        );
        houseNumberInput = React.cloneElement(
          houseNumberInput,
          { className: this.state.errors.houseNumber !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
        );
        streetAddressInput = React.cloneElement(
          streetAddressInput,
          { className: this.state.errors.streetAddress !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
        );
        cityInput = React.cloneElement(
          cityInput,
          { className: this.state.errors.city !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
        );
        postCodeInput = React.cloneElement(
          postCodeInput,
          { className: this.state.errors.postcode !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
        );
      }
      return (
        <main>
          <h1 className='details-caption'>My Details</h1>
          <h1 className='details-subcaption mb-4'>Update your personal details</h1>
          <form onSubmit={this.handleSubmitting} noValidate>
            <div className="form-group">
              <div className='border-bottom mb-4 align-items-end justify-content-between d-flex'>
                <label htmlFor="email">Name</label>
                {nameInput}
              </div>
                <div className="invalid-feedback">{this.state.errors.name}</div>
              <div className='border-bottom mb-4 align-items-end justify-content-between d-flex'>
                <label htmlFor="email">Email address</label>
                {emailInput}
                <div className="invalid-feedback">{this.state.errors.email}</div>
              </div>
              <div className='border-bottom mb-4 align-items-end justify-content-between d-flex'>
                <label htmlFor="houseNumber">House Number</label>
                {houseNumberInput}
                <div className="invalid-feedback">{this.state.errors.houseNumber}</div>
              </div>
              <div className='border-bottom mb-4 align-items-end justify-content-between d-flex'>
                <label htmlFor="streetAddress">Street address</label>
                {streetAddressInput}
                <div className="invalid-feedback">{this.state.errors.streetAddress}</div>
              </div>
              <div className='border-bottom mb-4 align-items-end justify-content-between d-flex'>
                <label htmlFor="city">City</label>
                {cityInput}
                <div className="invalid-feedback">{this.state.errors.city}</div>
              </div>
              <div className='border-bottom mb-4 align-items-end justify-content-between d-flex'>
                <label htmlFor="postcode">Postcode</label>
                {postCodeInput}
                <div className="invalid-feedback">{this.state.errors.postcode}</div>
              </div>
              <div className='d-flex justify-content-end'>
                <Button className='mr-4' onClick={(e) => e.preventDefault()}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          </form>
        </main>
      );
    }

    return <Loading />;
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { user: state.user };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { userMethods: bindActionCreators(userActionCreators, dispatch) };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDetailsPage));
