import React from 'react';
import { render } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('renders without crashing', () => {
    render(<LoginPage />);
  });

  it('renders the login form', () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Sign in')).toBeInTheDocument();
  });
});
