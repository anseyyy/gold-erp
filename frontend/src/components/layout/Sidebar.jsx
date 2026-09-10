'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  ShoppingBag,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Calculator,
  Users,
  ChevronDown,
  ChevronRight,
  LogOut,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ className = '' }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isPodiyanaActive = pathname?.startsWith('/podiyana');

  const [podiyanaOpen, setPodiyanaOpen] = useState(isPodiyanaActive);

  useEffect(() => {
    queueMicrotask(() => {
      if (isPodiyanaActive) setPodiyanaOpen(true);
    });
  }, [pathname, isPodiyanaActive]);

  const overviewNav = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Spreadsheet Master', href: '/spreadsheet', icon: FileSpreadsheet },
    { label: 'Expense', href: '/expense', icon: Receipt },
    { label: 'Buy', href: '/buy', icon: ShoppingBag },
    { label: 'Sell', href: '/sell', icon: TrendingUp },
  ];

  const podiyanaNav = [
    { label: 'Buy (Podi)', href: '/podiyana/buy' },
    { label: 'Sell (Podi)', href: '/podiyana/sell' },
  ];

  const toolsNav = [
    { label: 'USDT Account', href: '/usdt-account', icon: Wallet },
    { label: 'IDR Account', href: '/idr-account', icon: Coins },
    { label: 'Calculator', href: '/calculator', icon: Calculator },
    { label: 'Partners Account', href: '/partners', icon: Users },
  ];

  const isLinkActive = (href) => pathname === href;

  return (
    <aside
      className={`w-64 bg-white dark:bg-slate-900 border-r border-[#E8EAF0] dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 transition-colors ${className}`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-[#E8EAF0] dark:border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            C
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-tight">Creston</h1>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Financial Suite</p>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="p-4 space-y-6">
          {/* OVERVIEW SECTION */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Overview
            </p>
            <nav className="space-y-1">
              {overviewNav.map((item) => {
                const active = isLinkActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${active
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800/60'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* PODIYANA SUB-SYSTEM DROPDOWN */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Podiyana Core
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setPodiyanaOpen(!podiyanaOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${isPodiyanaActive
                  ? 'text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className={`w-4 h-4 ${isPodiyanaActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>Podiyana</span>
                </div>
                {podiyanaOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {podiyanaOpen && (
                <div className="pl-6 pt-1 space-y-1 border-l-2 border-indigo-100 dark:border-indigo-900 ml-4">
                  {podiyanaNav.map((sub) => {
                    const subActive = isLinkActive(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block px-3 py-1.5 text-xs rounded-md transition-colors ${subActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* TOOLS & ACCOUNTS */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Tools
            </p>
            <nav className="space-y-1">
              {toolsNav.map((item) => {
                const active = isLinkActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${active
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800/60'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#E8EAF0] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-200 dark:border-indigo-800">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name || 'Admin User'}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 inline" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 capitalize">{user?.role || 'owner'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
