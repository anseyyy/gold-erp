"use client";

import React from "react";
import UsdtTransaction from "./components/UsdtTransaction";
import TopCards from "./components/TopCards";
import { usdtApi } from "@/lib/api";

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

    usdtApi
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
              "Unable to load USDT account.",
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
      <TopCards summary={account} isLoading={isLoading} />
      <UsdtTransaction
        transactions={account.items}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default Page;
