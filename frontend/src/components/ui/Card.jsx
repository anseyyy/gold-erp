'use client';

import React from 'react';

export default function Card({ children, className = '', header, action }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-lg shadow-[0_2px_4px_rgba(15,23,42,0.02)] transition-colors duration-150 ${className}`}
    >
      {header && (
        <div className="px-5 py-4 border-b border-[#E8EAF0] dark:border-slate-800 flex items-center justify-between">
          <div>{typeof header === 'string' ? <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{header}</h3> : header}</div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={header ? 'p-5' : 'p-5'}>{children}</div>
    </div>
  );
}
