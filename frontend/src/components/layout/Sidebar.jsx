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
  Layers,
  Calculator,
  Users,
  ChevronDown,
  ChevronRight,
  LogOut,
  Coins,
  Building2,
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
    { label: 'Expense', href: '/expense', icon: Receipt },
    { label: 'Buy', href: '/buy', icon: ShoppingBag },
    { label: 'Sell', href: '/sell', icon: TrendingUp },
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
      className={`w-64 bg-white border-r border-[#E8EAF0] flex flex-col justify-between h-screen sticky top-0 z-30 ${className}`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-[#E8EAF0] flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            C
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight">Creston</h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Financial Suite</p>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="p-4 space-y-6">
          {/* OVERVIEW SECTION */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
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
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* SUB ACCOUNTS SECTION */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Sub Accounts
            </p>
            <nav className="space-y-1">
              {/* Podiyana Parent */}
              <div>
                <button
                  onClick={() => setPodiyanaOpen(!podiyanaOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${isPodiyanaActive
                    ? 'bg-slate-100/80 text-slate-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className={`w-4 h-4 ${isPodiyanaActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>Podiyana Account</span>
                  </div>
                  {podiyanaOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
                {podiyanaOpen && (
                  <div className="ml-7 mt-1 space-y-1 border-l border-slate-200 pl-3">
                    <Link
                      href="/podiyana/buy"
                      className={`block py-1.5 px-2 text-xs font-semibold rounded-md transition-colors ${isLinkActive('/podiyana/buy')
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                      Buy
                    </Link>
                    <Link
                      href="/podiyana/sell"
                      className={`block py-1.5 px-2 text-xs font-semibold rounded-md transition-colors ${isLinkActive('/podiyana/sell')
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                      Sell
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* TOOLS SECTION */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
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
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#E8EAF0] bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-200">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Admin User'}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span className="text-[10px] font-semibold text-slate-500 capitalize">{user?.role || 'owner'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
