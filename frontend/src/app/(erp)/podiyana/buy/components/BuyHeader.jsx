'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import SummaryCard from '@/components/dashboard/SummaryCard';
import Link from 'next/link';
import { ShoppingBag, UserPlus, FileSpreadsheet } from 'lucide-react';
import { formatIDR } from '@/lib/utils/formatters';

export default function BuyHeader({ totalBuyAmount = 0, onAddCustomer }) {
  return (
    <div className="space-y-6 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">General Buy Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Customer gold procurement & buy transactions with real-time rate calculations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/spreadsheet?module=podiyana-buy">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              className="border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold"
            >
              View Podiyana Buy Spreadsheet Page
            </Button>
          </Link>

          <Button
            variant="pastelPrimary"
            icon={UserPlus}
            onClick={onAddCustomer}
          >
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Buy Amount"
          value={formatIDR(totalBuyAmount)}
          subtitle="Cumulative buy total value (IDR)"
          icon={ShoppingBag}
          variant="indigo"
        />
      </div>
    </div>
  );
}
