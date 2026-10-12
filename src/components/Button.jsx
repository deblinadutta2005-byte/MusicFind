import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'glass'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-block' : ''} ${className}`;

  return (
    <button
      type={type}
      className={baseClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="btn-loading-wrapper">
          <span className="btn-spinner" />
          <span>{loadingText || 'Please wait...'}</span>
        </span>
      ) : (
        <>
          {Icon && <Icon className="btn-icon" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
