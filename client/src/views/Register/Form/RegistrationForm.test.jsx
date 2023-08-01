import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RegistrationForm from './RegistrationForm';

const mockStore = configureStore([]);

describe('RegistrationForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        registrationForm: {
          errors: {},
          reset: false,
        },
      },
    });
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <RegistrationForm />
      </Provider>,
    );
  });

  it('submits the form when all fields are valid', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <RegistrationForm />
      </Provider>,
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Repeat Password'), { target: { value: 'password123' } });

    fireEvent.click(getByText('Get Started'));

    expect(store.getActions()).toContainEqual({ type: 'REGISTER_REQUEST', payload: { name: 'John Doe', email: 'john.doe@example.com', password: 'password123' } });
  });

  it('displays validation errors when fields are invalid', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <RegistrationForm />
      </Provider>,
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: '' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '' } });
    fireEvent.change(getByPlaceholderText('Repeat Password'), { target: { value: 'password123' } });

    fireEvent.click(getByText('Get Started'));

    expect(getByText('Please enter a value.')).toBeInTheDocument();
    expect(getByText('Incorrect email address.')).toBeInTheDocument();
    expect(getByText('Passwords are not the same.')).toBeInTheDocument();
  });
});
