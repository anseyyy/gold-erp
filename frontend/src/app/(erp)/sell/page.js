"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { customerApi, sellApi } from "@/lib/api";
import SellHeader from "./components/SellHeader";
import SellForm from "./components/SellForm";
import SellTable from "./components/SellTable";
import AddCustomerModal from "./components/AddCustomerModal";

export default function SellPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [selectedClientFilter, setSelectedClientFilter] = useState("ALL");

  // Form states
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [scrap, setScrap] = useState("");
  const [touch, setTouch] = useState("");
  const [pure, setPure] = useState("");
  const [scrapRate, setScrapRate] = useState("");
  const [pureIdrRate, setPureIdrRate] = useState("");
  const [dollarRate, setDollarRate] = useState("");
  const [payment, setPayment] = useState("USDT");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [editingSellId, setEditingSellId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");

  const calculatedPure = pure
    ? Number(pure)
    : (Number(scrap || 0) * Number(touch || 0)) / 100;
  const calculatedPureIdrRate = pureIdrRate
    ? Number(pureIdrRate)
    : Number(scrapRate || 0);
  const calculatedTotalIdr = calculatedPure * calculatedPureIdrRate;
  const calculatedTotalDollar = Number(dollarRate)
    ? calculatedTotalIdr / Number(dollarRate)
    : 0;

  const totalOrderValue = payment === "USDT" ? calculatedTotalDollar : calculatedTotalIdr;
  const calculatedBalance = totalOrderValue - (receivedAmount !== "" ? Number(receivedAmount) : totalOrderValue);

  const loadSells = useCallback(async () => {
    setApiError("");
    try {
      const data = await sellApi.getAll();
      setItems(data.items || []);
      setTotalSellAmount(Number(data.totalSellAmount || 0));
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Unable to load sell orders.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    sellApi
      .getAll()
      .then((data) => {
        if (active) {
          setItems(data.items || []);
          setTotalSellAmount(Number(data.totalSellAmount || 0));
        }
      })
      .catch((error) => {
        if (active)
          setApiError(
            error.response?.data?.message || "Unable to load sell orders.",
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
        const names = (data.items || [])
          .map((item) => item.name)
          .filter(Boolean);
        setCustomers(names);
        if (names.length > 0) {
          setSelectedCustomer((prev) => (prev ? prev : names[0]));
        }
      })
      .catch(() => setApiError("Unable to load customers."));
  }, []);

  // When opening form, default selectedCustomer to selectedClientFilter if set
  const handleToggleForm = () => {
    setIsFormOpen((prev) => {
      const nextState = !prev;
      if (nextState && selectedClientFilter !== "ALL") {
        setSelectedCustomer(selectedClientFilter);
      }
      return nextState;
    });
  };

  const clearForm = () => {
    setEditingSellId(null);
    setIsFormOpen(false);
    setDate(new Date().toISOString().slice(0, 10));
    setSelectedCustomer(selectedClientFilter !== "ALL" ? selectedClientFilter : (customers[0] || ""));
    setScrap("");
    setTouch("");
    setPure("");
    setScrapRate("");
    setPureIdrRate("");
    setDollarRate("");
    setPayment("USDT");
    setReceivedAmount("");
  };

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
        totalIdr: calculatedTotalIdr,
        totalDollar: calculatedTotalDollar,
        receivedAmount: receivedAmount !== "" ? Number(receivedAmount) : (payment === "USDT" ? calculatedTotalDollar : calculatedTotalIdr),
      };
      if (editingSellId) await sellApi.update(editingSellId, payload);
      else await sellApi.create(payload);
      await loadSells();
      clearForm();
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Unable to save sell order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const editSell = (item) => {
    setEditingSellId(item._id || item.id);
    setIsFormOpen(true);
    setDate(item.date ? new Date(item.date).toISOString().slice(0, 10) : "");
    setSelectedCustomer(item.customer || customers[0] || "");
    setScrap(item.scrap?.toString() || "");
    setTouch(item.touch?.toString() || "");
    setPure(item.scrap ? "" : item.pure?.toString() || "");
    setScrapRate(item.scrapRate?.toString() || "");
    setPureIdrRate(item.pureIdrRate?.toString() || "");
    setDollarRate(item.dollarRate?.toString() || "");
    setPayment(item.payment || "USDT");
    setReceivedAmount(item.receivedAmount?.toString() || "");
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
      setNewCustomerName("");
      setIsCustomerModalOpen(false);
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to save customer.");
    }
  };

  const handleCustomerClick = (customerName) => {
    if (!customerName) return;
    router.push(`/customer-ledger/${encodeURIComponent(customerName)}`);
  };

  // Filtered dataset for SellTable
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (
        selectedClientFilter !== "ALL" &&
        item.customer?.toLowerCase() !== selectedClientFilter.toLowerCase()
      ) {
        return false;
      }
      if (paymentFilter !== "ALL" && item.payment !== paymentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const custMatch = item.customer?.toLowerCase().includes(q);
        const pureMatch = String(item.pure || "").toLowerCase().includes(q);
        const idrMatch = String(item.totalIdr || "").toLowerCase().includes(q);
        if (!custMatch && !pureMatch && !idrMatch) return false;
      }
      return true;
    });
  }, [items, searchQuery, paymentFilter, selectedClientFilter]);

  // Recalculate total amount for selected client
  const filteredTotalSellAmount = useMemo(() => {
    if (selectedClientFilter === "ALL") return totalSellAmount;
    return filteredItems.reduce((acc, curr) => acc + (Number(curr.totalIdr) || 0), 0);
  }, [selectedClientFilter, totalSellAmount, filteredItems]);

  return (
    <div className="space-y-6">
      <SellHeader
        totalSellAmount={filteredTotalSellAmount}
        onAddCustomer={() => setIsCustomerModalOpen(true)}
        isFormOpen={isFormOpen}
        onToggleForm={handleToggleForm}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        customers={customers}
        selectedClientFilter={selectedClientFilter}
        setSelectedClientFilter={setSelectedClientFilter}
      />

      {/* Collapsible / Toggleable Sell Form */}
      {isFormOpen && (
        <SellForm
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
          receivedAmount={receivedAmount}
          setReceivedAmount={setReceivedAmount}
          isSubmitting={isSubmitting}
          isEditing={Boolean(editingSellId)}
          onCancelEdit={clearForm}
          onSubmit={submitSell}
          onAddCustomer={() => setIsCustomerModalOpen(true)}
          calculatedPure={calculatedPure}
          calculatedTotalIdr={calculatedTotalIdr}
          calculatedTotalDollar={calculatedTotalDollar}
          calculatedBalance={calculatedBalance}
        />
      )}

      {apiError && <p className="text-sm text-rose-600 font-semibold">{apiError}</p>}

      <SellTable
        items={filteredItems}
        isLoading={isLoading}
        canEdit
        canDelete
        onEditClick={editSell}
        onDeleteClick={async (id) => {
          await sellApi.delete(id);
          await loadSells();
        }}
        onCustomerClick={handleCustomerClick}
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
