'use client';

import React from 'react';
import BuyHeader from './components/BuyHeader';
import BuyForm from './components/BuyForm';
import BuyTable from './components/BuyTable';

export default function BuyPage() {
  return (
    <div className="space-y-6">
      <BuyHeader />
      <BuyForm />
      <BuyTable />
    </div>
  );
}