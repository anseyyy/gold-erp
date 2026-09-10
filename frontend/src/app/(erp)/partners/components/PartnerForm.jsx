'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function PartnerForm({ partnerName, onSubmitEntry }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('Debit'); // Debit reduces profit
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onSubmitEntry?.({
      date,
      type,
      amount: Number(amount),
      description: description.trim() || `${type} transaction`,
    });
    setAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-3">
      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
        Add Entry for {partnerName}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: 'Debit', label: 'Debit (Reduces Profit)' },
            { value: 'Credit', label: 'Credit (Adds Capital)' },
          ]}
        />

        <Input
          label="Amount ($ USDT)"
          type="number"
          step="0.01"
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Input
          label="Description"
          type="text"
          placeholder="Reason / Note"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" variant="pastelPrimary" size="sm" icon={Plus}>
          Add Entry
        </Button>
      </div>
    </form>
  );
}