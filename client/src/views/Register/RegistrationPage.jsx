// @flow

import React from 'react';

import RegistrationForm from './Form/RegistrationForm';
import withRedirectionIfAuthenticated from '../../components/hoc/withRedirectionIfAuthenticated';

import './register.css'
  
function RegistrationPage(): React$Node {
  return (
    <main>
      <div className='register-container'>
        <h1 className="mb-4 register-caption">Create an account</h1>
        <RegistrationForm />
      </div>
      
    </main>
  );
}

export default withRedirectionIfAuthenticated(RegistrationPage);
