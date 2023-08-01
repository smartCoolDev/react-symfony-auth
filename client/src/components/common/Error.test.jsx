import React from 'react';
import { render } from '@testing-library/react';
import Error from './Error';

describe('Error', () => {
  it('renders without crashing', () => {
    render(<Error />);
  });

  it('renders heading and message', () => {
    const { getByRole, getByText } = render(<Error heading="Oops" message="Something went wrong." />);
    expect(getByRole('heading')).toHaveTextContent('Oops');
    expect(getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('renders default heading and message', () => {
    const { getByRole, getByText } = render(<Error />);
    expect(getByRole('heading')).toHaveTextContent('Error');
    expect(getByText('Unexpected error occurred.')).toBeInTheDocument();
  });
});
