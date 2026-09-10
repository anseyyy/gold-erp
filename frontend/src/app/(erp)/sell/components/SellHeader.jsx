'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import SummaryCard from '@/components/dashboard/SummaryCard';
import Link from 'next/link';
import { ShoppingBag, UserPlus, Plus, Search, Filter, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { formatIDR } from '@/lib/utils/formatters';

export default function SellHeader({
  totalSellAmount = 0,
  onAddCustomer,
  isFormOpen = false,
  onToggleForm,
  searchQuery = '',
  setSearchQuery,
  paymentFilter = 'ALL',
  setPaymentFilter,
}) {
  return (
    <div className="space-y-4">
      {/* Header Title & Top Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            General Sell Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Customer gold sales with real-time rate calculations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/spreadsheet?module=sell">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              className="border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold"
            >
              View Sell Spreadsheet Page
            </Button>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={UserPlus}
            onClick={onAddCustomer}
          >
            + Add Customer
          </Button>

          <Button
            type="button"
            variant="pastelPrimary"
            size="sm"
            icon={isFormOpen ? ChevronUp : Plus}
            onClick={onToggleForm}
            className="shadow-sm"
          >
            {isFormOpen ? 'Close Sell Form' : '+ Record Sell Order'}
          </Button>
        </div>
      </div>

      {/* Summary Metric Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Sell Amount"
          value={formatIDR(totalSellAmount)}
          subtitle="Cumulative sell total value (IDR)"
          icon={ShoppingBag}
          variant="emerald"
        />
      </div>

      {/* Repositioned Full-Width Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search sell transactions by customer name, pure gold, IDR amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter?.(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="USDT">USDT Only</option>
            <option value="IDR">IDR Only</option>
          </select>
        </div>
      </div>
    </div>
  );
}
