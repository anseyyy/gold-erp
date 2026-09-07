"use client";

import React from "react";
import { buyApi, customerApi } from "@/lib/api";
import BuyHeader from "./components/BuyHeader";
import BuyForm from "./components/BuyForm";
import BuyTable from "./components/BuyTable";
import AddCustomerModal from "./components/AddCustomerModal";

export default function BuyPage() {
  const [items, setItems] = React.useState([]);
  const [totalBuyAmount, setTotalBuyAmount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
  const [customers, setCustomers] = React.useState([]);
  const [scrap, setScrap] = React.useState("");
  const [touch, setTouch] = React.useState("");
  const [pure, setPure] = React.useState("");
  const [scrapRate, setScrapRate] = React.useState("");
  const [pureIdrRate, setPureIdrRate] = React.useState("");
  const [dollarRate, setDollarRate] = React.useState("");
  const [payment, setPayment] = React.useState("USDT");
  const [editingBuyId, setEditingBuyId] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [newCustomerName, setNewCustomerName] = React.useState("");

  const calculatedPure = pure
    ? Number(pure)
    : Number(scrap || 0) * Number(touch || 0);
  const calculatedPureIdrRate = pureIdrRate
    ? Number(pureIdrRate)
    : Number(touch) > 0
      ? Number(scrapRate || 0) / Number(touch)
      : 0;
  const calculatedTotalIdr = calculatedPure * calculatedPureIdrRate;
  const calculatedTotalDollar = Number(dollarRate)
    ? calculatedTotalIdr / Number(dollarRate)
    : 0;
  const calculatedBalance =
    payment === "USDT" ? calculatedTotalDollar : calculatedTotalIdr;

  const loadBuys = React.useCallback(async () => {
    setApiError("");
    try {
      const data = await buyApi.getAll();
      setItems(data.items || []);
      setTotalBuyAmount(Number(data.totalBuyAmount || 0));
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Unable to load buy orders.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    buyApi
      .getAll()
      .then((data) => {
        if (active) {
          setItems(data.items || []);
          setTotalBuyAmount(Number(data.totalBuyAmount || 0));
        }
      })
      .catch((error) => {
        if (active)
          setApiError(
            error.response?.data?.message || "Unable to load buy orders.",
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
      .catch(() => {
        setApiError("Unable to load customers.");
      });
  }, []);

  const submitBuy = async (event) => {
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
      if (editingBuyId) {
        await buyApi.update(editingBuyId, payload);
      } else {
        await buyApi.create(payload);
      }
      await loadBuys();
      setEditingBuyId(null);
      setScrap("");
      setTouch("");
      setPure("");
      setScrapRate("");
      setPureIdrRate("");
      setDollarRate("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editBuy = (item) => {
    setEditingBuyId(item._id || item.id);
    setDate(item.date ? new Date(item.date).toISOString().slice(0, 10) : "");
    setSelectedCustomer(item.customer || customers[0] || "");
    setCustomers((current) =>
      current.includes(item.customer) || !item.customer
        ? current
        : [...current, item.customer],
    );
    setScrap(item.scrap?.toString() || "");
    setTouch(item.touch?.toString() || "");
    setPure(item.scrap ? "" : item.pure?.toString() || "");
    setScrapRate(item.scrapRate?.toString() || "");
    setPureIdrRate(item.pureIdrRate?.toString() || "");
    setDollarRate(item.dollarRate?.toString() || "");
    setPayment(item.payment || "USDT");
  };

  const cancelEdit = () => {
    setEditingBuyId(null);
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

  const deleteBuy = async (id) => {
    await buyApi.delete(id);
    await loadBuys();
  };

  return (
    <div className="space-y-6">
      <BuyHeader
        totalBuyAmount={totalBuyAmount}
        onAddCustomer={() => setIsCustomerModalOpen(true)}
      />
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
        isSubmitting={isSubmitting}
        isEditing={Boolean(editingBuyId)}
        onCancelEdit={cancelEdit}
        onSubmit={submitBuy}
        onAddCustomer={() => setIsCustomerModalOpen(true)}
        calculatedPure={calculatedPure}
        calculatedPureIdrRate={calculatedPureIdrRate}
        calculatedTotalIdr={calculatedTotalIdr}
        calculatedTotalDollar={calculatedTotalDollar}
        calculatedBalance={calculatedBalance}
      />
      {apiError && <p className="text-sm text-rose-600">{apiError}</p>}
      <BuyTable
        items={items}
        isLoading={isLoading}
        canEdit
        canDelete
        onEditClick={editBuy}
        onDeleteClick={deleteBuy}
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
