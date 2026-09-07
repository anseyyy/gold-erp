'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

const today = new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ expense, onSubmit, onCancel, apiError }) {
  const [form, setForm] = React.useState(
    expense || { date: today, reason: '', description: '', amount: '', currency: 'USDT' },
  );
  const [localError, setLocalError] = React.useState('');

  const updateField = (event) => {
    setLocalError('');
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = (event) => {
    event.preventDefault();
    setLocalError('');

    if (!form.reason || !form.reason.trim()) {
      setLocalError('Expense Reason is required.');
      return;
    }

    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setLocalError('Please enter a valid expense amount greater than 0.');
      return;
    }

    onSubmit({ ...form, reason: form.reason.trim(), amount: Number(form.amount) });
  };

  const errorToDisplay = localError || apiError;

  return (
    <Card header={expense ? "Edit Expense Entry" : "Record New Expense Entry"}>
      <form onSubmit={submit} className="space-y-4">
        {(errorToDisplay) && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs font-semibold text-rose-700">
            {errorToDisplay}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={updateField}
            required
          />

          <Input
            label="Reason *"
            type="text"
            name="reason"
            value={form.reason}
            onChange={updateField}
            placeholder="e.g. Office Lease"
            required
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
            label="Amount *"
            type="number"
            step="any"
            name="amount"
            value={form.amount}
            onChange={updateField}
            placeholder="e.g. 1500000"
            required
          />

          <Select
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={updateField}
            options={[
              { value: 'USDT', label: 'USDT' },
              { value: 'IDR', label: 'IDR' },
            ]}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          {expense && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="danger"
            icon={Plus}
          >
            {expense ? 'Update Expense' : 'Record Expense'}
          </Button>
        </div>
      </form>
    </Card>
  );
}