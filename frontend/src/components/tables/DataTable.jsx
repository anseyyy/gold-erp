'use client';

import React from 'react';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  emptySubtext = 'Get started by creating your first entry.',
}) {
  const safeColumns = Array.isArray(columns) ? columns : [];

  const safeData = Array.isArray(data) ? data : [];

  if (!isLoading && safeData.length === 0) {
    return <EmptyState title={emptyMessage} subtitle={emptySubtext} />;
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-[#E8EAF0] dark:border-slate-800 overflow-hidden shadow-[0_2px_4px_rgba(15,23,42,0.02)] transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-[#E8EAF0] dark:border-slate-800">
              {safeColumns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                    } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EAF0] dark:divide-slate-800">
            {safeData.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                {safeColumns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4 py-3.5 text-xs text-slate-800 dark:text-slate-200 font-medium ${col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                      }`}
                  >
                    {col.cell ? col.cell(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
