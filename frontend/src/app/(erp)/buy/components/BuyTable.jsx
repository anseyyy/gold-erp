'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/tables/DataTable';
import { Pencil, Trash2 } from 'lucide-react';
import { formatDate, formatNumber, formatIDR, formatUSDT } from '@/lib/utils/formatters';

export default function BuyTable({
  items = [],
  isLoading = false,
  canEdit = false,
  canDelete = false,
  onEditClick,
  onDeleteClick,
  onCustomerClick,
}) {
  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row) => <span className="text-slate-500 dark:text-slate-400 font-medium">{formatDate(row.date)}</span>,
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
      cell: (row) => (
        <button
          onClick={() => onCustomerClick?.(row.customer)}
          className="font-extrabold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline text-xs cursor-pointer text-left focus:outline-none"
          title={`Click to view ${row.customer}'s complete ledger history`}
        >
          {row.customer || '—'}
        </button>
      ),
    },
    {
      header: 'Scrap (g)',
      accessorKey: 'scrap',
      cell: (row) => <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">{formatNumber(row.scrap || 0)} g</span>,
    },
    {
      header: 'Touch',
      accessorKey: 'touch',
      cell: (row) => <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">{formatNumber(row.touch || 0, 1)}</span>,
    },
    {
      header: 'Pure (g)',
      accessorKey: 'pure',
      cell: (row) => (
        <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs">
          {formatNumber(row.pure || row.amount || 0)} g
        </span>
      ),
    },
    {
      header: 'Scrap Rate',
      accessorKey: 'scrapRate',
      cell: (row) => <span className="font-mono text-slate-600 dark:text-slate-400 text-xs">{formatIDR(row.scrapRate || 0)}</span>,
    },
    {
      header: 'Pure IDR Rate',
      accessorKey: 'pureIdrRate',
      cell: (row) => <span className="font-mono text-slate-600 dark:text-slate-400 text-xs">{formatIDR(row.pureIdrRate || row.rate || 0)}</span>,
    },
    {
      header: 'Dollar Rate',
      accessorKey: 'dollarRate',
      cell: (row) => <span className="font-mono text-slate-600 dark:text-slate-400 text-xs">{formatIDR(row.dollarRate || 0)} / USD</span>,
    },
    {
      header: 'Total IDR',
      accessorKey: 'totalIdr',
      cell: (row) => (
        <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 text-xs">
          {formatIDR(row.totalIdr || row.total || (row.amount * row.rate) || 0)}
        </span>
      ),
    },
    {
      header: 'Total Dollar ($)',
      accessorKey: 'totalDollarOut',
      cell: (row) => (
        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
          {formatUSDT(row.totalDollar || row.totalDollarOut || 0)}
        </span>
      ),
    },
    {
      header: 'Paid Amount',
      accessorKey: 'paidAmount',
      cell: (row) => {
        const total = row.payment === 'USDT' ? (row.totalDollar || 0) : (row.totalIdr || 0);
        const paid = row.paidAmount !== undefined ? row.paidAmount : total;
        return (
          <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-xs">
            {row.payment === 'USDT' ? formatUSDT(paid) : formatIDR(paid)}
          </span>
        );
      },
    },
    {
      header: 'Balance Due',
      accessorKey: 'balance',
      cell: (row) => {
        const bal = row.balance !== undefined ? row.balance : 0;
        return (
          <span className={`font-mono font-bold text-xs ${bal > 0 ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {row.payment === 'USDT' ? formatUSDT(bal) : formatIDR(bal)}
          </span>
        );
      },
    },
    {
      header: 'Payment',
      accessorKey: 'payment',
      cell: (row) => (
        <Badge variant={row.payment === 'USDT' || row.currency === 'USDT' ? 'sky' : 'amber'}>
          {row.payment || row.currency || 'USDT'}
        </Badge>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      align: 'right',
      cell: (row) => (
        canEdit || canDelete ? (
          <div className="flex items-center justify-end gap-1">
            {canEdit && (
              <button
                onClick={() => onEditClick(row)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md transition-colors"
                title="Edit buy order"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDeleteClick(row._id || row.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-md transition-colors"
                title="Delete buy order"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-300 dark:text-slate-600 italic">No permission</span>
        )
      ),
    },
  ];

  return (
    <Card header="Buy Order Transactions">
      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="No buy orders recorded"
      />
    </Card>
  );
}
