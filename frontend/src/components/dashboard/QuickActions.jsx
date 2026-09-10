'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingUp,
  Receipt,
  Wallet,
  Coins,
  Calculator,
  Users,
} from 'lucide-react';
import Card from '@/components/ui/Card';

const actions = [
  { label: 'Buy Order', href: '/buy', icon: ShoppingBag, color: 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/60' },
  { label: 'Sell Order', href: '/sell', icon: TrendingUp, color: 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/60' },
  { label: 'Expense', href: '/expense', icon: Receipt, color: 'bg-rose-50/50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100/50 dark:hover:bg-rose-900/60' },
  { label: 'USDT Account', href: '/usdt-account', icon: Wallet, color: 'bg-sky-50/50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100/50 dark:hover:bg-sky-900/60' },
  { label: 'IDR Account', href: '/idr-account', icon: Coins, color: 'bg-amber-50/50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/60' },
  { label: 'Calculator', href: '/calculator', icon: Calculator, color: 'bg-purple-50/50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/60' },
  { label: 'Partners', href: '/partners', icon: Users, color: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800' },
];

export default function QuickActions() {

  

  return (
    <Card header="Quick Shortcuts">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.href}
              href={act.href}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all hover:scale-102 hover:shadow-xs ${act.color}`}
            >
              <Icon className="w-5 h-5 mb-1.5 shrink-0" />
              <span className="text-[11px] font-bold tracking-tight leading-tight">{act.label}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
