import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  required,
  ...rest
}) => {
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  const describedBy = [error ? errorId : '', helperText && !error ? helpId : '']
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && (
            <span className="form-required" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <input
        id={id}
        className={`form-input${error ? ' has-error' : ''} ${className}`.trim()}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      />
      {error ? (
        <p id={errorId} role="alert" className="form-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p id={helpId} className="form-helper">{helperText}</p>
      ) : null}
    </div>
  );
};
