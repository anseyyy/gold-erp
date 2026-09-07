'use client';

import React, { useState } from 'react';
import PartnerHeader from './components/PartnerHeader';
import PartnerList from './components/PartnerList';

export default function PartnersPage() {
  const [totalProfit] = useState(100000); // Total business profit $100,000 USDT

  // 2 dummy partners (Partner A & Partner B)
  const [partners, setPartners] = useState([
    {
      id: 'partner-a',
      name: 'Partner A',
      entries: [
        { date: '2026-09-01', type: 'Debit', amount: 5000, description: 'Monthly Profit Payout' },
        { date: '2026-08-25', type: 'Credit', amount: 2000, description: 'Capital Addition' },
      ],
    },
    {
      id: 'partner-b',
      name: 'Partner B',
      entries: [
        { date: '2026-09-02', type: 'Debit', amount: 3500, description: 'Partial Payout' },
      ],
    },
  ]);

  const handleAddPartner = (name) => {
    const newPartner = {
      id: `partner-${Date.now()}`,
      name,
      entries: [],
    };
    setPartners([...partners, newPartner]);
  };

  const handleAddEntry = (partnerId, entry) => {
    setPartners(
      partners.map((p) => {
        if (p.id === partnerId) {
          return {
            ...p,
            entries: [entry, ...p.entries],
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      <PartnerHeader
        partners={partners}
        onAddPartner={handleAddPartner}
      />
      <PartnerList
        totalProfit={totalProfit}
        partners={partners}
        onAddEntry={handleAddEntry}
      />
    </div>
  );
}