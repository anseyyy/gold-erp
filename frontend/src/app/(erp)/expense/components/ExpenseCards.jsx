'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { Receipt, DollarSign, Wallet, FileSpreadsheet } from 'lucide-react';
import Button from '@/components/ui/Button';

const formatUSDT = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatIDR = (val = 0) =>
  `Rp ${Number(val || 0).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

export default function ExpenseCards({
  totalUsdt = 0,
  totalIdr = 0,
  totalCount = 0,
  onOpenSpreadsheet,
}) {
  return (
    <div className="space-y-4">
      {/* Top Header Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Operational Expenses
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Log overhead, rent, utility, and operating cost entries with live ledger totals.
          </p>
        </div>

        <Button
          type="button"
          variant="pastelPrimary"
          icon={FileSpreadsheet}
          onClick={onOpenSpreadsheet}
          className="shadow-sm"
        >
          View Expense Spreadsheet
        </Button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total USDT Expense Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Total USDT Expense
            </span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/60 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
              {formatUSDT(totalUsdt)}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Cumulative USDT outbound
            </p>
          </div>
        </div>

        {/* Total IDR Expense Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Total IDR Expense
            </span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60 shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
              {formatIDR(totalIdr)}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Cumulative IDR outbound
            </p>
          </div>
        </div>

        {/* Total Expense Entries Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Expense Records
            </span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
              {totalCount} <span className="text-sm font-semibold text-slate-500">entries</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Recorded transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
