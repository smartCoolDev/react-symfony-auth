// @flow

import React from 'react';

import RegistrationForm from './Form/RegistrationForm';
import withRedirectionIfAuthenticated from '../../components/hoc/withRedirectionIfAuthenticated';

function RegistrationPage(): React$Node {
  return (
    <main>
      <h1 className="mb-4">Register</h1>
      <div className="row">
        <div className="col col-md-6">
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}

export default withRedirectionIfAuthenticated(RegistrationPage);
