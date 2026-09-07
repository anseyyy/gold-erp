'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ResentSells() {
  return (
    <Card header="Recent Sell Transactions">
      <div className="w-full bg-white rounded-lg border border-[#E8EAF0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E8EAF0]">
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Date</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Amount</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Rate</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase text-right">Total IDR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]">
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5 text-xs text-slate-500 font-medium">02 Sep 2026</td>
                <td className="px-3 py-2.5 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>5,000</span>
                  <Badge variant="sky" className="text-[9px] px-1 py-0">USDT</Badge>
                </td>
                <td className="px-3 py-2.5 text-xs font-mono text-slate-600">15,550</td>
                <td className="px-3 py-2.5 text-xs font-mono font-bold text-emerald-700 text-right">Rp 77,750,000</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5 text-xs text-slate-500 font-medium">01 Sep 2026</td>
                <td className="px-3 py-2.5 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>10,000</span>
                  <Badge variant="sky" className="text-[9px] px-1 py-0">USDT</Badge>
                </td>
                <td className="px-3 py-2.5 text-xs font-mono text-slate-600">15,600</td>
                <td className="px-3 py-2.5 text-xs font-mono font-bold text-emerald-700 text-right">Rp 156,000,000</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5 text-xs text-slate-500 font-medium">31 Aug 2026</td>
                <td className="px-3 py-2.5 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>2,500</span>
                  <Badge variant="sky" className="text-[9px] px-1 py-0">USDT</Badge>
                </td>
                <td className="px-3 py-2.5 text-xs font-mono text-slate-600">15,520</td>
                <td className="px-3 py-2.5 text-xs font-mono font-bold text-emerald-700 text-right">Rp 38,800,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}