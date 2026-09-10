'use client';

import React from 'react';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { TrendingUp, Wallet, Receipt, ShoppingBag, DollarSign } from 'lucide-react';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function TopCards({ summary = {} }) {
  const {
    todaySalesUsdt = 0,
    todayProfit = 0,
    totalUsdtBalance = 0,
    totalProfit = 0,
    totalExpense = 0,
  } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <SummaryCard
        title="TODAY'S SALES"
        value={formatUSD(todaySalesUsdt)}
        currencyUnit="USDT"
        subtitle="Today's sales total"
        icon={ShoppingBag}
        variant="emerald"
      />
      <SummaryCard
        title="TODAY'S PROFIT"
        value={formatUSD(todayProfit)}
        currencyUnit="USDT"
        subtitle="Today's profit earned"
        icon={DollarSign}
        variant="amber"
      />
      <SummaryCard
        title="TOTAL USDT BALANCE"
        value={formatUSD(totalUsdtBalance)}
        currencyUnit="USDT"
        subtitle="Net ledger balance"
        icon={Wallet}
        variant="sky"
      />
      <SummaryCard
        title="TOTAL PROFIT"
        value={formatUSD(totalProfit)}
        currencyUnit="USDT"
        subtitle="All-time net profit"
        icon={TrendingUp}
        variant="indigo"
      />
      <SummaryCard
        title="TOTAL EXPENSE"
        value={formatUSD(totalExpense)}
        currencyUnit="USDT"
        subtitle="Real-time updated"
        icon={Receipt}
        variant="rose"
      />
    </div>
  );
}