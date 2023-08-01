import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Click me</Button>);
  });

  it('renders children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('applies default props', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('variant', 'primary');
    expect(button).toHaveAttribute('size', 'medium');
    expect(button).not.toHaveAttribute('disabled');
  });

  it('applies variant prop', () => {
    const { getByRole } = render(<Button variant="secondary">Click me</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('variant', 'secondary');
  });

  it('applies size prop', () => {
    const { getByRole } = render(<Button size="small">Click me</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('size', 'small');
  });

  it('applies disabled prop', () => {
    const { getByRole } = render(<Button disabled>Click me</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });

  it('calls onClick prop when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);
    const button = getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
