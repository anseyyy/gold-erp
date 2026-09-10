'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function RecentTransactions() {
  const staticTransactions = [
    { id: 1, transaction: 'Gold Bar Procurement #892', account: 'Sub Account Buy', type: 'Buy', amount: '$15,450.00', date: '02 Sep 2026' },
    { id: 2, transaction: 'USDT Transfer to Partner A', account: 'USDT Account', type: 'Credit', amount: '$5,000.00', date: '02 Sep 2026' },
    { id: 3, transaction: 'Gold Stock Sale #341', account: 'Sub Account Sell', type: 'Sell', amount: '$28,900.00', date: '01 Sep 2026' },
    { id: 4, transaction: 'Office Utility & Internet', account: 'General Expense', type: 'Expense', amount: '$450.00', date: '01 Sep 2026' },
    { id: 5, transaction: 'Gold Bullion Buy Order', account: 'General Buy', type: 'Buy', amount: '$12,800.00', date: '31 Aug 2026' },
  ];

  const variants = {
    Sell: 'emerald',
    Buy: 'sky',
    Expense: 'rose',
    Credit: 'indigo',
    Debit: 'amber',
  };

  return (
    <Card header="Recent Activity Transactions">
      <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-[#E8EAF0] dark:border-slate-800 overflow-hidden shadow-2xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-[#E8EAF0] dark:border-slate-800">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0] dark:divide-slate-800">
              {staticTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 text-xs font-extrabold text-slate-900 dark:text-slate-100">{tx.transaction}</td>
                  <td className="px-4 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400">{tx.account}</td>
                  <td className="px-4 py-3.5 text-xs font-medium">
                    <Badge variant={variants[tx.type] || 'slate'} className="text-[10px] font-bold px-2 py-0.5">{tx.type}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{tx.amount}</td>
                  <td className="px-4 py-3.5 text-xs font-medium text-slate-400 dark:text-slate-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

