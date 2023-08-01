import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Header from './Header';

const mockStore = configureStore([]);

describe('Header', () => {
  it('renders without crashing', () => {
    const initialState = { user: { identity: { id: null } } };
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
  });

  it('renders the login and registration links when user is not authenticated', () => {
    const initialState = { user: { identity: { id: null } } };
    const store = mockStore(initialState);
    const { getByText } = render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    expect(getByText('Log in')).toBeInTheDocument();
    expect(getByText('Register')).toBeInTheDocument();
  });

  it('renders the logout link when user is authenticated', () => {
    const initialState = { user: { identity: { id: 1 } } };
    const store = mockStore(initialState);
    const { getByText } = render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    expect(getByText('Log out')).toBeInTheDocument();
  });

  it('dispatches logOut action when clicking on logout link', () => {
    const logOut = jest.fn();
    const userMethods = { logOut };
    const initialState = { user: { identity: { id: 1 } } };
    const store = mockStore(initialState);
    const { getByText } = render(
      <Provider store={store}>
        <Header userMethods={userMethods} />
      </Provider>
    );
    fireEvent.click(getByText('Log out'));
    expect(logOut).toHaveBeenCalled();
  });
});
