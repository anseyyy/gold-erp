'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data available', subtitle = 'No records match your criteria.' }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-[#E8EAF0] dark:border-slate-800 p-10 text-center flex flex-col items-center justify-center space-y-3 transition-colors">
      <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
        <Inbox className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
