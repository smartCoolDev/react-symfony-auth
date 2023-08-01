import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { push } from 'react-router-redux';
import withRedirectionIfAuthenticated from './withRedirectionIfAuthenticated';

const MockComponent = () => <div>Mock component</div>;

describe('withRedirectionIfAuthenticated', () => {
  const mockStore = configureStore();
  const initialState = { user: { identity: { id: null } } };
  const store = mockStore(initialState);

  it('renders without crashing', () => {
    const WithRedirectionIfAuthenticated = withRedirectionIfAuthenticated(MockComponent);
    render(
      <Provider store={store}>
        <WithRedirectionIfAuthenticated />
      </Provider>
    );
  });

  it('dispatches push action if user is authenticated', () => {
    const dispatch = jest.fn();
    const user = { identity: { id: 1 } };
    const WithRedirectionIfAuthenticated = withRedirectionIfAuthenticated(MockComponent);
    render(
      <Provider store={store}>
        <WithRedirectionIfAuthenticated user={user} dispatch={dispatch} />
      </Provider>
    );
    expect(dispatch).toHaveBeenCalledWith(push(ROUTE_LOGIN));
  });

  it('does not dispatch push action if user is not authenticated', () => {
    const dispatch = jest.fn();
    const user = { identity: { id: null } };
    const WithRedirectionIfAuthenticated = withRedirectionIfAuthenticated(MockComponent);
    render(
      <Provider store={store}>
        <WithRedirectionIfAuthenticated user={user} dispatch={dispatch} />
      </Provider>
    );
    expect(dispatch).not.toHaveBeenCalled();
  });
});
