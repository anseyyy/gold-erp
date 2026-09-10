'use client';

import React, { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatDate, formatIDR, formatNumber } from '@/lib/utils/formatters';
import {
  FileSpreadsheet,
  Download,
  Search,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CustomerSpreadsheetModal({
  isOpen,
  onClose,
  items = [],
  customerName = 'Customer',
  onRefresh,
}) {
  const [period, setPeriod] = useState('all'); // all, today, this_week, this_month, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, BUY, SELL
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered dataset logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Entry Type Filter
      if (typeFilter !== 'ALL' && item.entryType !== typeFilter) {
        return false;
      }

      // Payment Filter
      if (paymentFilter !== 'ALL') {
        const itemPayment = (item.payment || '').toUpperCase();
        if (!itemPayment.includes(paymentFilter.toUpperCase())) {
          return false;
        }
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const dateStr = formatDate(item.date).toLowerCase();
        const pureStr = String(item.pure || '').toLowerCase();
        const idrStr = String(item.totalIdr || '').toLowerCase();
        const usdtStr = String(item.totalDollar || '').toLowerCase();
        const notesStr = String(item.notes || item.reason || '').toLowerCase();
        const payStr = String(item.payment || '').toLowerCase();
        const match =
          dateStr.includes(q) ||
          pureStr.includes(q) ||
          idrStr.includes(q) ||
          usdtStr.includes(q) ||
          notesStr.includes(q) ||
          payStr.includes(q);
        if (!match) return false;
      }

      // Date / Period filter
      if (!item.date) return true;
      const itemDate = new Date(item.date);
      const now = new Date();

      if (period === 'today') {
        return itemDate.toDateString() === now.toDateString();
      }

      if (period === 'this_week') {
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - dayOfWeek
        );
        const endOfWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + (6 - dayOfWeek),
          23,
          59,
          59
        );
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      }

      if (period === 'this_month') {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === 'custom') {
        if (startDate && new Date(item.date) < new Date(startDate)) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (new Date(item.date) > end) return false;
        }
      }

      return true;
    });
  }, [items, period, startDate, endDate, typeFilter, paymentFilter, searchQuery]);

  // Sum calculations
  const totalPureGold = useMemo(() => {
    return filteredItems.reduce((sum, i) => sum + (Number(i.pure) || 0), 0);
  }, [filteredItems]);

  const totalIdr = useMemo(() => {
    return filteredItems.reduce((sum, i) => sum + (Number(i.totalIdr) || 0), 0);
  }, [filteredItems]);

  const totalUsdt = useMemo(() => {
    return filteredItems.reduce((sum, i) => sum + (Number(i.totalDollar) || 0), 0);
  }, [filteredItems]);

  // CSV Export handler
  const handleExportCSV = () => {
    if (filteredItems.length === 0) return;

    const headers = [
      'Row',
      'Type',
      'Date',
      'Scrap (g)',
      'Touch (%)',
      'Pure Gold (g)',
      'Payment',
      'Total IDR',
      'Total USDT',
      'Notes',
    ];
    const rows = filteredItems.map((item, index) => [
      index + 1,
      item.entryType || 'BUY',
      formatDate(item.date),
      item.scrap || 0,
      item.touch || 0,
      item.pure || 0,
      `"${item.payment || 'USDT'}"`,
      item.totalIdr || 0,
      item.totalDollar || 0,
      `"${item.notes || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const cleanCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute(
      'download',
      `Ledger_${cleanCustomerName}_${period}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${customerName} — Ledger Spreadsheet View`}
      maxWidth="max-w-6xl"
    >
      <div className="space-y-4 text-slate-800 dark:text-slate-200">
        {/* Excel Header Ribbon / Toolbar */}
        <div className="bg-emerald-800 text-white p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="text-xs font-black tracking-wide uppercase">
                Customer_{customerName.replace(/\s+/g, '_')}_Ledger.xlsx
              </h3>
              <p className="text-[10px] text-emerald-200 font-mono">
                Formula: =SUM(Filtered_Customer_Ledger) | Rows: {filteredItems.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 rounded flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1 text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 rounded flex items-center gap-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel/CSV
            </button>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Time Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Transaction Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Types (Buy & Sell)</option>
              <option value="BUY">Buy Orders Only</option>
              <option value="SELL">Sell Orders Only</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Payment Method
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Payments</option>
              <option value="USDT">USDT Only</option>
              <option value="IDR">IDR Only</option>
              <option value="CASH">Cash Only</option>
              <option value="BANK">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search date, pure gold, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded pl-8 pr-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

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
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 font-medium"
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
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 font-medium"
                />
              </div>
            </>
          )}
        </div>

        {/* Excel Spreadsheet Data Grid */}
        <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-x-auto bg-white dark:bg-slate-900 max-h-[50vh] shadow-inner font-mono text-xs">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              {/* Excel Column Letters Bar */}
              <tr className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] text-center font-bold border-b border-slate-300 dark:border-slate-700 select-none">
                <th className="w-10 border-r border-slate-300 dark:border-slate-700 bg-slate-300 dark:bg-slate-800">#</th>
                <th className="w-20 border-r border-slate-300 dark:border-slate-700">A</th>
                <th className="w-28 border-r border-slate-300 dark:border-slate-700">B</th>
                <th className="w-32 border-r border-slate-300 dark:border-slate-700">C</th>
                <th className="w-28 border-r border-slate-300 dark:border-slate-700">D</th>
                <th className="w-28 border-r border-slate-300 dark:border-slate-700">E</th>
                <th className="w-36 border-r border-slate-300 dark:border-slate-700">F</th>
                <th className="w-32 border-r border-slate-300 dark:border-slate-700">G</th>
              </tr>
              {/* Excel Table Field Headers */}
              <tr className="bg-emerald-700 text-white font-sans text-[11px] font-bold uppercase border-b border-emerald-800">
                <th className="px-2 py-2 text-center border-r border-emerald-800">Row</th>
                <th className="px-2.5 py-2 text-center border-r border-emerald-800">Type</th>
                <th className="px-3 py-2 border-r border-emerald-800">Date</th>
                <th className="px-3 py-2 border-r border-emerald-800">Scrap / Touch</th>
                <th className="px-3 py-2 border-r border-emerald-800 text-right">Pure Gold</th>
                <th className="px-3 py-2 border-r border-emerald-800 text-center">Payment</th>
                <th className="px-3 py-2 border-r border-emerald-800 text-right">Total IDR</th>
                <th className="px-3 py-2 text-right">Total USDT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-sans">
                    No ledger transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr
                    key={item._id || item.id || idx}
                    className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-2 py-2 text-center font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 select-none">
                      {idx + 1}
                    </td>
                    <td className="px-2.5 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.entryType === 'BUY'
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
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
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                      {formatNumber(item.scrap || 0)}g ({formatNumber(item.touch || 0)}%)
                    </td>
                    <td className="px-3 py-2 font-bold text-amber-600 dark:text-amber-400 text-right border-r border-slate-200 dark:border-slate-800">
                      {formatNumber(item.pure || 0)}g
                    </td>
                    <td className="px-3 py-2 text-center font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {item.payment || 'USDT'}
                    </td>
                    <td className="px-3 py-2 font-bold text-indigo-600 dark:text-indigo-400 text-right border-r border-slate-200 dark:border-slate-800">
                      {formatIDR(item.totalIdr || 0)}
                    </td>
                    <td className="px-3 py-2 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                      {formatUSD(item.totalDollar || 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Excel Bottom Formula Summary Row */}
            <tfoot className="bg-emerald-950 text-white font-sans border-t-2 border-emerald-600 font-bold">
              <tr>
                <td colSpan={4} className="px-3 py-2.5 text-right uppercase tracking-wider text-xs">
                  Filtered Ledger Totals Formula (=SUM):
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-amber-400 text-xs">
                  {formatNumber(totalPureGold)}g Pure
                </td>
                <td className="px-3 py-2.5 text-center text-xs text-emerald-300">
                  {filteredItems.length} Rows
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-indigo-300 text-xs">
                  {formatIDR(totalIdr)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-emerald-300 text-xs">
                  {formatUSD(totalUsdt)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close Spreadsheet View
          </Button>
        </div>
      </div>
    </Modal>
  );
}
