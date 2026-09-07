'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/tables/DataTable';
import { Trash2 } from 'lucide-react';
import { formatDate, formatNumber, formatIDR, formatUSDT } from '@/lib/utils/formatters';

export default function BuyTable({ items = [], isLoading = false, canDelete = false, onDeleteClick }) {
  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row) => <span className="text-slate-500 font-medium">{formatDate(row.date)}</span>,
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
      cell: (row) => <span className="font-extrabold text-slate-800 text-xs">{row.customer || 'Walk-in Customer'}</span>,
    },
    {
      header: 'Scrap / Touch',
      accessorKey: 'scrap',
      cell: (row) => (
        <span className="font-mono text-slate-700 text-xs">
          {formatNumber(row.scrap || row.amount || 0)}g @ {row.touch || 100}%
        </span>
      ),
    },
    {
      header: 'Pure (g)',
      accessorKey: 'pure',
      cell: (row) => (
        <span className="font-mono font-bold text-amber-700 text-xs">
          {formatNumber(row.pure || row.amount || 0)} g
        </span>
      ),
    },
    {
      header: 'Pure IDR Rate',
      accessorKey: 'pureIdrRate',
      cell: (row) => <span className="font-mono text-slate-600 text-xs">{formatIDR(row.pureIdrRate || row.rate || 0)}</span>,
    },
    {
      header: 'Total IDR',
      accessorKey: 'totalIdr',
      cell: (row) => (
        <span className="font-mono font-bold text-indigo-700 text-xs">
          {formatIDR(row.totalIdr || row.total || (row.amount * row.rate) || 0)}
        </span>
      ),
    },
    {
      header: 'Total Dollar ($)',
      accessorKey: 'totalDollarOut',
      cell: (row) => (
        <span className="font-mono font-bold text-emerald-600 text-xs">
          {formatUSDT(row.totalDollarOut || 0)}
        </span>
      ),
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
        canDelete ? (
          <button
            onClick={() => onDeleteClick(row.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete buy order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-[11px] text-slate-300 italic">No permission</span>
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
