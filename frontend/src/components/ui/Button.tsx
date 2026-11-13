import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  type = 'button',
  ...rest
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${className}`.trim()}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <span
            style={{
              display: 'inline-block',
              width: '13px',
              height: '13px',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <span>Processing…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
