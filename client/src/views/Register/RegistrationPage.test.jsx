import React from 'react';
import { render } from '@testing-library/react';
import RegistrationPage from './RegistrationPage';

describe('RegistrationPage', () => {
  it('renders without crashing', () => {
    render(<RegistrationPage />);
  });

  it('renders the registration form', () => {
    const { getByPlaceholderText, getByText } = render(<RegistrationPage />);
    expect(getByPlaceholderText('Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Repeat Password')).toBeInTheDocument();
    expect(getByText('Get Started')).toBeInTheDocument();
  });
});
