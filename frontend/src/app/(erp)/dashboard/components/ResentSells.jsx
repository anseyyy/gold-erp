'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, formatIDR, formatNumber } from '@/lib/utils/formatters';

export default function ResentSells({ items = [], isLoading = false }) {
  return (
    <Card header="Recent Sell Transactions">
      <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-[#E8EAF0] dark:border-slate-800 overflow-hidden">
        {isLoading && (
          <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
            Loading recent sell transactions...
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            No recent sell transactions recorded.
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-[#E8EAF0] dark:border-slate-800">
                  <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Date
                  </th>
                  <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Amount
                  </th>
                  <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Rate
                  </th>
                  <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase text-right">
                    Total IDR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0] dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{formatNumber(item.totalDollar || item.pure || 0)}</span>
                      <Badge variant="sky" className="text-[9px] px-1 py-0">
                        {item.payment || 'USDT'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                      {formatNumber(item.pureIdrRate || item.dollarRate || 0, 0)}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 text-right">
                      {formatIDR(item.totalIdr || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}