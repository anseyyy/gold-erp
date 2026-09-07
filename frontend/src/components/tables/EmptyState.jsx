'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data available', subtitle = 'No records match your criteria.' }) {
  return (
    <div className="w-full bg-white rounded-lg border border-[#E8EAF0] p-10 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
        <Inbox className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
