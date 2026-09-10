'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, formatIDR, formatNumber } from '@/lib/utils/formatters';
import { customerLedgerApi } from '@/lib/api';
import CustomerSpreadsheetModal from './CustomerSpreadsheetModal';
import {
  User,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  FileSpreadsheet,
  Layers,
  RefreshCw,
  Filter,
  Calendar,
} from 'lucide-react';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CustomerLedgerView({ customerName }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'buy', 'sell'
  const [period, setPeriod] = useState('all'); // 'all', 'today', 'this_week', 'this_month', 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpreadsheetOpen, setIsSpreadsheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    summaryMetrics: {},
    buys: [],
    sells: [],
    combinedLedger: [],
  });

  const decodedName = useMemo(() => {
    return customerName ? decodeURIComponent(customerName) : '';
  }, [customerName]);

  const loadLedger = () => {
    if (!decodedName) return;
    setIsLoading(true);
    customerLedgerApi
      .getByName(decodedName)
      .then((res) => {
        setData({
          summaryMetrics: res.summaryMetrics || {},
          buys: res.buys || [],
          sells: res.sells || [],
          combinedLedger: res.combinedLedger || [],
        });
      })
      .catch((err) => {
        console.error('Failed to load customer ledger page:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadLedger();
  }, [decodedName]);

  const metrics = data.summaryMetrics || {};

  // Filtered transactions based on tab, period, payment filter, and search query
  const filteredItems = useMemo(() => {
    let list = [];
    if (activeTab === 'buy') list = data.buys.map((i) => ({ ...i, entryType: 'BUY' }));
    else if (activeTab === 'sell') list = data.sells.map((i) => ({ ...i, entryType: 'SELL' }));
    else list = data.combinedLedger;

    return list.filter((i) => {
      // Payment filter
      if (paymentFilter !== 'ALL') {
        const itemPayment = (i.payment || '').toUpperCase();
        if (!itemPayment.includes(paymentFilter.toUpperCase())) {
          return false;
        }
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const dateStr = formatDate(i.date).toLowerCase();
        const pureStr = String(i.pure || '').toLowerCase();
        const idrStr = String(i.totalIdr || '').toLowerCase();
        const usdtStr = String(i.totalDollar || '').toLowerCase();
        const notesStr = String(i.notes || '').toLowerCase();
        const payStr = String(i.payment || '').toLowerCase();
        const match =
          dateStr.includes(q) ||
          pureStr.includes(q) ||
          idrStr.includes(q) ||
          usdtStr.includes(q) ||
          notesStr.includes(q) ||
          payStr.includes(q);
        if (!match) return false;
      }

      // Time Period / Date Filter
      if (!i.date) return true;
      const itemDate = new Date(i.date);
      const now = new Date();

      if (period === 'today') {
        if (itemDate.toDateString() !== now.toDateString()) return false;
      } else if (period === 'this_week') {
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - dayOfWeek), 23, 59, 59);
        if (itemDate < startOfWeek || itemDate > endOfWeek) return false;
      } else if (period === 'this_month') {
        if (itemDate.getMonth() !== now.getMonth() || itemDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (period === 'custom') {
        if (startDate && new Date(i.date) < new Date(startDate)) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (new Date(i.date) > end) return false;
        }
      }

      return true;
    });
  }, [data, activeTab, period, startDate, endDate, paymentFilter, searchQuery]);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Action & Breadcrumb Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Customer Ledger — <span className="text-indigo-600 dark:text-indigo-400">{decodedName}</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Complete buy & sell order history, gold balances, and transaction ledger.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Customer Spreadsheet Button */}
          <button
            onClick={() => router.push(`/spreadsheet?module=all&customer=${encodeURIComponent(decodedName)}`)}
            className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Open Excel Spreadsheet Page</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={loadLedger}
          >
            Refresh
          </Button>
          <Button
            variant="pastelPrimary"
            size="sm"
            onClick={() => router.push('/buy')}
          >
            Buy Account
          </Button>
          <Button
            variant="pastelSuccess"
            size="sm"
            onClick={() => router.push('/sell')}
          >
            Sell Account
          </Button>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-[#E8EAF0] dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
              Filter Transactions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="indigo" className="text-xs px-2.5 py-0.5 font-bold">
              {metrics.totalBuyOrders || 0} Buys
            </Badge>
            <Badge variant="emerald" className="text-xs px-2.5 py-0.5 font-bold">
              {metrics.totalSellOrders || 0} Sells
            </Badge>
            <Badge variant="purple" className="text-xs px-2.5 py-0.5 font-bold">
              {filteredItems.length} Showing
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Time Period Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Time Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Payment Method
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Payments</option>
              <option value="USDT">USDT Only</option>
              <option value="IDR">IDR Only</option>
              <option value="CASH">Cash Only</option>
              <option value="BANK">Bank Transfer</option>
            </select>
          </div>

          {/* Search Query Filter */}
          <div className={period === 'custom' ? 'lg:col-span-2' : 'lg:col-span-2'}>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by pure gold, payment, IDR/USDT amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Custom Date Pickers */}
          {period === 'custom' && (
            <>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-900 dark:text-slate-100"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pure Gold Traded */}
        <div className="bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
            Pure Gold Traded
          </span>
          <h3 className="font-extrabold text-2xl text-amber-600 dark:text-amber-400">
            {formatNumber(metrics.totalPureGoldSold || 0)}g
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Bought: {formatNumber(metrics.totalPureGoldBought || 0)}g
          </p>
        </div>

        {/* Net Pure Gold Balance */}
        <div className="bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
            Net Pure Gold Balance
          </span>
          <h3
            className={`font-extrabold text-2xl ${
              (metrics.netPureGoldBalance || 0) >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatNumber(metrics.netPureGoldBalance || 0)}g
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Sells − Buys pure gold
          </p>
        </div>

        {/* Total IDR Volume */}
        <div className="bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
            Total IDR Volume
          </span>
          <h3 className="font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
            {formatIDR((metrics.totalIdrSellVolume || 0) + (metrics.totalIdrBuyVolume || 0))}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Combined IDR transactions
          </p>
        </div>

        {/* Total USDT Volume */}
        <div className="bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-[0_2px_4px_rgba(15,23,42,0.02)] space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
            Total USDT Volume
          </span>
          <h3 className="font-extrabold text-2xl text-sky-600 dark:text-sky-400">
            {formatUSD((metrics.totalUsdtSellVolume || 0) + (metrics.totalUsdtBuyVolume || 0))}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Combined USDT transactions
          </p>
        </div>
      </div>

      {/* Main Ledger Table Card with Tabs */}
      <Card
        header={
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" /> All Ledger Transactions ({data.combinedLedger.length})
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
                activeTab === 'buy'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-indigo-500" /> Buy Orders ({data.buys.length})
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
                activeTab === 'sell'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-500" /> Sell Orders ({data.sells.length})
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-medium">
              Loading customer ledger transactions...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 font-medium">
              No transaction records found for {decodedName} matching criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-[#E8EAF0] dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Scrap / Touch</th>
                  <th className="px-4 py-3">Pure Gold</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Total IDR</th>
                  <th className="px-4 py-3 text-right">Total USDT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0] dark:divide-slate-800">
                {filteredItems.map((item, idx) => (
                  <tr key={item._id || item.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-black text-[10px] ${
                          item.entryType === 'BUY'
                            ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {item.entryType === 'BUY' ? (
                          <ArrowDownLeft className="w-3 h-3 text-indigo-500" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                        )}
                        {item.entryType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono">
                      {formatNumber(item.scrap || 0)}g ({formatNumber(item.touch || 0)}%)
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {formatNumber(item.pure || 0)}g
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                      {item.payment || 'USDT'}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700 dark:text-indigo-400 text-right">
                      {formatIDR(item.totalIdr || 0)}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-right">
                      {formatUSD(item.totalDollar || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Customer Spreadsheet Modal */}
      <CustomerSpreadsheetModal
        isOpen={isSpreadsheetOpen}
        onClose={() => setIsSpreadsheetOpen(false)}
        items={data.combinedLedger}
        customerName={decodedName}
        onRefresh={loadLedger}
      />
    </div>
  );
}
