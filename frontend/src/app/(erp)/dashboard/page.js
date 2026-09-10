'use client';

import React, { useEffect, useState } from 'react';
import TopCards from './components/TopCards';
import ResentSells from './components/ResentSells';
import ResentBuys from './components/ResentBuys';
import { dashboardApi, dashboardCardsApi } from '@/lib/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    todaySalesUsdt: 0,
    todayProfit: 0,
    totalUsdtBalance: 0,
    totalProfit: 0,
    totalExpense: 0,
    recentSells: [],
    recentBuys: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      dashboardCardsApi.getCardsData(),
      dashboardApi.getSummary(),
    ]).then(([cardsRes, summaryRes]) => {
      if (!active) return;

      const cardsData = cardsRes.status === 'fulfilled' ? cardsRes.value : {};
      const summaryData = summaryRes.status === 'fulfilled' ? summaryRes.value : {};

      setSummary({
        todaySalesUsdt: Number(cardsData.todaySalesUsdt || 0),
        todayProfit: Number(cardsData.todayProfit || 0),
        totalUsdtBalance: Number(cardsData.totalUsdtBalance ?? summaryData.totalUsdtBalance ?? 0),
        totalProfit: Number(cardsData.totalProfit ?? summaryData.totalProfit ?? 0),
        totalExpense: Number(cardsData.totalExpense ?? summaryData.totalExpense ?? 0),
        recentSells: summaryData.recentSells || [],
        recentBuys: summaryData.recentBuys || [],
      });
    }).finally(() => {
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