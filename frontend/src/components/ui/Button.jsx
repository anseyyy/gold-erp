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
    'inline-flex items-center justify-center font-medium rounded-[8px] border border-[#D1D5DB] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#298EFF] to-[#F859DD] text-white hover:opacity-90 active:opacity-100 shadow-xs focus:ring-[#298EFF]',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400 shadow-2xs',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400 shadow-2xs',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 border-transparent focus:ring-slate-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 shadow-xs focus:ring-rose-500',
  };

  const sizes = {
    sm: 'h-[36px] text-xs px-3 gap-1.5',
    md: 'h-[44px] text-sm px-4 gap-2',
    lg: 'h-[48px] text-base px-5 gap-2.5',
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
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
