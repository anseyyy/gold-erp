'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/tables/EmptyState';
import { dashboardApi } from '@/lib/api/dashboardApi';

const sampleChartData = [
  { date: 'Day 1', profit: 4000, sell: 12000, buy: 7000, expense: 1000 },
  { date: 'Day 5', profit: 6000, sell: 15000, buy: 8000, expense: 1000 },
  { date: 'Day 10', profit: 8000, sell: 18000, buy: 9000, expense: 1000 },
  { date: 'Day 15', profit: 7000, sell: 16000, buy: 8500, expense: 500 },
  { date: 'Day 20', profit: 10000, sell: 22000, buy: 11000, expense: 1000 },
  { date: 'Day 25', profit: 12000, sell: 25000, buy: 12000, expense: 1000 },
  { date: 'Day 30', profit: 14000, sell: 28000, buy: 13000, expense: 1000 },
];

export default function OverviewChart() {
  const [range, setRange] = useState('Last 30 Days');

  const ranges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Custom'];

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Financial Overview</h3>
            <p className="text-xs text-slate-400">Comparative trend analysis across accounts</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-all ${
                  range === r
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sellGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="buyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAF0" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#E8EAF0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: '600', paddingBottom: '10px' }}
              />

              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#profitGrad)"
              />
              <Area
                type="monotone"
                dataKey="sell"
                name="Sell"
                stroke="#10b981"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#sellGrad)"
              />
              <Area
                type="monotone"
                dataKey="buy"
                name="Buy"
                stroke="#0284c7"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#buyGrad)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#f43f5e"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </Card>
  );
}
