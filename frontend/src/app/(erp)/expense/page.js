"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { expenseApi } from "@/lib/api";
import ExpenseCards from "./components/ExpenseCards";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";

export default function ExpensePage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState({ totalUsdt: 0, totalIdr: 0, totalCount: 0 });
  const [editingExpense, setEditingExpense] = useState(null);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await expenseApi.getAll();
      const fetchedItems = data.items || [];
      setItems(fetchedItems);

      // Compute total USDT, IDR, and count from backend totals or fallback
      const totalUsdt = data.totalUsdt ?? fetchedItems
        .filter((i) => i.currency === "USDT")
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

      const totalIdr = data.totalIdr ?? fetchedItems
        .filter((i) => i.currency === "IDR")
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

      setTotals({
        totalUsdt,
        totalIdr,
        totalCount: data.totalCount ?? fetchedItems.length,
      });
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to load expenses.");
    } fontally: {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const saveExpense = async (data) => {
    setApiError("");
    try {
      if (editingExpense) {
        await expenseApi.update(editingExpense._id || editingExpense.id, data);
        setEditingExpense(null);
      } else {
        await expenseApi.create(data);
      }
      await loadExpenses();
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Failed to save expense. Please check all required fields."
      );
    }
  };

  const deleteExpense = async (id) => {
    if (!id) return;
    setApiError("");
    try {
      await expenseApi.delete(id);
      await loadExpenses();
    } catch (error) {
      if (error.response?.status === 404) {
        await loadExpenses();
      } else {
        setApiError(error.response?.data?.message || "Failed to delete expense.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Total Expense Cards Header */}
      <ExpenseCards
        totalUsdt={totals.totalUsdt}
        totalIdr={totals.totalIdr}
        totalCount={totals.totalCount}
        onOpenSpreadsheet={() => router.push('/spreadsheet?module=expense')}
      />

      {/* Expense Entry Form */}
      <ExpenseForm
        key={editingExpense?._id || editingExpense?.id || "new"}
        expense={editingExpense}
        onSubmit={saveExpense}
        onCancel={() => {
          setApiError("");
          setEditingExpense(null);
        }}
        apiError={apiError}
      />

      {/* Expense Data Table */}
      <ExpenseTable
        items={items}
        onEdit={(item) => {
          setApiError("");
          setEditingExpense(item);
        }}
        onDelete={deleteExpense}
      />
    </div>
  );
}
