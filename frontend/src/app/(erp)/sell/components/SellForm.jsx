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
    payment = 'USDT', setPayment = () => { }, errors = {}, isSubmitting = false, isEditing = false, onCancelEdit = () => { },
    onSubmit = (event) => event?.preventDefault?.(), onAddCustomer = () => { }, calculatedPure = 0,
    calculatedTotalIdr = 0, calculatedTotalDollar = 0, calculatedBalance = 0,
}) {
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
                </div>
                <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 p-4 rounded-xl"><div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs"><div><span className="text-slate-400 dark:text-slate-400 font-medium block">Pure Gold Weight:</span><span className="font-mono font-extrabold text-amber-700 dark:text-amber-400 text-sm">{(calculatedPure || 0).toFixed(3)} g</span></div><div><span className="text-slate-400 dark:text-slate-400 font-medium block">Total IDR:</span><span className="font-mono font-extrabold text-indigo-700 dark:text-indigo-400 text-sm">{formatIDR(calculatedTotalIdr)}</span></div><div><span className="text-slate-400 dark:text-slate-400 font-medium block">Total Dollar Out:</span><span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatUSDT(calculatedTotalDollar)}</span></div><div><span className="text-slate-400 dark:text-slate-400 font-medium block">Balance Due ({payment}):</span><span className="font-mono font-extrabold text-slate-800 dark:text-slate-100 text-sm">{payment === 'USDT' ? formatUSDT(calculatedBalance) : formatIDR(calculatedBalance)}</span></div></div></div>
                <div className="flex justify-end pt-1"><Button type="submit" variant="pastelPrimary" icon={Plus} isLoading={isSubmitting}>{isEditing ? 'Update Sell Order' : 'Record Sell Order'}</Button></div>
            </form>
        </Card>
    );
}
