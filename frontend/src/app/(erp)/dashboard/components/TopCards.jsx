'use client';

import React from 'react';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { TrendingUp, Wallet, Receipt } from 'lucide-react';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function TopCards({ summary = {} }) {
  const { totalUsdtBalance = 0, totalProfit = 0, totalExpense = 0 } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <SummaryCard
        title="TOTAL USDT BALANCE"
        value={formatUSD(totalUsdtBalance)}
        currencyUnit="USDT"
        icon={Wallet}
        variant="sky"
      />
      <SummaryCard
        title="TOTAL PROFIT"
        value={formatUSD(totalProfit)}
        currencyUnit="USDT"
        icon={TrendingUp}
        variant="indigo"
      />
      <SummaryCard
        title="TOTAL EXPENSE"
        value={formatUSD(totalExpense)}
        currencyUnit="USDT"
        icon={Receipt}
        subtitle="Real-time updated"
        variant="rose"
      />
    </div>
  );
}