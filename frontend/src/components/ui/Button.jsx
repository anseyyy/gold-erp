'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs focus:ring-indigo-500 active:bg-indigo-800',
    pastelPrimary:
      'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 focus:ring-indigo-500',
    pastelSuccess:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 focus:ring-emerald-500',
    pastelDanger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 focus:ring-rose-500',
    pastelWarning:
      'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 focus:ring-amber-500',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-400',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs focus:ring-slate-400',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-xs px-3.5 py-2 gap-2',
    lg: 'text-sm px-4 py-2.5 gap-2',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
