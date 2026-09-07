'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ResentBuys() {
  return (
    <Card header="Recent Buy Transactions">
      <div className="w-full bg-white rounded-lg border border-[#E8EAF0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E8EAF0]">
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Date</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Customer</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Scrap / Pure</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase text-right">Total IDR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]">
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5 text-xs text-slate-500 font-medium">02 Sep 2026</td>
                <td className="px-3 py-2.5 text-xs font-bold text-slate-800">Walk-in Customer</td>
                <td className="px-3 py-2.5 text-xs font-mono text-amber-700 font-bold">100g (99.5g)</td>
                <td className="px-3 py-2.5 text-xs font-mono font-bold text-indigo-700 text-right">Rp 145,000,000</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5 text-xs text-slate-500 font-medium">01 Sep 2026</td>
                <td className="px-3 py-2.5 text-xs font-bold text-slate-800">Gold Supplier Alpha</td>
                <td className="px-3 py-2.5 text-xs font-mono text-amber-700 font-bold">250g (248.7g)</td>
                <td className="px-3 py-2.5 text-xs font-mono font-bold text-indigo-700 text-right">Rp 360,615,000</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5 text-xs text-slate-500 font-medium">31 Aug 2026</td>
                <td className="px-3 py-2.5 text-xs font-bold text-slate-800">Bullion Trader X</td>
                <td className="px-3 py-2.5 text-xs font-mono text-amber-700 font-bold">55g (54.5g)</td>
                <td className="px-3 py-2.5 text-xs font-mono font-bold text-indigo-700 text-right">Rp 79,025,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}