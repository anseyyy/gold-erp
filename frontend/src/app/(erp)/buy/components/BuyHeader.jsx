'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import SummaryCard from '@/components/dashboard/SummaryCard';
import Link from 'next/link';
import { ShoppingBag, UserPlus, Plus, Search, Filter, ChevronUp, FileSpreadsheet, User, X } from 'lucide-react';
import { formatIDR } from '@/lib/utils/formatters';

export default function BuyHeader({
  totalBuyAmount = 0,
  onAddCustomer,
  isFormOpen = false,
  onToggleForm,
  searchQuery = '',
  setSearchQuery,
  paymentFilter = 'ALL',
  setPaymentFilter,
  customers = [],
  selectedClientFilter = 'ALL',
  setSelectedClientFilter,
}) {
  return (
    <div className="space-y-4">
      {/* Header Title & Top Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            General Buy Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Customer gold procurement & buy transactions with real-time rate calculations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/spreadsheet?module=buy">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              className="border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold"
            >
              View Buy Spreadsheet Page
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
            {isFormOpen ? 'Close Buy Form' : '+ Record Buy Order'}
          </Button>
        </div>
      </div>

      {/* Summary Metric Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title={selectedClientFilter !== 'ALL' ? `Total Buy Amount (${selectedClientFilter})` : "Total Buy Amount"}
          value={formatIDR(totalBuyAmount)}
          subtitle={selectedClientFilter !== 'ALL' ? `Filtered buy total for ${selectedClientFilter}` : "Cumulative buy total value (IDR)"}
          icon={ShoppingBag}
          variant="indigo"
        />
      </div>

      {/* Repositioned Full-Width Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search buy transactions by customer name, pure gold, IDR amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
          {/* Select Client Dropdown */}
          <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 rounded-lg px-3 py-1.5 text-xs font-semibold">
            <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Client:</span>
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter?.(e.target.value)}
              className="bg-transparent text-xs font-bold text-indigo-900 dark:text-indigo-200 focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="ALL">All Clients</option>
              {customers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {selectedClientFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedClientFilter?.('ALL')}
                className="ml-1 p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded text-indigo-700 dark:text-indigo-300"
                title="Clear Client Filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter?.(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="USDT">USDT Only</option>
              <option value="IDR">IDR Only</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

