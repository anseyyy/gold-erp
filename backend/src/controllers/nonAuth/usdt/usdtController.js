import { getUsdtLedger } from "../../../models/nonAuth/usdt/usdtModel.js";
import ManualTransaction from "../../../models/nonAuth/manualTransaction/manualTransactionModel.js";

export const getUsdtAccount = async (_req, res) => {
  try {
    const rawLedger = await getUsdtLedger();
    let runningBalance = 0;
    const chronologicalItems = rawLedger.map((transaction) => {
      const amount = Math.abs(Number(transaction.amount || 0));
      runningBalance += transaction.type === "Credit" ? amount : -amount;
      return { ...transaction, balance: runningBalance };
    });

    const items = [...chronologicalItems].sort(
      (left, right) =>
        new Date(right.date) - new Date(left.date) ||
        new Date(right.createdAt) - new Date(left.createdAt),
    );

    const totalCredit = items
      .filter((item) => item.type === "Credit")
      .reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);
    const totalDebit = items
      .filter((item) => item.type === "Debit")
      .reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);
    const totalExpense = items
      .filter((item) => item.source === "Expense")
      .reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);
    const totalBuy = items
      .filter((item) => item.source === "Buy")
      .reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);

    const totalProfit = totalCredit - totalBuy;
    const balance = totalCredit - totalDebit;

    return res.json({
      items,
      totalCredit,
      totalDebit,
      totalBuy,
      totalExpense,
      totalProfit,
      balance,
      netBalance: balance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUsdtManual = async (req, res) => {
  try {
    const { date, type, amount, customer, notes } = req.body;
    const item = await ManualTransaction.create({
      account: "USDT",
      date: date || new Date(),
      type: type === "Credit" ? "Credit" : "Debit",
      amount: Number(amount || 0),
      customer: customer || "Manual Entry",
      source: "Manual",
      notes: notes || "",
      createdBy: req.user?._id,
    });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteUsdtManual = async (req, res) => {
  try {
    const item = await ManualTransaction.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Transaction not found" });
    return res.json({ message: "Transaction deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
