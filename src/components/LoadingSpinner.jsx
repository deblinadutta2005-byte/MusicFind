import React from 'react';
import { Music2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading musicians...', fullPage = false }) {
  const content = (
    <div className="loading-spinner-container">
      <div className="music-pulse-loader">
        <div className="pulse-ring pulse-ring-1" />
        <div className="pulse-ring pulse-ring-2" />
        <div className="pulse-icon-wrapper">
          <Music2 className="pulse-icon" size={28} />
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );

  if (fullPage) {
    return <div className="loading-page-wrapper">{content}</div>;
  }

  return content;
}
