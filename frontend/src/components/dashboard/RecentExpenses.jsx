'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function RecentExpenses() {
  const staticExpenses = [
    { id: 1, dateMonth: '02 Sep', dateYear: '2026', reason: 'Office Lease Payment', description: 'Monthly HQ rental fee', currency: 'IDR', amount: 'Rp 15,000,000' },
    { id: 2, dateMonth: '01 Sep', dateYear: '2026', reason: 'Software Subscriptions', description: 'ERP Cloud Server Hosting', currency: 'USDT', amount: '$350.00' },
    { id: 3, dateMonth: '31 Aug', dateYear: '2026', reason: 'Logistics & Security', description: 'Armored transit service for gold shipment', currency: 'IDR', amount: 'Rp 8,500,000' },
    { id: 4, dateMonth: '30 Aug', dateYear: '2026', reason: 'Utility & Internet', description: 'High-speed fiber connection & electricity', currency: 'IDR', amount: 'Rp 3,200,000' },
  ];

  return (
    <Card header="Recent Operational Expenses">
      <div className="w-full bg-white rounded-lg border border-[#E8EAF0] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-[#E8EAF0]">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Currency</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]">
              {staticExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-medium leading-tight">
                    <div>{exp.dateMonth}</div>
                    <div className="text-[10px] text-slate-400">{exp.dateYear}</div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-extrabold text-slate-900">{exp.reason}</td>
                  <td className="px-4 py-3.5 text-xs font-normal text-slate-500">{exp.description}</td>
                  <td className="px-4 py-3.5 text-xs font-medium">
                    <Badge variant={exp.currency === 'USDT' ? 'sky' : 'amber'} className="font-bold text-[10px] px-2 py-0.5">
                      {exp.currency}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-extrabold text-rose-600 tracking-tight">{exp.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

