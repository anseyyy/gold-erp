"use client";

import React, { useState, useEffect } from "react";
import IdrTopCards from "./components/IdrTopCards";
import IdrTransaction from "./components/IdrTransaction";
import Button from "@/components/ui/Button";
import ManualTransactionModal from "@/components/ui/ManualTransactionModal";
import { idrApi } from "@/lib/api";
import Link from "next/link";
import { Plus, Coins, RefreshCw, FileSpreadsheet } from "lucide-react";

function Page() {
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
    idrApi
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
            "Unable to load IDR account.",
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
    await idrApi.createManual(formData);
    loadAccount();
  };

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              IDR Ledger Account
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Real-time IDR cash credits, debits, buy/sell orders, and manual ledger entries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/spreadsheet?module=idr">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              className="border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold"
            >
              View IDR Spreadsheet Page
            </Button>
          </Link>

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
            variant="pastelSuccess"
            icon={Plus}
            onClick={() => setIsManualModalOpen(true)}
            className="shadow-sm"
          >
            Add Manual IDR Entry
          </Button>
        </div>
      </div>

      <IdrTopCards
        totalCredit={account.totalCredit}
        totalDebit={account.totalDebit}
        balance={account.balance}
        isLoading={isLoading}
      />

      <IdrTransaction
        transactions={account.items}
        isLoading={isLoading}
        error={error}
      />

      <ManualTransactionModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleCreateManual}
        accountType="IDR"
      />
    </div>
  );
}

export default Page;