import { getUsdtLedger } from "../../../models/nonAuth/usdt/usdtModel.js";

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

    const balance = totalCredit - totalDebit;

    return res.json({
      items,
      totalCredit,
      totalDebit,
      balance,
      netBalance: balance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

