'use client';

import React from 'react';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { dashboardApi } from '@/lib/api';
import { TrendingUp, Wallet, Receipt } from 'lucide-react';

export default function TopCards() {
  const [totalExpense, setTotalExpense] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    dashboardApi
      .getSummary()
      .then(({ totalExpense = 0 }) => {
        if (active) setTotalExpense(Number(totalExpense));
      })
      .catch(() => {
        if (active) setTotalExpense(0);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <SummaryCard
        title="TOTAL USDT BALANCE"
        value="$54,500.00"
        currencyUnit="USDT"
        icon={Wallet}
        trend={5.1}
        variant="sky"
      />
      <SummaryCard
        title="TOTAL PROFIT"
        value="$212,734.40"
        currencyUnit="USDT"
        icon={TrendingUp}
        trend={12.4}
        variant="indigo"
      />
      
      <SummaryCard
        title="TOTAL EXPENSE"
        value={`$${totalExpense.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        currencyUnit="USDT"
        icon={Receipt}
        subtitle="Real-time updated"
        variant="rose"
      />
    </div>

  );
}