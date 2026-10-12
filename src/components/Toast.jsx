import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useConnections } from '../context/ConnectionContext';

export function Toast() {
  const { toastMessage, clearToast } = useConnections();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-success" size={20} />;
      case 'error':
        return <AlertCircle className="text-danger" size={20} />;
      default:
        return <Info className="text-cyan" size={20} />;
    }
  };

  return (
    <div className={`toast-container toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={clearToast} aria-label="Close">
        <X size={16} />
      </button>
    </div>
  );
}
