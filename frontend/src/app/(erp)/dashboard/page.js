'use client';

import React, { useEffect, useState } from 'react';
import TopCards from './components/TopCards';
import ResentSells from './components/ResentSells';
import ResentBuys from './components/ResentBuys';
import { dashboardApi } from '@/lib/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalUsdtBalance: 0,
    totalProfit: 0,
    totalExpense: 0,
    recentSells: [],
    recentBuys: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    dashboardApi
      .getSummary()
      .then((data) => {
        if (active) {
          setSummary({
            totalUsdtBalance: Number(data.totalUsdtBalance || 0),
            totalProfit: Number(data.totalProfit || 0),
            totalExpense: Number(data.totalExpense || 0),
            recentSells: data.recentSells || [],
            recentBuys: data.recentBuys || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard summary:', err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <TopCards summary={summary} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResentSells items={summary.recentSells} isLoading={isLoading} />
        <ResentBuys items={summary.recentBuys} isLoading={isLoading} />
      </div>
    </div>
  );
}