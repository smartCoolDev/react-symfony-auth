import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from './LoginForm';

const mockStore = configureStore([]);

describe('LoginForm', () => {
  it('renders without crashing', () => {
    const initialState = { user: { loginForm: { errors: {} } } };
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
  });

  it('displays validation error messages when submitting with empty fields', () => {
    const initialState = { user: { loginForm: { errors: {} } } };
    const store = mockStore(initialState);
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
    fireEvent.submit(getByText('Sign in'));
    expect(getByText('Please enter a value.')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your email')).toHaveClass('is-invalid');
    expect(getByPlaceholderText('Password')).toHaveClass('is-invalid');
  });

  it('displays validation error message when submitting with invalid email', () => {
    const initialState = { user: { loginForm: { errors: {} } } };
    const store = mockStore(initialState);
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
    fireEvent.change(getByPlaceholderText('Enter your email'), { target: { value: 'invalid-email' } });
    fireEvent.submit(getByText('Sign in'));
    expect(getByText('Incorrect email address.')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your email')).toHaveClass('is-invalid');
  });

  it('dispatches logIn action when submitting with valid fields', () => {
    const logIn = jest.fn();
    const userMethods = { logIn };
    const initialState = { user: { loginForm: { errors: {} } } };
    const store = mockStore(initialState);
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginForm userMethods={userMethods} />
      </Provider>
    );
    fireEvent.change(getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.submit(getByText('Sign in'));
    expect(logIn).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });
});
