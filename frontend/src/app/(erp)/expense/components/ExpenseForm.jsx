'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

const today = new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ expense, onSubmit, onCancel }) {
  const [form, setForm] = React.useState(
    expense || { date: today, reason: '', description: '', amount: '', currency: 'USDT' },
  );

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <Card header="Record New Expense Entry">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={updateField}
          />

          <Input
            label="Reason"
            type="text"
            name="reason"
            value={form.reason}
            onChange={updateField}
            placeholder="e.g. Office Lease"
          />

          <Input
            label="Description"
            type="text"
            name="description"
            value={form.description}
            onChange={updateField}
            placeholder="e.g. Monthly HQ rent"
          />

          <Input
            label="Amount"
            type="number"
            name="amount"
            value={form.amount}
            onChange={updateField}
            placeholder="e.g. 1500000"
          />

          <Select
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={updateField}
            options={[
              { value: 'USDT', label: 'USDT' },
            ]}
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            variant="danger"
            icon={Plus}
          >
            {expense ? 'Update Expense' : 'Record Expense'}
          </Button>
          {expense && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        </div>
      </form>
    </Card>
  );
}