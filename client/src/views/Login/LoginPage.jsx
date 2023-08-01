// @flow

import React from 'react';
import LoginForm from './Form/LoginForm';
import withRedirectionIfAuthenticated from '../../components/hoc/withRedirectionIfAuthenticated';

import './login.css';

function LoginPage(): React$Node {
  return (
    <main className='d-flex flex-column align-items-center login-container'>
      <h1 className="mb-4 login-caption">Log in to your account</h1>
      <span className='welcome-text mb-4'>Welcome back! Please enter your details.</span>
        <LoginForm />
    </main>
  );
}

export default withRedirectionIfAuthenticated(LoginPage);
