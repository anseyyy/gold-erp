'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CustomerLedgerView from '../components/CustomerLedgerView';

export default function CustomerLedgerDetailPage() {
  const params = useParams();
  const customerName = params?.name ? decodeURIComponent(params.name) : '';

  return <CustomerLedgerView customerName={customerName} />;
}
