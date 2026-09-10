'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SummaryCard({
  title,
  value,
  currencyUnit,
  subtitle,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  variant = 'indigo',
  onClick,
}) {
  const iconVariants = {
    indigo: 'bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/60',
    emerald: 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/60',
    rose: 'bg-rose-50/80 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/60',
    amber: 'bg-amber-50/80 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/60',
    sky: 'bg-sky-50/80 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-800/60',
    purple: 'bg-purple-50/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/60',
  };

  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] flex flex-col justify-between space-y-4 transition-all ${
        onClick
          ? 'cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
              iconVariants[variant] || iconVariants.indigo
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main Value Display */}
      <div>
        <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {value}
        </h3>
        {currencyUnit && (
          <p className="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight">{currencyUnit}</p>
        )}
      </div>

      {/* Footer Trend & Subtitle */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5 w-full">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded font-bold text-[10px] border ${
                isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {isPositive ? `+${trend}%` : `${trend}%`}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 font-medium">{subtitle || 'Real-time updated'}</span>
        )}
      </div>
    </div>
  );
}

