import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  required = false,
  className = '',
  disabled = false,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <div className={`select-container ${error ? 'has-error' : ''}`}>
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="form-select"
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const isObj = typeof opt === 'object' && opt !== null;
            const optVal = isObj ? opt.value : opt;
            const optLabel = isObj ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown className="select-icon" size={18} />
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
