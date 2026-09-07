'use client';

import React from 'react';
import TopCards from './components/TopCards';
import ResentSells from './components/ResentSells';
import ResentBuys from './components/ResentBuys';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      

      <TopCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResentSells />
        <ResentBuys />
      </div>
    </div>
  );
}