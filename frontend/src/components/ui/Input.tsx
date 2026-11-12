import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  helperText,
  required = false,
  className = '',
  ...rest
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-indicator" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`form-input ${error ? 'has-error' : ''} ${className}`}
        {...rest}
      />
      {error && (
        <div id={errorId} className="form-error" role="alert">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {helperText && !error && (
        <div id={helperId} className="form-helper">
          {helperText}
        </div>
      )}
    </div>
  );
};
