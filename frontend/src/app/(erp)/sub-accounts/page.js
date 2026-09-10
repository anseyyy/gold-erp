'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { subAccountApi, customerApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import SummaryCard from '@/components/dashboard/SummaryCard';
import Modal from '@/components/ui/Modal';
import CustomerSelect from '@/components/ui/CustomerSelect';
import {
  FolderKanban,
  Plus,
  Search,
  ShoppingBag,
  TrendingUp,
  User,
  ArrowRight,
  Trash2,
  Edit2,
  FolderPlus,
} from 'lucide-react';
import { formatIDR } from '@/lib/utils/formatters';

export default function SubAccountsPage() {
  const router = useRouter();
  const [subAccounts, setSubAccounts] = useState([]);
  const [overallBuyTotal, setOverallBuyTotal] = useState(0);
  const [overallSellTotal, setOverallSellTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubAccountId, setEditingSubAccountId] = useState(null);
  const [name, setName] = useState('');
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSubAccounts = useCallback(async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const data = await subAccountApi.getAll();
      setSubAccounts(data.items || []);
      setOverallBuyTotal(Number(data.overallBuyTotal || 0));
      setOverallSellTotal(Number(data.overallSellTotal || 0));
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to load sub accounts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSubAccounts();
  }, [loadSubAccounts]);

  const handleOpenCreateModal = () => {
    setEditingSubAccountId(null);
    setName('');
    setCustomer('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, acc) => {
    e.stopPropagation();
    setEditingSubAccountId(acc._id || acc.id);
    setName(acc.name || '');
    setCustomer(acc.customer || '');
    setDescription(acc.description || '');
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    if (!name.trim() || !customer.trim()) {
      setApiError('Please enter sub account name and select a client.');
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    try {
      const payload = {
        name: name.trim(),
        customer: customer.trim(),
        description: description.trim(),
      };
      if (editingSubAccountId) {
        await subAccountApi.update(editingSubAccountId, payload);
      } else {
        await subAccountApi.create(payload);
      }
      setIsModalOpen(false);
      await loadSubAccounts();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save sub account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubAccount = async (e, id, accName) => {
    e.stopPropagation();
    if (
      !confirm(
        `Are you sure you want to delete sub account "${accName}"? All buy and sell transactions inside it will be permanently deleted.`
      )
    ) {
      return;
    }

    try {
      await subAccountApi.delete(id);
      await loadSubAccounts();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to delete sub account.');
    }
  };

  const filteredSubAccounts = useMemo(() => {
    if (!searchQuery.trim()) return subAccounts;
    const q = searchQuery.toLowerCase();
    return subAccounts.filter(
      (acc) =>
        acc.name?.toLowerCase().includes(q) ||
        acc.customer?.toLowerCase().includes(q) ||
        acc.description?.toLowerCase().includes(q)
    );
  }, [subAccounts, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Page Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Sub Accounts Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Create and manage client sub-accounts with independent Buy and Sell balance sheets.
          </p>
        </div>

        <Button
          type="button"
          variant="pastelPrimary"
          size="sm"
          icon={Plus}
          onClick={handleOpenCreateModal}
          className="shadow-sm"
        >
          + Create Sub Account
        </Button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Sub Accounts"
          value={subAccounts.length.toString()}
          subtitle="Registered sub-account folders"
          icon={FolderKanban}
          variant="indigo"
        />
        <SummaryCard
          title="Cumulative Buy Total"
          value={formatIDR(overallBuyTotal)}
          subtitle="Across all sub accounts"
          icon={ShoppingBag}
          variant="indigo"
        />
        <SummaryCard
          title="Cumulative Sell Total"
          value={formatIDR(overallSellTotal)}
          subtitle="Across all sub accounts"
          icon={TrendingUp}
          variant="emerald"
        />
      </div>

      {/* Search Bar Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search sub accounts by folder name or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {apiError && <p className="text-sm text-rose-600 font-semibold">{apiError}</p>}

      {/* Sub Account Folders Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-semibold">
          Loading sub accounts directory...
        </div>
      ) : filteredSubAccounts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center">
          <FolderPlus className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Sub Accounts Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No sub accounts matching "${searchQuery}".`
              : 'Create your first sub-account folder to start recording buy and sell transactions.'}
          </p>
          <Button
            type="button"
            variant="pastelPrimary"
            size="sm"
            onClick={handleOpenCreateModal}
            className="mt-4"
          >
            + Create Sub Account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubAccounts.map((acc) => (
            <div
              key={acc._id || acc.id}
              onClick={() => router.push(`/sub-accounts/${acc._id || acc.id}`)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Card Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 group-hover:scale-105 transition-transform">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {acc.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        <User className="w-3 h-3 text-indigo-500" />
                        <span>{acc.customer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(e, acc)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      title="Edit Sub Account"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSubAccount(e, acc._id || acc.id, acc.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      title="Delete Sub Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {acc.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 italic">
                    &quot;{acc.description}&quot;
                  </p>
                )}

                {/* Sub Account Totals Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 my-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Buy
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {formatIDR(acc.totalBuyAmount || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Sell
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatIDR(acc.totalSellAmount || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Open Sub Account</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal to Create / Edit Sub Account */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubAccountId ? 'Edit Sub Account' : 'Create New Sub Account'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitModal} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1 tracking-wider">
              Sub Account Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Podiyana, Branch Alpha, Gold Traders..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <CustomerSelect
            label="Linked Client / Customer *"
            value={customer}
            onChange={setCustomer}
            placeholder="Select or enter client name..."
          />

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1 tracking-wider">
              Description / Remarks (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add optional notes for this sub account folder..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="pastelPrimary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : editingSubAccountId
                ? 'Save Changes'
                : 'Create Sub Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
