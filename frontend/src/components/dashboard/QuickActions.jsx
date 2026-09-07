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
  { label: 'Buy Order', href: '/buy', icon: ShoppingBag, color: 'bg-indigo-50/50 border-indigo-100 text-indigo-700 hover:bg-indigo-100/50' },
  { label: 'Sell Order', href: '/sell', icon: TrendingUp, color: 'bg-emerald-50/50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/50' },
  { label: 'Expense', href: '/expense', icon: Receipt, color: 'bg-rose-50/50 border-rose-100 text-rose-700 hover:bg-rose-100/50' },
  { label: 'USDT Account', href: '/usdt-account', icon: Wallet, color: 'bg-sky-50/50 border-sky-100 text-sky-700 hover:bg-sky-100/50' },
  { label: 'IDR Account', href: '/idr-account', icon: Coins, color: 'bg-amber-50/50 border-amber-100 text-amber-700 hover:bg-amber-100/50' },
  { label: 'Calculator', href: '/calculator', icon: Calculator, color: 'bg-purple-50/50 border-purple-100 text-purple-700 hover:bg-purple-100/50' },
  { label: 'Partners', href: '/partners', icon: Users, color: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' },
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
