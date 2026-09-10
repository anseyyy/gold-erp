'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { subAccountApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import SummaryCard from '@/components/dashboard/SummaryCard';
import BuyForm from '../../buy/components/BuyForm';
import BuyTable from '../../buy/components/BuyTable';
import SellForm from '../../sell/components/SellForm';
import SellTable from '../../sell/components/SellTable';
import {
  ArrowLeft,
  FolderKanban,
  ShoppingBag,
  TrendingUp,
  Plus,
  ChevronUp,
  User,
  Search,
  Filter,
  Scale,
} from 'lucide-react';
import { formatIDR } from '@/lib/utils/formatters';

export default function SubAccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subAccountId = params?.id;

  const [subAccount, setSubAccount] = useState(null);
  const [buyItems, setBuyItems] = useState([]);
  const [sellItems, setSellItems] = useState([]);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Active Tab: 'BUY' | 'SELL'
  const [activeTab, setActiveTab] = useState('BUY');

  // Toolbar search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states for Buy & Sell
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [scrap, setScrap] = useState('');
  const [touch, setTouch] = useState('');
  const [pure, setPure] = useState('');
  const [scrapRate, setScrapRate] = useState('');
  const [pureIdrRate, setPureIdrRate] = useState('');
  const [dollarRate, setDollarRate] = useState('');
  const [payment, setPayment] = useState('USDT');
  const [paidAmount, setPaidAmount] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDetails = useCallback(async () => {
    if (!subAccountId) return;
    setIsLoading(true);
    setApiError('');
    try {
      const data = await subAccountApi.getById(subAccountId);
      setSubAccount(data.item);
      setBuyItems(data.buyItems || []);
      setSellItems(data.sellItems || []);
      setTotalBuyAmount(Number(data.totalBuyAmount || 0));
      setTotalSellAmount(Number(data.totalSellAmount || 0));
      setNetBalance(Number(data.netBalance || 0));
      if (data.item?.customer) {
        setSelectedCustomer(data.item.customer);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to load sub account details.');
    } finally {
      setIsLoading(false);
    }
  }, [subAccountId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  // Rate calculations
  const calculatedPureBuy = pure
    ? Number(pure)
    : Number(scrap || 0) * Number(touch || 0);
  const calculatedPureSell = pure
    ? Number(pure)
    : (Number(scrap || 0) * Number(touch || 0)) / 100;
  const currentPure = activeTab === 'BUY' ? calculatedPureBuy : calculatedPureSell;

  const calculatedPureIdrRateBuy = pureIdrRate
    ? Number(pureIdrRate)
    : Number(touch) > 0
    ? Number(scrapRate || 0) / Number(touch)
    : 0;
  const calculatedPureIdrRateSell = pureIdrRate
    ? Number(pureIdrRate)
    : Number(scrapRate || 0);
  const currentPureIdrRate =
    activeTab === 'BUY' ? calculatedPureIdrRateBuy : calculatedPureIdrRateSell;

  const calculatedTotalIdr = currentPure * currentPureIdrRate;
  const calculatedTotalDollar = Number(dollarRate)
    ? calculatedTotalIdr / Number(dollarRate)
    : 0;
  const totalOrderValue = payment === 'USDT' ? calculatedTotalDollar : calculatedTotalIdr;
  const calculatedBalance = activeTab === 'BUY'
    ? totalOrderValue - (paidAmount !== '' ? Number(paidAmount) : totalOrderValue)
    : totalOrderValue - (receivedAmount !== '' ? Number(receivedAmount) : totalOrderValue);

  const clearForm = () => {
    setEditingId(null);
    setIsFormOpen(false);
    setDate(new Date().toISOString().slice(0, 10));
    setSelectedCustomer(subAccount?.customer || '');
    setScrap('');
    setTouch('');
    setPure('');
    setScrapRate('');
    setPureIdrRate('');
    setDollarRate('');
    setPayment('USDT');
    setPaidAmount('');
    setReceivedAmount('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError('');
    try {
      const payload = {
        date,
        customer: selectedCustomer || subAccount?.customer || 'Sub Account Entry',
        scrap: Number(scrap),
        touch: Number(touch),
        pure: currentPure,
        scrapRate: Number(scrapRate) || 0,
        pureIdrRate: currentPureIdrRate,
        dollarRate: Number(dollarRate) || 0,
        payment,
        totalIdr: calculatedTotalIdr,
        totalDollar: calculatedTotalDollar,
        paidAmount: activeTab === 'BUY' ? (paidAmount === '' ? totalOrderValue : Number(paidAmount)) : 0,
        receivedAmount: activeTab === 'SELL' ? (receivedAmount === '' ? totalOrderValue : Number(receivedAmount)) : 0,
        balance: calculatedBalance,
      };

      if (activeTab === 'BUY') {
        if (editingId) {
          await subAccountApi.updateBuy(subAccountId, editingId, payload);
        } else {
          await subAccountApi.createBuy(subAccountId, payload);
        }
      } else {
        if (editingId) {
          await subAccountApi.updateSell(subAccountId, editingId, payload);
        } else {
          await subAccountApi.createSell(subAccountId, payload);
        }
      }

      await loadDetails();
      clearForm();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editItem = (item) => {
    setEditingId(item._id || item.id);
    setIsFormOpen(true);
    setDate(item.date ? new Date(item.date).toISOString().slice(0, 10) : '');
    setSelectedCustomer(item.customer || subAccount?.customer || '');
    setScrap(item.scrap?.toString() || '');
    setTouch(item.touch?.toString() || '');
    setPure(item.scrap ? '' : item.pure?.toString() || '');
    setScrapRate(item.scrapRate?.toString() || '');
    setPureIdrRate(item.pureIdrRate?.toString() || '');
    setDollarRate(item.dollarRate?.toString() || '');
    setPayment(item.payment || 'USDT');
    setPaidAmount(item.paidAmount !== undefined && item.paidAmount !== null ? item.paidAmount.toString() : '');
    setReceivedAmount(item.receivedAmount !== undefined && item.receivedAmount !== null ? item.receivedAmount.toString() : '');
  };

  const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      if (activeTab === 'BUY') {
        await subAccountApi.deleteBuy(subAccountId, id);
      } else {
        await subAccountApi.deleteSell(subAccountId, id);
      }
      await loadDetails();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to delete order.');
    }
  };

  // Filtered lists
  const currentItems = activeTab === 'BUY' ? buyItems : sellItems;
  const filteredItems = useMemo(() => {
    return currentItems.filter((item) => {
      if (paymentFilter !== 'ALL' && item.payment !== paymentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const custMatch = item.customer?.toLowerCase().includes(q);
        const pureMatch = String(item.pure || '').toLowerCase().includes(q);
        const idrMatch = String(item.totalIdr || '').toLowerCase().includes(q);
        if (!custMatch && !pureMatch && !idrMatch) return false;
      }
      return true;
    });
  }, [currentItems, searchQuery, paymentFilter]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-semibold">
        Loading sub account details...
      </div>
    );
  }

  if (!subAccount) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm font-bold text-rose-600">Sub Account not found.</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/sub-accounts')}>
          Back to Sub Accounts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push('/sub-accounts')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sub Accounts Directory</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {subAccount.name}
                </h1>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Client: {subAccount.customer}</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="pastelPrimary"
            size="sm"
            icon={isFormOpen ? ChevronUp : Plus}
            onClick={() => {
              if (!isFormOpen) clearForm();
              setIsFormOpen((prev) => !prev);
            }}
            className="shadow-sm"
          >
            {isFormOpen
              ? `Close ${activeTab === 'BUY' ? 'Buy' : 'Sell'} Form`
              : `+ Record ${activeTab === 'BUY' ? 'Buy' : 'Sell'} Order`}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Buy Amount"
          value={formatIDR(totalBuyAmount)}
          subtitle={`${buyItems.length} buy transactions recorded`}
          icon={ShoppingBag}
          variant="indigo"
        />
        <SummaryCard
          title="Total Sell Amount"
          value={formatIDR(totalSellAmount)}
          subtitle={`${sellItems.length} sell transactions recorded`}
          icon={TrendingUp}
          variant="emerald"
        />
        <SummaryCard
          title="Net Position"
          value={formatIDR(netBalance)}
          subtitle="Net Sell - Buy Balance (IDR)"
          icon={Scale}
          variant={netBalance >= 0 ? 'emerald' : 'indigo'}
        />
      </div>

      {/* Navigation Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('BUY');
            setIsFormOpen(false);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'BUY'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Buy Account</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-indigo-500/20 text-white font-extrabold">
            {buyItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('SELL');
            setIsFormOpen(false);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'SELL'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sell Account</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-emerald-500/20 text-white font-extrabold">
            {sellItems.length}
          </span>
        </button>
      </div>

      {/* Toggleable Order Form */}
      {isFormOpen &&
        (activeTab === 'BUY' ? (
          <BuyForm
            date={date}
            setDate={setDate}
            customers={[subAccount.customer]}
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
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
            isSubmitting={isSubmitting}
            isEditing={Boolean(editingId)}
            onCancelEdit={clearForm}
            onSubmit={handleFormSubmit}
            onAddCustomer={() => {}}
            calculatedPure={currentPure}
            calculatedPureIdrRate={currentPureIdrRate}
            calculatedTotalIdr={calculatedTotalIdr}
            calculatedTotalDollar={calculatedTotalDollar}
            calculatedBalance={calculatedBalance}
          />
        ) : (
          <SellForm
            date={date}
            setDate={setDate}
            customers={[subAccount.customer]}
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
            receivedAmount={receivedAmount}
            setReceivedAmount={setReceivedAmount}
            isSubmitting={isSubmitting}
            isEditing={Boolean(editingId)}
            onCancelEdit={clearForm}
            onSubmit={handleFormSubmit}
            onAddCustomer={() => {}}
            calculatedPure={currentPure}
            calculatedTotalIdr={calculatedTotalIdr}
            calculatedTotalDollar={calculatedTotalDollar}
            calculatedBalance={calculatedBalance}
          />
        ))}

      {apiError && <p className="text-sm text-rose-600 font-semibold">{apiError}</p>}

      {/* Toolbar for Search & Payment Filter */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()} orders by pure gold, IDR amount...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="USDT">USDT Only</option>
            <option value="IDR">IDR Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {activeTab === 'BUY' ? (
        <BuyTable
          items={filteredItems}
          isLoading={false}
          canEdit
          canDelete
          onEditClick={editItem}
          onDeleteClick={deleteItem}
          onCustomerClick={() => {}}
        />
      ) : (
        <SellTable
          items={filteredItems}
          isLoading={false}
          canEdit
          canDelete
          onEditClick={editItem}
          onDeleteClick={deleteItem}
          onCustomerClick={() => {}}
        />
      )}
    </div>
  );
}
