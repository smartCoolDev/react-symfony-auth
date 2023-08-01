import React from 'react';
import { render } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
  it('renders without crashing', () => {
    render(<Loading />);
  });

  it('renders the SVG element', () => {
    const { getByRole } = render(<Loading />);
    expect(getByRole('img')).toBeInTheDocument();
  });

  it('applies default props', () => {
    const { getByRole } = render(<Loading />);
    const svg = getByRole('img');
    expect(svg).toHaveAttribute('width', '30px');
    expect(svg).toHaveAttribute('height', '30px');
  });
});
