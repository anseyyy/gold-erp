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
}) {
  const iconVariants = {
    indigo: 'bg-indigo-50/80 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50/80 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50/80 text-rose-600 border-rose-100',
    amber: 'bg-amber-50/80 text-amber-600 border-amber-100',
    sky: 'bg-sky-50/80 text-sky-600 border-sky-100',
    purple: 'bg-purple-50/80 text-purple-600 border-purple-100',
  };

  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="bg-white border border-[#E8EAF0] rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
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
        <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-tight">
          {value}
        </h3>
        {currencyUnit && (
          <p className="font-extrabold text-lg text-slate-900 tracking-tight">{currencyUnit}</p>
        )}
      </div>

      {/* Footer Trend & Subtitle */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5 w-full">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded font-bold text-[10px] border ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {isPositive ? `+${trend}%` : `${trend}%`}
            </span>
            <span className="text-slate-400 font-medium">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400 font-medium">{subtitle || 'Real-time updated'}</span>
        )}
      </div>
    </div>
  );
}

