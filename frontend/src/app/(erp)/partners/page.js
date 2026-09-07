"use client";

import React, { useEffect, useState } from "react";
import PartnerHeader from "./components/PartnerHeader";
import PartnerList from "./components/PartnerList";
import { partnersApi } from "@/lib/api";

export default function PartnersPage() {
  const [account, setAccount] = useState({
    partners: [],
    totalBusinessProfit: 0,
    partnerCount: 0,
    equalShare: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const applyAccount = (data) => {
    setAccount({
      partners: data.partners || [],
      totalBusinessProfit: data.totalBusinessProfit || 0,
      partnerCount: data.partnerCount || 0,
      equalShare: data.equalShare || 0,
    });
  };

  const loadPartners = async (active = true) => {
    try {
      const data = await partnersApi.getAll();
      if (!active) return;
      applyAccount(data);
      setError("");
    } catch (requestError) {
      if (active) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load partners from the backend.",
        );
      }
    } finally {
      if (active) setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    partnersApi
      .getAll()
      .then((data) => {
        if (active) {
          applyAccount(data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load partners from the backend.",
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

  const handleAddPartner = async (name) => {
    try {
      await partnersApi.addPartner({ name });
      setIsLoading(true);
      await loadPartners();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to add partner.",
      );
    }
  };

  const handleAddEntry = async (partnerId, entry) => {
    try {
      await partnersApi.addLedgerEntry({ partnerId, ...entry });
      setIsLoading(true);
      await loadPartners();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to add partner ledger entry.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <PartnerHeader
        partners={account.partners}
        onAddPartner={handleAddPartner}
      />
      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      )}
      {isLoading && account.partners.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
          Loading partners...
        </p>
      )}
      <PartnerList
        totalProfit={account.totalBusinessProfit}
        partners={account.partners}
        onAddEntry={handleAddEntry}
      />
    </div>
  );
}
