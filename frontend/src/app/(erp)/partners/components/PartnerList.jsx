'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PartnerForm from './PartnerForm';
import { TrendingUp, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatUSDT } from '@/lib/utils/formatters';

export default function PartnerList({
  totalProfit = 100000,
  partners = [],
  onAddEntry,
}) {
  const partnerCount = partners.length || 1;
  const equalShare = totalProfit / partnerCount;

  return (
    <div className="space-y-6">
      {/* Top Banner: Total Business Profit */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Business Profit</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{formatUSDT(totalProfit)}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 px-4 py-2.5 rounded-xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Partners Count</span>
              <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{partnerCount} Partners</p>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Equal Share / Partner</span>
              <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{formatUSDT(equalShare)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Bottom Grid: 2 Columns for Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {partners.map((partner) => {
          const entries = partner.entries || [];
          const credits = entries.filter((e) => e.type === 'Credit').reduce((sum, e) => sum + Number(e.amount || 0), 0);
          const debits = entries.filter((e) => e.type === 'Debit').reduce((sum, e) => sum + Number(e.amount || 0), 0);
          // Net Remaining Profit calculation
          const netProfit = equalShare + credits - debits;

          return (
            <Card
              key={partner.id}
              header={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                      {partner.name[0]}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{partner.name}</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Profit Share: {formatUSDT(equalShare)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Remaining Net Profit</span>
                    <span className={`font-mono text-base font-black ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {formatUSDT(netProfit)}
                    </span>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                {/* Embedded Partner Form */}
                <PartnerForm
                  partnerName={partner.name}
                  onSubmitEntry={(entry) => onAddEntry?.(partner.id, entry)}
                />

                {/* Partner Ledger Entries */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Transaction Ledger ({entries.length} Entries)
                  </h4>
                  <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-[#E8EAF0] dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-[#E8EAF0] dark:border-slate-800">
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Type</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Description</th>
                          <th className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8EAF0] dark:divide-slate-800">
                        {entries.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-500 italic">
                              No transactions recorded yet
                            </td>
                          </tr>
                        ) : (
                          entries.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400 font-medium">{item.date}</td>
                              <td className="px-3 py-2 text-xs">
                                <Badge
                                  variant={item.type === 'Debit' ? 'rose' : 'emerald'}
                                  className="text-[9px] px-1.5 py-0.5 font-bold"
                                >
                                  {item.type}
                                </Badge>
                              </td>
                              <td className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-normal">{item.description}</td>
                              <td className={`px-3 py-2 text-xs font-mono font-bold text-right ${
                                item.type === 'Debit' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {item.type === 'Debit' ? '-' : '+'}{formatUSDT(item.amount)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}