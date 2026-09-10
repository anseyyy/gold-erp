'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CustomerSelect from '@/components/ui/CustomerSelect';
import { formatDate, formatIDR, formatNumber } from '@/lib/utils/formatters';
import { exportToExcel, exportFullErpWorkbook } from '@/lib/utils/excelExport';
import ExcelImportModal from '@/components/spreadsheet/ExcelImportModal';
import {
  buyApi,
  sellApi,
  expenseApi,
  usdtApi,
  idrApi,
  podiyanaApi,
  customerApi,
} from '@/lib/api';
import {
  FileSpreadsheet,
  Download,
  Upload,
  ChevronDown,
  Search,
  Filter,
  RefreshCw,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  User,
  DollarSign,
  Wallet,
  Sparkles,
} from 'lucide-react';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function SpreadsheetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialModule = searchParams.get('module') || searchParams.get('type') || 'all';
  const initialCustomer = searchParams.get('customer') || '';

  const [activeModule, setActiveModule] = useState(initialModule); // 'all', 'buy', 'sell', 'expense', 'usdt', 'idr', 'podiyana-buy', 'podiyana-sell'
  const [period, setPeriod] = useState('all'); // 'all', 'today', 'this_week', 'this_month', 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL', 'BUY', 'SELL', 'CREDIT', 'DEBIT', 'EXPENSE'
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Master Raw Data State
  const [rawDataset, setRawDataset] = useState({
    buys: [],
    sells: [],
    expenses: [],
    usdt: [],
    idr: [],
    podiyanaBuys: [],
    podiyanaSells: [],
  });

  // Handler for Excel / CSV Import Confirmation
  const handleImportSuccess = (importedRows) => {
    if (!importedRows || importedRows.length === 0) return;

    setRawDataset((prev) => {
      const updated = { ...prev };
      importedRows.forEach((item) => {
        const mod = item.module?.toLowerCase() || '';
        if (mod.includes('buy') && !mod.includes('podi')) {
          updated.buys = [item, ...updated.buys];
        } else if (mod.includes('sell') && !mod.includes('podi')) {
          updated.sells = [item, ...updated.sells];
        } else if (mod.includes('exp')) {
          updated.expenses = [item, ...updated.expenses];
        } else if (mod.includes('usdt')) {
          updated.usdt = [item, ...updated.usdt];
        } else if (mod.includes('idr')) {
          updated.idr = [item, ...updated.idr];
        } else if (mod.includes('podi') && mod.includes('buy')) {
          updated.podiyanaBuys = [item, ...updated.podiyanaBuys];
        } else if (mod.includes('podi') && mod.includes('sell')) {
          updated.podiyanaSells = [item, ...updated.podiyanaSells];
        } else {
          // Default to buys or active module
          updated.buys = [item, ...updated.buys];
        }
      });
      return updated;
    });
  };

  // Load all module data from backend APIs
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [buysRes, sellsRes, expRes, usdtRes, idrRes, podiBuyRes, podiSellRes] =
        await Promise.allSettled([
          buyApi.getAll(),
          sellApi.getAll(),
          expenseApi.getAll(),
          usdtApi.getAll(),
          idrApi.getAll(),
          podiyanaApi.getBuy(),
          podiyanaApi.getSell(),
        ]);

      const buys = buysRes.status === 'fulfilled' ? buysRes.value?.items || [] : [];
      const sells = sellsRes.status === 'fulfilled' ? sellsRes.value?.items || [] : [];
      const expenses = expRes.status === 'fulfilled' ? expRes.value?.items || [] : [];
      const usdt = usdtRes.status === 'fulfilled' ? usdtRes.value?.items || [] : [];
      const idr = idrRes.status === 'fulfilled' ? idrRes.value?.items || [] : [];
      const podiyanaBuys = podiBuyRes.status === 'fulfilled' ? podiBuyRes.value?.items || [] : [];
      const podiyanaSells = podiSellRes.status === 'fulfilled' ? podiSellRes.value?.items || [] : [];

      setRawDataset({
        buys: buys.map((i) => ({ ...i, module: 'Buy Order', entryType: 'BUY' })),
        sells: sells.map((i) => ({ ...i, module: 'Sell Order', entryType: 'SELL' })),
        expenses: expenses.map((i) => ({
          ...i,
          module: 'Expense',
          entryType: 'EXPENSE',
          customer: i.reason || 'Expense',
        })),
        usdt: usdt.map((i) => ({ ...i, module: 'USDT Account', entryType: i.type?.toUpperCase() || 'USDT' })),
        idr: idr.map((i) => ({ ...i, module: 'IDR Account', entryType: i.type?.toUpperCase() || 'IDR' })),
        podiyanaBuys: podiyanaBuys.map((i) => ({ ...i, module: 'Podiyana Buy', entryType: 'BUY' })),
        podiyanaSells: podiyanaSells.map((i) => ({ ...i, module: 'Podiyana Sell', entryType: 'SELL' })),
      });
    } catch (err) {
      console.error('Failed to load master spreadsheet dataset:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllData();
  }, []);

  // Update URL active module if searchParam changes
  useEffect(() => {
    if (initialModule && initialModule !== activeModule) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveModule(initialModule);
    }
    if (initialCustomer && initialCustomer !== selectedCustomer) {
      setSelectedCustomer(initialCustomer);
    }
  }, [initialModule, initialCustomer, activeModule, selectedCustomer]);

  // Combine items according to active module tab
  const activeModuleItems = useMemo(() => {
    const { buys, sells, expenses, usdt, idr, podiyanaBuys, podiyanaSells } = rawDataset;
    switch (activeModule) {
      case 'buy':
        return buys;
      case 'sell':
        return sells;
      case 'expense':
        return expenses;
      case 'usdt':
        return usdt;
      case 'idr':
        return idr;
      case 'podiyana-buy':
        return podiyanaBuys;
      case 'podiyana-sell':
        return podiyanaSells;
      case 'all':
      default:
        return [...buys, ...sells, ...expenses, ...podiyanaBuys, ...podiyanaSells];
    }
  }, [rawDataset, activeModule]);

  // Apply multi-criteria filtering
  const filteredItems = useMemo(() => {
    return activeModuleItems.filter((item) => {
      // Transaction / Entry Type Filter
      if (typeFilter !== 'ALL') {
        const itemType = (item.entryType || item.type || '').toUpperCase();
        if (!itemType.includes(typeFilter.toUpperCase())) {
          return false;
        }
      }

      // Payment Currency Filter
      if (paymentFilter !== 'ALL') {
        const itemPay = (item.payment || item.currency || '').toUpperCase();
        if (!itemPay.includes(paymentFilter.toUpperCase())) {
          return false;
        }
      }

      // Customer Filter
      if (selectedCustomer.trim()) {
        const custName = (item.customer || item.customerName || item.reason || '').toLowerCase();
        if (!custName.includes(selectedCustomer.toLowerCase().trim())) {
          return false;
        }
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const dateStr = formatDate(item.date).toLowerCase();
        const pureStr = String(item.pure || item.amount || '').toLowerCase();
        const idrStr = String(item.totalIdr || '').toLowerCase();
        const usdtStr = String(item.totalDollar || item.amount || '').toLowerCase();
        const notesStr = String(item.notes || item.description || item.reason || '').toLowerCase();
        const custStr = String(item.customer || '').toLowerCase();
        const match =
          dateStr.includes(q) ||
          pureStr.includes(q) ||
          idrStr.includes(q) ||
          usdtStr.includes(q) ||
          notesStr.includes(q) ||
          custStr.includes(q);
        if (!match) return false;
      }

      // Time Period / Date Filter
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
  }, [activeModuleItems, period, startDate, endDate, typeFilter, paymentFilter, selectedCustomer, searchQuery]);

  // Master Totals Calculations
  const totalPureGold = useMemo(() => {
    return filteredItems.reduce((sum, i) => sum + (Number(i.pure) || 0), 0);
  }, [filteredItems]);

  const totalIdr = useMemo(() => {
    return filteredItems.reduce((sum, i) => sum + (Number(i.totalIdr) || 0), 0);
  }, [filteredItems]);

  const totalUsdt = useMemo(() => {
    return filteredItems.reduce((sum, i) => {
      const val = Number(i.totalDollar || i.amount || 0);
      return sum + (i.payment === 'IDR' || i.currency === 'IDR' ? 0 : val);
    }, 0);
  }, [filteredItems]);

  // Clean & Neat Excel Export Handler (Current Filtered View)
  const handleExportExcel = async () => {
    if (filteredItems.length === 0) return;
    await exportToExcel(filteredItems, {
      module: activeModule,
      period: period === 'all' ? 'All Time' : period,
    });
    setIsExportMenuOpen(false);
  };

  // Full ERP Multi-Sheet Excel Workbook Export Handler
  const handleExportFullWorkbook = async () => {
    await exportFullErpWorkbook(rawDataset, period === 'all' ? 'All Time' : period);
    setIsExportMenuOpen(false);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredItems.length === 0) return;

    const headers = [
      'Row',
      'Module',
      'Entry Type',
      'Date',
      'Customer / Remarks',
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
      `"${item.module || activeModule}"`,
      item.entryType || item.type || 'N/A',
      formatDate(item.date),
      `"${item.customer || item.reason || 'General'}"`,
      item.scrap || 0,
      item.touch || 0,
      item.pure || 0,
      `"${item.payment || item.currency || 'USDT'}"`,
      item.totalIdr || 0,
      item.totalDollar || item.amount || 0,
      `"${item.notes || item.description || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ERP_Spreadsheet_${activeModule}_${period}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Spreadsheet Master View
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Dedicated Excel-style spreadsheet interface for all ERP modules with live formulas and multi-criteria filters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={loadAllData}
          >
            Refresh
          </Button>

          {/* Import Excel / CSV Button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 text-xs font-extrabold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import Excel / CSV</span>
          </button>

          {/* Export Excel Menu Dropdown */}
          <div className="relative">
            <div className="inline-flex rounded-lg shadow-sm">
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-l-lg flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Export Styled Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                className="px-2 py-2 text-xs font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white rounded-r-lg border-l border-emerald-500 transition"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1.5 text-xs font-medium">
                <button
                  onClick={handleExportExcel}
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-100 font-bold"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Export Active View (.xlsx)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded font-bold uppercase">Styled</span>
                </button>

                <button
                  onClick={handleExportFullWorkbook}
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-100 font-bold border-t border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Full ERP Multi-Sheet (.xlsx)</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 rounded font-bold uppercase">Multi-Tab</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export Raw CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Module Selector Navigation Ribbon */}
      <div className="bg-emerald-900 text-white p-3 rounded-xl shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider">
                {activeModule.toUpperCase()}_MASTER_LEDGER_SHEET.XLSX
              </h3>
              <p className="text-[10px] text-emerald-200 font-mono">
                Formula: =SUM(Filtered_Rows) | Active Records: {filteredItems.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-200">
            <span>Totals: {formatNumber(totalPureGold)}g Pure</span>
            <span>|</span>
            <span>{formatIDR(totalIdr)}</span>
            <span>|</span>
            <span>{formatUSD(totalUsdt)}</span>
          </div>
        </div>

        {/* Module Tabs */}
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'buy', label: 'Buy Orders' },
            { id: 'sell', label: 'Sell Orders' },
            { id: 'expense', label: 'Expenses' },
            { id: 'usdt', label: 'USDT Account' },
            { id: 'idr', label: 'IDR Account' },
            { id: 'podiyana-buy', label: 'Podiyana Buy' },
            { id: 'podiyana-sell', label: 'Podiyana Sell' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveModule(tab.id);
                router.replace(`/spreadsheet?module=${tab.id}`);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeModule === tab.id
                  ? 'bg-white text-emerald-900 font-extrabold shadow-sm'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Criteria Filter Controls Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
            Multi-Criteria Filter Controls
          </span>
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
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Entry Type Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Transaction / Entry Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Types</option>
              <option value="BUY">Buy Orders</option>
              <option value="SELL">Sell Orders</option>
              <option value="EXPENSE">Expenses</option>
              <option value="CREDIT">Credit Deposits</option>
              <option value="DEBIT">Debit Withdrawals</option>
            </select>
          </div>

          {/* Payment Currency Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Payment Method
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Payments</option>
              <option value="USDT">USDT Only</option>
              <option value="IDR">IDR Only</option>
              <option value="CASH">Cash Only</option>
            </select>
          </div>

          {/* Customer Dropdown Filter */}
          <CustomerSelect
            label="Customer Filter"
            value={selectedCustomer}
            onChange={setSelectedCustomer}
            placeholder="All Customers"
          />

          {/* Search Query Filter */}
          <div className="lg:col-span-2">
            <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
              Keyword Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by notes, pure gold weight, IDR / USDT amounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-900 dark:text-slate-100"
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
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-900 dark:text-slate-100"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Excel Spreadsheet Data Grid Table */}
      <div className="border border-slate-300 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900 shadow-sm font-mono text-xs">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            {/* Excel Column Letters Bar */}
            <tr className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] text-center font-bold border-b border-slate-300 dark:border-slate-700 select-none">
              <th className="w-10 border-r border-slate-300 dark:border-slate-700 bg-slate-300 dark:bg-slate-800">#</th>
              <th className="w-28 border-r border-slate-300 dark:border-slate-700">A</th>
              <th className="w-24 border-r border-slate-300 dark:border-slate-700">B</th>
              <th className="w-28 border-r border-slate-300 dark:border-slate-700">C</th>
              <th className="w-36 border-r border-slate-300 dark:border-slate-700">D</th>
              <th className="w-28 border-r border-slate-300 dark:border-slate-700">E</th>
              <th className="w-28 border-r border-slate-300 dark:border-slate-700">F</th>
              <th className="w-24 border-r border-slate-300 dark:border-slate-700">G</th>
              <th className="w-36 border-r border-slate-300 dark:border-slate-700">H</th>
              <th className="w-32 border-r border-slate-300 dark:border-slate-700">I</th>
            </tr>

            {/* Excel Header Fields */}
            <tr className="bg-emerald-700 text-white font-sans text-[11px] font-bold uppercase border-b border-emerald-800">
              <th className="px-2 py-2.5 text-center border-r border-emerald-800">Row</th>
              <th className="px-3 py-2.5 border-r border-emerald-800">Module</th>
              <th className="px-2.5 py-2.5 text-center border-r border-emerald-800">Type</th>
              <th className="px-3 py-2.5 border-r border-emerald-800">Date</th>
              <th className="px-3 py-2.5 border-r border-emerald-800">Customer / Remarks</th>
              <th className="px-3 py-2.5 border-r border-emerald-800">Scrap / Touch</th>
              <th className="px-3 py-2.5 border-r border-emerald-800 text-right">Pure Gold</th>
              <th className="px-3 py-2.5 text-center border-r border-emerald-800">Payment</th>
              <th className="px-3 py-2.5 text-right border-r border-emerald-800">Total IDR</th>
              <th className="px-3 py-2.5 text-right">Total USDT</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="p-12 text-center text-slate-400 font-sans">
                  Loading master spreadsheet records...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-12 text-center text-slate-400 font-sans">
                  No records found matching the active filters.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const isBuy = item.entryType === 'BUY';
                const isSell = item.entryType === 'SELL';
                const isCredit = item.entryType === 'CREDIT' || item.type === 'Credit';
                return (
                  <tr
                    key={item._id || item.id || idx}
                    className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-2 py-2 text-center font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 select-none">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {item.module || activeModule}
                    </td>
                    <td className="px-2.5 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                          isBuy
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                            : isSell
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : isCredit
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {item.entryType || item.type || 'REC'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                      {item.customer || item.reason || '—'}
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                      {item.scrap ? `${formatNumber(item.scrap)}g (${item.touch || 0}%)` : '—'}
                    </td>
                    <td className="px-3 py-2 font-bold text-amber-600 dark:text-amber-400 text-right border-r border-slate-200 dark:border-slate-800">
                      {item.pure ? `${formatNumber(item.pure)}g` : '—'}
                    </td>
                    <td className="px-3 py-2 text-center font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {item.payment || item.currency || 'USDT'}
                    </td>
                    <td className="px-3 py-2 font-bold text-indigo-600 dark:text-indigo-400 text-right border-r border-slate-200 dark:border-slate-800">
                      {formatIDR(item.totalIdr || 0)}
                    </td>
                    <td className="px-3 py-2 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                      {formatUSD(item.totalDollar || item.amount || 0)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Excel Bottom Formula Summary Row */}
          <tfoot className="bg-emerald-950 text-white font-sans border-t-2 border-emerald-600 font-bold">
            <tr>
              <td colSpan={6} className="px-3 py-3 text-right uppercase tracking-wider text-xs">
                Master Filtered Totals Formula (=SUM):
              </td>
              <td className="px-3 py-3 text-right font-mono text-amber-400 text-xs">
                {formatNumber(totalPureGold)}g Pure
              </td>
              <td className="px-3 py-3 text-center text-xs text-emerald-300">
                {filteredItems.length} Rows
              </td>
              <td className="px-3 py-3 text-right font-mono text-indigo-300 text-xs">
                {formatIDR(totalIdr)}
              </td>
              <td className="px-3 py-3 text-right font-mono text-emerald-300 text-xs">
                {formatUSD(totalUsdt)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Excel / CSV Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        targetModule={activeModule}
      />
    </div>
  );
}

export default function SpreadsheetPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading Spreadsheet Master...</div>}>
      <SpreadsheetContent />
    </Suspense>
  );
}
