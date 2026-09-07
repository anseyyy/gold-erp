import Buy from "../buy/buyModel.js";
import Sell from "../sell/sellModel.js";
import Expense from "../expense/expenseModel.js";

const toTransaction = (item, type, source, amount, customer) => ({
  id: `${source.toUpperCase()}-${item._id}`,
  date: item.date,
  type,
  amount: Math.abs(Number(amount || 0)),
  customer: customer || item.customer || "",
  source,
  reference: `${source.toUpperCase()}-${String(item._id).slice(-6)}`,
  sourceId: item._id,
  notes: item.notes || item.description || "",
  createdAt: item.createdAt || item.date,
});

export const getUsdtLedger = async () => {
  const [buys, sells, expenses] = await Promise.all([
    Buy.find({ payment: "USDT" }).lean(),
    Sell.find({ payment: "USDT" }).lean(),
    Expense.find({ currency: "USDT" }).lean(),
  ]);

  const rawTransactions = [
    ...sells.map((item) =>
      toTransaction(item, "Credit", "Sell", item.totalDollar),
    ),
    ...buys.map((item) =>
      toTransaction(item, "Debit", "Buy", item.totalDollar),
    ),
    ...expenses.map((item) =>
      toTransaction(item, "Debit", "Expense", item.amount, item.reason),
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

