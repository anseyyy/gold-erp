"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UsdtTransaction from "./components/UsdtTransaction";
import TopCards from "./components/TopCards";
import Button from "@/components/ui/Button";
import ManualTransactionModal from "@/components/ui/ManualTransactionModal";
import { usdtApi, buyApi, sellApi, expenseApi } from "@/lib/api";
import { Plus, Wallet, RefreshCw, FileSpreadsheet } from "lucide-react";

function Page() {
  const router = useRouter();
  const [account, setAccount] = useState({
    items: [],
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const loadAccount = () => {
    setIsLoading(true);
    setError("");
    usdtApi
      .getAll()
      .then((data) => {
        setAccount({
          items: data.items || [],
          totalCredit: data.totalCredit || 0,
          totalDebit: data.totalDebit || 0,
          balance: data.balance ?? data.netBalance ?? 0,
        });
      })
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            "Unable to load USDT account.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const handleCreateManual = async (formData) => {
    await usdtApi.createManual(formData);
    loadAccount();
  };

  const handleDeleteTransaction = async (transaction) => {
    const id = transaction.sourceId || transaction._id || transaction.id;
    if (!id) return;
    if (
      !confirm(
        `Are you sure you want to delete this ${transaction.source || 'USDT'} transaction (${transaction.amount} USDT)?`
      )
    ) {
      return;
    }
    try {
      if (transaction.source === 'Manual' || !transaction.source) {
        await usdtApi.delete(id);
      } else if (transaction.source === 'Buy') {
        await buyApi.delete(id);
      } else if (transaction.source === 'Sell') {
        await sellApi.delete(id);
      } else if (transaction.source === 'Expense') {
        await expenseApi.delete(id);
      }
      loadAccount();
    } catch (err) {
      console.error('Failed to delete USDT transaction:', err);
      alert(err.response?.data?.message || 'Failed to delete transaction.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-500" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              USDT Ledger Account
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Real-time USDT credit, debit, buy/sell transactions, and manual entries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={() => router.push('/spreadsheet?module=usdt')}
          >
            View USDT Spreadsheet Page
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={loadAccount}
          >
            Refresh
          </Button>

          <Button
            type="button"
            variant="pastelPrimary"
            icon={Plus}
            onClick={() => setIsManualModalOpen(true)}
            className="shadow-sm"
          >
            Add Manual USDT Entry
          </Button>
        </div>
      </div>

      <TopCards summary={account} isLoading={isLoading} />
      <UsdtTransaction
        transactions={account.items}
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteTransaction}
      />

      <ManualTransactionModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleCreateManual}
        accountType="USDT"
      />
    </div>
  );
}

export default Page;
