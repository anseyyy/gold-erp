'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import CustomerLedgerView from './components/CustomerLedgerView';

export default function CustomerLedgerQueryPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';

  return <CustomerLedgerView customerName={name} />;
}
