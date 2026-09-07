"use client";

import React from "react";
import IdrTopCards from "./components/IdrTopCards";
import IdrTransaction from "./components/IdrTransaction";
import { idrApi } from "@/lib/api";

function Page() {
  const [account, setAccount] = React.useState({
    items: [],
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let active = true;

    idrApi
      .getAll()
      .then((data) => {
        if (active) {
          setAccount({
            items: data.items || [],
            totalCredit: data.totalCredit || 0,
            totalDebit: data.totalDebit || 0,
            balance: data.balance ?? data.netBalance ?? 0,
          });
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load IDR account.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
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
    </div>
  );
}

export default Page;