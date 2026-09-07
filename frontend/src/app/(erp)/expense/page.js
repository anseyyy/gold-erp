"use client";

import React from "react";
import { expenseApi } from "@/lib/api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";

export default function ExpensePage() {
  const [items, setItems] = React.useState([]);
  const [editingExpense, setEditingExpense] = React.useState(null);
  const [apiError, setApiError] = React.useState("");

  const loadExpenses = async () => {
    try {
      const data = await expenseApi.getAll();
      setItems(data.items || []);
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to load expenses.");
    }
  };

  React.useEffect(() => {
    let active = true;
    expenseApi.getAll().then((data) => {
      if (active) setItems(data.items || []);
    }).catch((err) => {
      if (active) setApiError(err.response?.data?.message || "Unable to load expenses.");
    });
    return () => {
      active = false;
    };
  }, []);

  const saveExpense = async (data) => {
    setApiError("");
    try {
      if (editingExpense) {
        await expenseApi.update(editingExpense._id || editingExpense.id, data);
        setEditingExpense(null);
      } else {
        const result = await expenseApi.create(data);
        if (result?.item) setItems((current) => [result.item, ...current]);
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
        // If already deleted or not found on server, refresh list state silently
        await loadExpenses();
      } else {
        setApiError(error.response?.data?.message || "Failed to delete expense.");
      }
    }
  };

  return (
    <div className="space-y-6">
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
