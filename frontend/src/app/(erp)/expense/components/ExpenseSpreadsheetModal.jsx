'use client';

import React, { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/formatters';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Calendar,
  RefreshCw,
} from 'lucide-react';

export default function ExpenseSpreadsheetModal({
  isOpen,
  onClose,
  items = [],
  onRefresh,
}) {
  const [period, setPeriod] = useState('all'); // all, today, this_week, this_month, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered dataset logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Currency filter
      if (currencyFilter !== 'ALL' && item.currency !== currencyFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const reasonMatch = item.reason?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        if (!reasonMatch && !descMatch) return false;
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
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - dayOfWeek), 23, 59, 59);
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
  }, [items, period, startDate, endDate, currencyFilter, searchQuery]);

  // Sum calculations
  const totalUsdt = useMemo(() => {
    return filteredItems
      .filter((i) => i.currency === 'USDT')
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  }, [filteredItems]);

  const totalIdr = useMemo(() => {
    return filteredItems
      .filter((i) => i.currency === 'IDR')
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  }, [filteredItems]);

  // CSV Export handler
  const handleExportCSV = () => {
    if (filteredItems.length === 0) return;

    const headers = ['Row', 'Date', 'Reason', 'Description', 'Amount', 'Currency'];
    const rows = filteredItems.map((item, index) => [
      index + 1,
      formatDate(item.date),
      `"${item.reason || ''}"`,
      `"${item.description || ''}"`,
      item.amount,
      item.currency || 'USDT',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Expense_Report_${period}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Expense Ledger Spreadsheet View"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-4 text-slate-800 dark:text-slate-200">
        {/* Excel Header Ribbon / Toolbar */}
        <div className="bg-emerald-800 text-white p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="text-xs font-black tracking-wide uppercase">
                Expense_Sheet_Master.xlsx
              </h3>
              <p className="text-[10px] text-emerald-200 font-mono">
                Formula: =SUM(Filtered_Expenses) | Rows: {filteredItems.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 rounded flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
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
              Currency
            </label>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Currencies</option>
              <option value="USDT">USDT Only</option>
              <option value="IDR">IDR Only</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Search Description / Reason
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter by keyword (e.g. Office rent)..."
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
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              {/* Excel Column Letters Bar */}
              <tr className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] text-center font-bold border-b border-slate-300 dark:border-slate-700 select-none">
                <th className="w-12 border-r border-slate-300 dark:border-slate-700 bg-slate-300 dark:bg-slate-800">#</th>
                <th className="w-28 border-r border-slate-300 dark:border-slate-700">A</th>
                <th className="w-48 border-r border-slate-300 dark:border-slate-700">B</th>
                <th className="border-r border-slate-300 dark:border-slate-700">C</th>
                <th className="w-32 border-r border-slate-300 dark:border-slate-700">D</th>
                <th className="w-24 border-r border-slate-300 dark:border-slate-700">E</th>
              </tr>
              {/* Excel Table Field Headers */}
              <tr className="bg-emerald-700 text-white font-sans text-[11px] font-bold uppercase border-b border-emerald-800">
                <th className="px-2 py-2 text-center border-r border-emerald-800">Row</th>
                <th className="px-3 py-2 border-r border-emerald-800">Date</th>
                <th className="px-3 py-2 border-r border-emerald-800">Reason</th>
                <th className="px-3 py-2 border-r border-emerald-800">Description</th>
                <th className="px-3 py-2 border-r border-emerald-800 text-right">Amount</th>
                <th className="px-3 py-2 text-center">Currency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                    No expense records match the selected filters.
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
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                      {item.reason}
                    </td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                      {item.description || '—'}
                    </td>
                    <td className="px-3 py-2 font-bold text-rose-600 dark:text-rose-400 text-right border-r border-slate-200 dark:border-slate-800">
                      {Number(item.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-center font-bold">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                          item.currency === 'USDT'
                            ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {item.currency || 'USDT'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Excel Bottom Formula Summary Row */}
            <tfoot className="bg-emerald-950 text-white font-sans border-t-2 border-emerald-600 font-bold">
              <tr>
                <td colSpan={4} className="px-3 py-2.5 text-right uppercase tracking-wider text-xs">
                  Filtered Totals Formula (=SUM):
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-emerald-400 text-sm">
                  {totalUsdt > 0 && <div>${totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT</div>}
                  {totalIdr > 0 && <div>Rp {totalIdr.toLocaleString()} IDR</div>}
                  {totalUsdt === 0 && totalIdr === 0 && '$0.00'}
                </td>
                <td className="px-3 py-2.5 text-center text-xs text-emerald-300">
                  {filteredItems.length} Records
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
