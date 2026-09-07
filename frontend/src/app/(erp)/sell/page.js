"use client";

import React from "react";
import { customerApi, sellApi } from "@/lib/api";
import SellHeader from "./components/SellHeader";
import SellForm from "./components/SellForm";
import SellTable from "./components/SellTable";
import AddCustomerModal from "./components/AddCustomerModal";

export default function SellPage() {
  const [items, setItems] = React.useState([]);
  const [totalSellAmount, setTotalSellAmount] = React.useState(0);
  const [customers, setCustomers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
  const [scrap, setScrap] = React.useState("");
  const [touch, setTouch] = React.useState("");
  const [pure, setPure] = React.useState("");
  const [scrapRate, setScrapRate] = React.useState("");
  const [pureIdrRate, setPureIdrRate] = React.useState("");
  const [dollarRate, setDollarRate] = React.useState("");
  const [payment, setPayment] = React.useState("USDT");
  const [editingSellId, setEditingSellId] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [newCustomerName, setNewCustomerName] = React.useState("");

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
  const calculatedBalance =
    payment === "USDT" ? calculatedTotalDollar : calculatedTotalIdr;

  const loadSells = React.useCallback(async () => {
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

  React.useEffect(() => {
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
  React.useEffect(() => {
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

  const clearForm = () => {
    setEditingSellId(null);
    setDate(new Date().toISOString().slice(0, 10));
    setSelectedCustomer(customers[0] || "");
    setScrap("");
    setTouch("");
    setPure("");
    setScrapRate("");
    setPureIdrRate("");
    setDollarRate("");
    setPayment("USDT");
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
        balance: calculatedBalance,
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
    setDate(item.date ? new Date(item.date).toISOString().slice(0, 10) : "");
    setSelectedCustomer(item.customer || customers[0] || "");
    setScrap(item.scrap?.toString() || "");
    setTouch(item.touch?.toString() || "");
    setPure(item.scrap ? "" : item.pure?.toString() || "");
    setScrapRate(item.scrapRate?.toString() || "");
    setPureIdrRate(item.pureIdrRate?.toString() || "");
    setDollarRate(item.dollarRate?.toString() || "");
    setPayment(item.payment || "USDT");
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

  return (
    <div className="space-y-6">
      <SellHeader
        totalSellAmount={totalSellAmount}
        onAddCustomer={() => setIsCustomerModalOpen(true)}
      />
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
      {apiError && <p className="text-sm text-rose-600">{apiError}</p>}
      <SellTable
        items={items}
        isLoading={isLoading}
        canEdit
        canDelete
        onEditClick={editSell}
        onDeleteClick={async (id) => {
          await sellApi.delete(id);
          await loadSells();
        }}
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
