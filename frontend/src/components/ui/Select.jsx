'use client';

import React from 'react';

export default function Select({
  label,
  options = [],
  error,
  className = '',
  id,
  children,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full bg-white text-slate-900 text-sm rounded-md border transition-all duration-150 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            error
              ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-500'
              : 'border-slate-200 hover:border-slate-300'
          } ${className}`}
          {...props}
        >
          {children
            ? children
            : options.map((opt) => {
                const value = typeof opt === 'object' ? opt.value : opt;
                const label = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
        </select>
      </div>
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
