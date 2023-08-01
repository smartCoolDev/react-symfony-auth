import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });

  it('renders the review link', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('review')).toBeInTheDocument();
  });
});
