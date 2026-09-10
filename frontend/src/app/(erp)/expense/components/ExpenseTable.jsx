'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Pencil, Trash2 } from 'lucide-react';

export default function ExpenseTable({ items = [], onEdit, onDelete }) {
  const usdtItems = items.filter((item) => item.currency === 'USDT');

  return (
    <Card header="Operational Expense Transactions">
      <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-[#E8EAF0] dark:border-slate-800 overflow-hidden shadow-2xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-[#E8EAF0] dark:border-slate-800">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Currency</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0] dark:divide-slate-800">
              {usdtItems.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-xs font-extrabold text-slate-900 dark:text-slate-100">{item.reason}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{item.description}</td>
                  <td className="px-4 py-3.5 text-xs font-bold text-rose-600 dark:text-rose-400">{Number(item.amount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-xs font-medium">
                    <Badge variant="amber" className="text-[10px] px-2 py-0.5 font-bold">{item.currency}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-right space-x-2">
                    <button type="button" onClick={() => onEdit(item)} className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md transition-colors" aria-label="Edit expense">
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                    <button type="button" onClick={() => onDelete(item._id || item.id)} className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-md transition-colors" aria-label="Delete expense">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}