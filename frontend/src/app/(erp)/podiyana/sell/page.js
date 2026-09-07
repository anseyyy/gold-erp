'use client';

import React, { useCallback, useEffect, useState } from 'react';
import BuyHeader from './components/BuyHeader';
import BuyForm from './components/BuyForm';
import BuyTable from './components/BuyTable';
import AddCustomerModal from './components/AddCustomerModal';
import { podiyanaApi, customerApi } from '@/lib/api';

export default function SellPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [scrap, setScrap] = useState('');
  const [touch, setTouch] = useState('');
  const [pure, setPure] = useState('');
  const [scrapRate, setScrapRate] = useState('');
  const [pureIdrRate, setPureIdrRate] = useState('');
  const [dollarRate, setDollarRate] = useState('');
  const [payment, setPayment] = useState('USDT');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');

  const calculatedPure = pure
    ? Number(pure)
    : Number(scrap || 0) * (Number(touch || 0) / 100);
  const calculatedPureIdrRate = pureIdrRate
    ? Number(pureIdrRate)
    : Number(touch) > 0
      ? Number(scrapRate || 0) / (Number(touch) / 100)
      : 0;
  const calculatedTotalIdr = calculatedPure * calculatedPureIdrRate;
  const calculatedTotalDollar = Number(dollarRate)
    ? calculatedTotalIdr / Number(dollarRate)
    : 0;
  const calculatedBalance =
    payment === 'USDT' ? calculatedTotalDollar : calculatedTotalIdr;

  const loadSells = useCallback(async () => {
    try {
      const data = await podiyanaApi.getSell();
      setItems(data.items || []);
      setApiError('');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Unable to load Podiyana sell orders.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    podiyanaApi
      .getSell()
      .then((data) => {
        if (active) setItems(data.items || []);
      })
      .catch((error) => {
        if (active)
          setApiError(
            error.response?.data?.message || 'Unable to load Podiyana sell orders.'
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    customerApi
      .getAll()
      .then((data) => {
        const names = (data.items || []).map((item) => item.name).filter(Boolean);
        setCustomers(names);
        if (names.length > 0) {
          setSelectedCustomer((prev) => (prev ? prev : names[0]));
        }
      })
      .catch(() => {});
  }, []);

  const submitSell = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        date,
        customer: selectedCustomer,
        scrap: Number(scrap),
        touch: Number(touch),
        pure: calculatedPure,
        scrapRate: Number(scrapRate) || 0,
        pureIdrRate: calculatedPureIdrRate,
        dollarRate: Number(dollarRate) || 0,
        payment,
        notes,
        totalIdr: calculatedTotalIdr,
        totalDollar: calculatedTotalDollar,
        balance: calculatedBalance,
      };
      await podiyanaApi.createSell(payload);
      await loadSells();
      setScrap('');
      setTouch('');
      setPure('');
      setScrapRate('');
      setPureIdrRate('');
      setDollarRate('');
      setNotes('');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create Podiyana sell order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCustomer = async (event) => {
    event.preventDefault();
    const name = newCustomerName.trim();
    if (!name) return;
    try {
      const data = await customerApi.create(name);
      const savedName = data.item?.name || name;
      setCustomers((current) =>
        current.includes(savedName) ? current : [...current, savedName],
      );
      setSelectedCustomer(savedName);
      setNewCustomerName('');
      setIsCustomerModalOpen(false);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Unable to save customer.');
    }
  };

  const deleteSell = async (id) => {
    await podiyanaApi.deleteSell(id);
    await loadSells();
  };

  return (
    <div className="space-y-6">
      <BuyHeader onAddCustomer={() => setIsCustomerModalOpen(true)} />
      <BuyForm
        date={date}
        setDate={setDate}
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        scrap={scrap}
        onScrapChange={setScrap}
        touch={touch}
        onTouchChange={setTouch}
        pure={pure}
        setPure={setPure}
        scrapRate={scrapRate}
        setScrapRate={setScrapRate}
        pureIdrRate={pureIdrRate}
        setPureIdrRate={setPureIdrRate}
        dollarRate={dollarRate}
        setDollarRate={setDollarRate}
        payment={payment}
        setPayment={setPayment}
        notes={notes}
        setNotes={setNotes}
        isSubmitting={isSubmitting}
        onSubmit={submitSell}
        onAddCustomer={() => setIsCustomerModalOpen(true)}
        calculatedPure={calculatedPure}
        calculatedTotalIdr={calculatedTotalIdr}
        calculatedTotalDollar={calculatedTotalDollar}
        calculatedBalance={calculatedBalance}
      />
      {apiError && <p className="text-sm text-rose-600 px-1">{apiError}</p>}
      <BuyTable
        items={items}
        isLoading={isLoading}
        canDelete
        onDeleteClick={deleteSell}
      />
      <AddCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        newCustomerName={newCustomerName}
        setNewCustomerName={setNewCustomerName}
        onSubmit={addCustomer}
      />
    </div>
  );
}