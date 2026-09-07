'use client';

import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    rightElement,
    className = '',
    id,
    type = 'text',
    required = false,
    disabled = false,
    placeholder = '',
    value,
    onChange,
    name,
    ...props
  },
  ref,
) {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5 shrink-0" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full h-[44px] px-[14px] py-[14px] rounded-[8px] border bg-white text-slate-800 text-sm placeholder:text-slate-400 transition-all focus:outline-none ${
            Icon ? 'pl-10' : ''
          } ${rightElement ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 focus:border-2 focus:border-rose-500'
              : 'border-[#D1D5DB] focus:border-2 focus:border-[#298EFF]'
          } ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : ''} ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

export default Input;
