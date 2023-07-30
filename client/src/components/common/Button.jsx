// @flow
import * as React from 'react';

type Props = {
  children: React.Node,
  variant?: 'primary' | 'secondary',
  size?: 'small' | 'medium' | 'large',
  disabled?: boolean,
  onClick?: () => void,
  className?: string
};

class Button extends React.Component<Props> {
  static defaultProps = {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  };

  render() {
    const { children, variant, size, disabled, className, onClick } = this.props;

    return (
      <button onClick={onClick} className={className}>
        {children}
        <style>{`
          button {
            padding: ${size === 'small' ? '10px 16px' : size === 'medium' ? '10px 20px' : '15px 30px'};
            width: ${size === 'large' ? '100%' : 'auto'};
            font-size: 14px;
            color: #344054;
            cursor: ${disabled ? 'not-allowed' : 'pointer'};
            border-radius: 8px;
            border: 1px solid #D0D5DD;
            background: #FFF;
            box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
          }

          button:hover {
            border-radius: 8px;
            border: 1px solid #CC5200;
            background: #CC5200;
            color: white;
            box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
          }
        `}</style>
      </button>
    );
  }
}

export default Button;
