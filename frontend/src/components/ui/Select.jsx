'use client';

import React, { forwardRef } from 'react';

const Select = forwardRef(function Select(
  {
    label,
    options = [],
    error,
    helperText,
    className = '',
    id,
    name,
    value,
    onChange,
    required = false,
    disabled = false,
    children,
    ...props
  },
  ref,
) {
  const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full h-[44px] px-[14px] rounded-[8px] border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm transition-all focus:outline-none ${
            error
              ? 'border-rose-400 focus:border-2 focus:border-rose-500'
              : 'border-[#D1D5DB] dark:border-slate-800 focus:border-2 focus:border-[#298EFF] dark:focus:border-indigo-500'
          } ${disabled ? 'bg-slate-100 dark:bg-slate-800/60 cursor-not-allowed opacity-60' : ''} ${className}`}
          {...props}
        >
          {children
            ? children
            : options.map((opt) => {
                const optValue = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={optValue} value={optValue} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    {optLabel}
                  </option>
                );
              })}
        </select>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

export default Select;
