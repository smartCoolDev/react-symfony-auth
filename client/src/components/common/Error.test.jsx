import React from 'react';
import { render } from '@testing-library/react';
import Error from './Error';

describe('Error', () => {
  it('renders without crashing', () => {
    render(<Error />);
  });

  it('renders heading and message', async () => {
    const { queryAllByRole, getByText } = render(<Error heading="Oops" message="Something went wrong." />);
    const headings = queryAllByRole('heading');
    const heading = await headings.find(h => h.textContent === 'Oops');
    expect(heading).toBeInTheDocument();
    expect(getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('renders default heading and message', async () => {
    const { queryAllByRole, getByText } = render(<Error />);
    const headings = queryAllByRole('heading');
    const heading = await headings.find(h => h.textContent === 'Error');
    expect(heading).toBeInTheDocument();
    expect(getByText('Unexpected error occurred.')).toBeInTheDocument();
  });
});
