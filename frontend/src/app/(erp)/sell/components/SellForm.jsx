'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import CustomerSelect from '@/components/ui/CustomerSelect';
import Button from '@/components/ui/Button';
import { Plus, UserPlus } from 'lucide-react';
import { formatIDR, formatUSDT } from '@/lib/utils/formatters';

export default function SellForm({
  date = '', setDate = () => { }, customers = [], selectedCustomer = '', setSelectedCustomer = () => { },
  scrap = '', onScrapChange = () => { }, touch = '', onTouchChange = () => { }, pure = '', setPure = () => { },
  scrapRate = '', setScrapRate = () => { }, pureIdrRate = '', setPureIdrRate = () => { }, dollarRate = '', setDollarRate = () => { },
  payment = 'USDT', setPayment = () => { }, receivedAmount = '', setReceivedAmount = () => { }, errors = {}, isSubmitting = false, isEditing = false, onCancelEdit = () => { },
  onSubmit = (event) => event?.preventDefault?.(), onAddCustomer = () => { }, calculatedPure = 0,
  calculatedTotalIdr = 0, calculatedTotalDollar = 0,
}) {
  const totalValue = payment === 'USDT' ? calculatedTotalDollar : calculatedTotalIdr;
  const effectiveReceived = receivedAmount !== '' ? Number(receivedAmount) : totalValue;
  const remainingBalance = totalValue - effectiveReceived;

  return (
    <Card header={<div className="flex items-center justify-between w-full"><div><h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{isEditing ? 'Edit General Sell Order' : 'Record General Sell Order'}</h3><p className="text-xs text-slate-400 dark:text-slate-500">Complete customer gold trade entry</p></div><div className="flex items-center gap-2">{isEditing && <Button type="button" variant="outline" size="sm" onClick={onCancelEdit}>Cancel</Button>}<Button type="button" variant="outline" size="sm" icon={UserPlus} onClick={onAddCustomer}>+ Add Customer</Button></div></div>}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
          <CustomerSelect label="Customer" value={selectedCustomer} onChange={setSelectedCustomer} onAddCustomer={onAddCustomer} error={errors.customer} />
          <Input label="Scrap (Gram)" type="number" step="0.001" placeholder="e.g. 100.00" value={scrap} onChange={(e) => onScrapChange(e.target.value)} error={errors.scrap} />
          <Input label="Touch (%)" type="number" step="0.1" placeholder="e.g. 99.5" value={touch} onChange={(e) => onTouchChange(e.target.value)} error={errors.touch} />
          <Input label="Pure Gold (Gram)" type="number" step="0.001" placeholder="Auto calculated" value={scrap ? calculatedPure : pure} onChange={(e) => setPure(e.target.value)} />
          <Input label="Scrap Rate IDR (Optional)" type="number" step="1" placeholder="e.g. 1350000" value={scrapRate} onChange={(e) => setScrapRate(e.target.value)} />
          <Input label="Pure IDR Rate (per Gram)" type="number" step="1" placeholder="e.g. 1450000" value={calculatedTotalIdr && !pureIdrRate ? calculatedTotalIdr / (calculatedPure || 1) : pureIdrRate} onChange={(e) => setPureIdrRate(e.target.value)} error={errors.pureIdrRate} />
          <Input label="Dollar Rate (IDR / USD)" type="number" step="1" placeholder="e.g. 15450" value={dollarRate} onChange={(e) => setDollarRate(e.target.value)} />
          <Select label="Payment Method" value={payment} onChange={(e) => setPayment(e.target.value)} options={[{ value: 'USDT', label: 'USDT (Dollar Out)' }, { value: 'IDR', label: 'IDR (Rupiah Cash)' }]} />
          <Input label={`Received Amount (${payment})`} type="number" step="any" placeholder={`Defaults to total value (${payment === 'USDT' ? '$' : 'Rp'})`} value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} />
        </div>
        <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 p-4 rounded-xl">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            <div><span className="text-slate-400 dark:text-slate-400 font-medium block">Pure Gold Weight:</span><span className="font-mono font-extrabold text-amber-700 dark:text-amber-400 text-sm">{(calculatedPure || 0).toFixed(3)} g</span></div>
            <div><span className="text-slate-400 dark:text-slate-400 font-medium block">Total IDR:</span><span className="font-mono font-extrabold text-indigo-700 dark:text-indigo-400 text-sm">{formatIDR(calculatedTotalIdr)}</span></div>
            <div><span className="text-slate-400 dark:text-slate-400 font-medium block">Total Dollar Out:</span><span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatUSDT(calculatedTotalDollar)}</span></div>
            <div><span className="text-slate-400 dark:text-slate-400 font-medium block">Received Amount ({payment}):</span><span className="font-mono font-extrabold text-sky-600 dark:text-sky-400 text-sm">{payment === 'USDT' ? formatUSDT(effectiveReceived) : formatIDR(effectiveReceived)}</span></div>
            <div><span className="text-slate-400 dark:text-slate-400 font-medium block">Balance To Get ({payment}):</span><span className={`font-mono font-extrabold text-sm ${remainingBalance > 0 ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-emerald-600 dark:text-emerald-400'}`}>{payment === 'USDT' ? formatUSDT(remainingBalance) : formatIDR(remainingBalance)}</span></div>
          </div>
        </div>
        <div className="flex justify-end pt-1"><Button type="submit" variant="pastelPrimary" icon={Plus} isLoading={isSubmitting}>{isEditing ? 'Update Sell Order' : 'Record Sell Order'}</Button></div>
      </form>
    </Card>
  );
}
