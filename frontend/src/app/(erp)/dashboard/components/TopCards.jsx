'use client';

import React from 'react';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { TrendingUp, Wallet, Receipt, ShoppingBag, DollarSign, Scale } from 'lucide-react';

const formatUSD = (val = 0) =>
  `$${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatGram = (val = 0) =>
  `${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} g`;

export default function TopCards({ summary = {}, onCardClick }) {
  const {
    todaySalesUsdt = 0,
    todayProfit = 0,
    totalUsdtBalance = 0,
    totalProfit = 0,
    totalExpense = 0,
    totalToGet = 0,
    totalToGive = 0,
    totalGoldBalance = 0,
    totalPureGoldBought = 0,
    totalPureGoldSold = 0,
    toGetByCustomer = [],
    toGiveByCustomer = [],
  } = summary;

  return (
    <div className="space-y-4">
      {/* Row 1: Gold Stock Balance, Today Profit & Outstanding Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="TOTAL GOLD BALANCE"
          value={formatGram(totalGoldBalance)}
          subtitle={`Bought: ${totalPureGoldBought.toFixed(1)}g | Sold: ${totalPureGoldSold.toFixed(1)}g`}
          icon={Scale}
          variant="amber"
        />
        <SummaryCard
          title="TODAY'S PROFIT"
          value={formatUSD(todayProfit)}
          currencyUnit="USDT"
          subtitle="Today's profit earned"
          icon={DollarSign}
          variant="emerald"
        />
        <SummaryCard
          title="TOTAL TO GET"
          value={formatUSD(totalToGet)}
          subtitle="Click for client breakdown"
          icon={TrendingUp}
          variant="emerald"
          onClick={() => onCardClick?.('GET', toGetByCustomer, totalToGet)}
        />
        <SummaryCard
          title="TOTAL TO GIVE"
          value={formatUSD(totalToGive)}
          subtitle="Click for client breakdown"
          icon={Receipt}
          variant="rose"
          onClick={() => onCardClick?.('GIVE', toGiveByCustomer, totalToGive)}
        />
      </div>

      {/* Row 2: Financial Ledger Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          variant="purple"
        />
      </div>
    </div>
  );
}