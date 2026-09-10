'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { formatDate, formatIDR, formatNumber } from '@/lib/utils/formatters';
import { customerLedgerApi } from '@/lib/api';
import {
  User,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Scale,
  DollarSign,
  Layers,
} from 'lucide-react';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CustomerLedgerModal({
  isOpen,
  onClose,
  customerName,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'buy', 'sell'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    summaryMetrics: {},
    buys: [],
    sells: [],
    combinedLedger: [],
  });

  useEffect(() => {
    if (isOpen && customerName) {
      setIsLoading(true);
      customerLedgerApi
        .getByName(customerName)
        .then((res) => {
          setData({
            summaryMetrics: res.summaryMetrics || {},
            buys: res.buys || [],
            sells: res.sells || [],
            combinedLedger: res.combinedLedger || [],
          });
        })
        .catch((err) => {
          console.error('Failed to load customer ledger:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, customerName]);

  const metrics = data.summaryMetrics || {};

  // Filtered transactions based on active tab and search query
  const filteredItems = useMemo(() => {
    let list = [];
    if (activeTab === 'buy') list = data.buys.map((i) => ({ ...i, entryType: 'BUY' }));
    else if (activeTab === 'sell') list = data.sells.map((i) => ({ ...i, entryType: 'SELL' }));
    else list = data.combinedLedger;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter((i) => {
      const dateStr = formatDate(i.date).toLowerCase();
      const pureStr = String(i.pure || '').toLowerCase();
      const idrStr = String(i.totalIdr || '').toLowerCase();
      const notesStr = String(i.notes || '').toLowerCase();
      return (
        dateStr.includes(q) ||
        pureStr.includes(q) ||
        idrStr.includes(q) ||
        notesStr.includes(q)
      );
    });
  }, [data, activeTab, searchQuery]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          <span>Customer Ledger — <span className="text-indigo-600 dark:text-indigo-400 font-black">{customerName}</span></span>
        </div>
      }
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5 text-slate-900 dark:text-slate-100">
        {/* Header Search Bar & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" className="text-xs px-2.5 py-1 font-bold">
              {metrics.totalBuyOrders || 0} Buy Orders
            </Badge>
            <Badge variant="emerald" className="text-xs px-2.5 py-1 font-bold">
              {metrics.totalSellOrders || 0} Sell Orders
            </Badge>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search customer transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Customer Summary Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pure Gold Traded
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                {formatNumber(metrics.totalPureGoldSold || 0)}g
              </span>
              <span className="text-[10px] text-slate-400">
                Bought: {formatNumber(metrics.totalPureGoldBought || 0)}g
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Net Pure Gold
            </span>
            <span
              className={`text-base font-extrabold ${
                (metrics.netPureGoldBalance || 0) >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatNumber(metrics.netPureGoldBalance || 0)}g
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total IDR Volume
            </span>
            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatIDR((metrics.totalIdrSellVolume || 0) + (metrics.totalIdrBuyVolume || 0))}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total USDT Volume
            </span>
            <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">
              {formatUSD((metrics.totalUsdtSellVolume || 0) + (metrics.totalUsdtBuyVolume || 0))}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> All Transactions ({data.combinedLedger.length})
          </button>
          <button
            onClick={() => setActiveTab('buy')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'buy'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-indigo-500" /> Buy Orders ({data.buys.length})
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sell'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> Sell Orders ({data.sells.length})
          </button>
        </div>

        {/* Ledger Transactions Table */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm max-h-[45vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Loading customer ledger data...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              No transactions recorded for this customer matching the search criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Scrap / Touch</th>
                  <th className="px-3 py-2.5">Pure Gold</th>
                  <th className="px-3 py-2.5">Payment</th>
                  <th className="px-3 py-2.5 text-right">Total IDR</th>
                  <th className="px-3 py-2.5 text-right">Total USDT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredItems.map((item, idx) => (
                  <tr key={item._id || item.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-black text-[10px] ${
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
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 font-medium">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                      {formatNumber(item.scrap || 0)}g ({formatNumber(item.touch || 0)}%)
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {formatNumber(item.pure || 0)}g
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-300">
                      {item.payment || 'USDT'}
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-indigo-700 dark:text-indigo-400 text-right">
                      {formatIDR(item.totalIdr || 0)}
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-right">
                      {formatUSD(item.totalDollar || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
}
