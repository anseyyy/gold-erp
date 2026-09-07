"use client";

import React from "react";
import { expenseApi } from "@/lib/api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";

export default function ExpensePage() {
  const [items, setItems] = React.useState([]);
  const [editingExpense, setEditingExpense] = React.useState(null);

  const loadExpenses = async () => {
    const data = await expenseApi.getAll();
    setItems(data.items || []);
  };

  React.useEffect(() => {
    let active = true;
    expenseApi.getAll().then((data) => {
      if (active) setItems(data.items || []);
    });
    return () => {
      active = false;
    };
  }, []);

  const saveExpense = async (data) => {
    if (editingExpense) {
      await expenseApi.update(editingExpense._id || editingExpense.id, data);
      setEditingExpense(null);
    } else {
      const result = await expenseApi.create(data);
      if (result?.item) setItems((current) => [result.item, ...current]);
    }
    await loadExpenses();
  };

  const deleteExpense = async (id) => {
    await expenseApi.delete(id);
    await loadExpenses();
  };

  return (
    <div className="space-y-6">
      <ExpenseForm
        key={editingExpense?._id || editingExpense?.id || "new"}
        expense={editingExpense}
        onSubmit={saveExpense}
        onCancel={() => setEditingExpense(null)}
      />
      <ExpenseTable
        items={items}
        onEdit={setEditingExpense}
        onDelete={deleteExpense}
      />
    </div>
  );
}
