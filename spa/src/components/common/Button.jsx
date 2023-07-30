// @flow
import * as React from 'react';

type Props = {
  children: React.Node,
  variant?: 'primary' | 'secondary',
  size?: 'small' | 'medium' | 'large',
  disabled?: boolean,
  onClick?: () => void,
};

class Button extends React.Component<Props> {
  static defaultProps = {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  };

  render() {
    const { children, variant, size, disabled, onClick } = this.props;

    return (
      <button onClick={onClick}>
        {children}
        <style jsx>{`
          button {
            padding: ${size === 'small' ? '5px 10px' : size === 'medium' ? '10px 20px' : '15px 30px'};
            font-size: ${size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px'};
            background-color: ${variant === 'primary' ? '#007bff' : '#6c757d'};
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: ${disabled ? 'not-allowed' : 'pointer'};
            opacity: ${disabled ? 0.5 : 1};
          }
        `}</style>
      </button>
    );
  }
}

export default Button;
