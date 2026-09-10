import Buy from "../buy/buyModel.js";
import Sell from "../sell/sellModel.js";
import Expense from "../expense/expenseModel.js";
import ManualTransaction from "../manualTransaction/manualTransactionModel.js";

const toTransaction = (item, type, source, amount, customer) => ({
  id: `${source.toUpperCase()}-${item._id}`,
  date: item.date,
  type,
  amount: Math.abs(Number(amount || 0)),
  customer: customer || item.customer || "",
  description: customer || item.customer || `${source} Transaction`,
  source,
  reference: `${source.toUpperCase()}-${String(item._id).slice(-6)}`,
  sourceId: item._id,
  notes: item.notes || item.description || "",
  createdAt: item.createdAt || item.date,
});

export const getIdrLedger = async () => {
  const [buys, sells, expenses, manuals] = await Promise.all([
    Buy.find({ payment: "IDR" }).lean(),
    Sell.find({ payment: "IDR" }).lean(),
    Expense.find({ currency: "IDR" }).lean(),
    ManualTransaction.find({ account: { $regex: /^idr$/i } }).lean(),
  ]);

  const rawTransactions = [
    ...sells.map((item) =>
      toTransaction(item, "Credit", "Sell", item.totalIdr),
    ),
    ...buys.map((item) =>
      toTransaction(item, "Debit", "Buy", item.totalIdr),
    ),
    ...expenses.map((item) =>
      toTransaction(item, "Debit", "Expense", item.amount, item.reason),
    ),
    ...manuals.map((item) =>
      toTransaction(item, item.type, item.source || "Manual", item.amount, item.customer),
    ),
  ];

  // Sort chronologically (oldest to newest)
  rawTransactions.sort(
    (left, right) =>
      new Date(left.date) - new Date(right.date) ||
      new Date(left.createdAt) - new Date(right.createdAt),
  );

  // Assign sequential reference numbers chronologically
  const sourceCounts = {};
  return rawTransactions.map((transaction) => {
    sourceCounts[transaction.source] =
      (sourceCounts[transaction.source] || 0) + 1;
    const refId = `${transaction.source.toUpperCase()}${String(sourceCounts[transaction.source]).padStart(3, "0")}`;
    return { ...transaction, id: refId, reference: refId };
  });
};
