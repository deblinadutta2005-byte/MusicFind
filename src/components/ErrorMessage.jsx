import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorMessage({
  message = 'Unable to load data. Please try again.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`error-box ${className}`} role="alert">
      <div className="error-icon-box">
        <AlertCircle size={24} className="text-danger" />
      </div>
      <div className="error-content">
        <h4 className="error-title">Something went wrong</h4>
        <p className="error-text">{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon={RefreshCw}
            className="mt-3"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
