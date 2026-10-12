import React from 'react';

export function CheckboxGroup({
  label,
  options = [],
  value = [],
  onChange,
  error,
  required = false,
  className = ''
}) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (option) => {
    const next = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];
    onChange(next);
  };

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <span className="form-label">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </span>
      )}
      <div className={`checkbox-group ${error ? 'has-error' : ''}`}>
        {options.map((opt) => {
          const isObj = typeof opt === 'object' && opt !== null;
          const optVal = isObj ? opt.value : opt;
          const optLabel = isObj ? opt.label : opt;
          const isChecked = selected.includes(optVal);
          return (
            <label
              key={optVal}
              className={`checkbox-chip ${isChecked ? 'checked' : ''}`}
            >
              <input
                type="checkbox"
                value={optVal}
                checked={isChecked}
                onChange={() => toggle(optVal)}
              />
              <span>{optLabel}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
