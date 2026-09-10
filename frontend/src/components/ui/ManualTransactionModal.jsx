'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import CustomerSelect from '@/components/ui/CustomerSelect';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ManualTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  accountType = 'USDT', // 'USDT' or 'IDR'
}) {
  const [type, setType] = useState('Credit'); // 'Credit' or 'Debit'
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [customer, setCustomer] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setType('Credit');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
      setCustomer('');
      setNotes('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        date: date || new Date().toISOString().slice(0, 10),
        type,
        amount: Number(amount),
        customer: customer.trim() || 'Manual Entry',
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record manual transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Manual ${accountType} Entry`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-900 dark:text-slate-100">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Transaction Type Toggle */}
        <div>
          <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1.5 tracking-wider">
            Transaction Direction
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('Credit')}
              className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition ${
                type === 'Credit'
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <ArrowUp className="w-4 h-4 text-emerald-500" />
              <span>Credit (Deposit / In)</span>
            </button>

            <button
              type="button"
              onClick={() => setType('Debit')}
              className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition ${
                type === 'Debit'
                  ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <ArrowDown className="w-4 h-4 text-rose-500" />
              <span>Debit (Withdrawal / Out)</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1 tracking-wider">
            Amount ({accountType}) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">
              {accountType === 'USDT' ? '$' : 'Rp'}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              placeholder={`Enter amount in ${accountType}...`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1 tracking-wider">
            Transaction Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Searchable Customer Dropdown */}
        <CustomerSelect
          label="Customer / Name / Remarks"
          value={customer}
          onChange={setCustomer}
          placeholder="Search registered customer or enter name..."
        />

        {/* Notes Input */}
        <div>
          <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1 tracking-wider">
            Notes / Description (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add any extra transaction notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={type === 'Credit' ? 'pastelSuccess' : 'pastelDanger'}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : `Save ${type} Entry`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
