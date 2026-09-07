'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { formatDate, formatIDR, formatNumber } from '@/lib/utils/formatters';

export default function ResentBuys({ items = [], isLoading = false }) {
  return (
    <Card header="Recent Buy Transactions">
      <div className="w-full bg-white rounded-lg border border-[#E8EAF0] overflow-hidden">
        {isLoading && (
          <div className="p-6 text-center text-xs text-slate-400">
            Loading recent buy transactions...
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400 font-medium">
            No recent buy transactions recorded.
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E8EAF0]">
                  <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">
                    Date
                  </th>
                  <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">
                    Customer
                  </th>
                  <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">
                    Scrap / Pure
                  </th>
                  <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase text-right">
                    Total IDR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]">
                {items.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 text-xs text-slate-500 font-medium">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-bold text-slate-800">
                      {item.customer || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono text-amber-700 font-bold">
                      {formatNumber(item.scrap || item.pure || 0)}g (
                      {formatNumber(item.pure || 0)}g)
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono font-bold text-indigo-700 text-right">
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