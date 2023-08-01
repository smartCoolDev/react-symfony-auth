import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });

  it('renders the review link', () => {
    const { queryAllByText } = render(<Footer />);
    const reviewLinks = queryAllByText('review');
    expect(reviewLinks.length).toBeGreaterThan(0);
});

});
