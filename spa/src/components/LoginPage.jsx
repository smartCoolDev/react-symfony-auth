// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import LoginForm from './LoginForm';
import withRedirectionIfAuthenticated from './withRedirectionIfAuthenticated';

function LoginPage(): React$Node {
  return (
    <main>
      <h1 className="mb-4">Log in</h1>
      <div className="row">
        <div className="col col-md-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

export default withRedirectionIfAuthenticated(LoginPage);
