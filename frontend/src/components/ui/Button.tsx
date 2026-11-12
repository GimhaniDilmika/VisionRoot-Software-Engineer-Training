import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  type = 'button',
  ...rest
}) => {
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <span
            style={{
              display: 'inline-block',
              width: '14px',
              height: '14px',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite',
            }}
            aria-hidden="true"
          />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
