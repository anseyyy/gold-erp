import Expense from "../../../models/nonAuth/expense/expenseModel.js";
import Buy from "../../../models/nonAuth/buy/buyModel.js";
import Sell from "../../../models/nonAuth/sell/sellModel.js";
import { getUsdtLedger } from "../../../models/nonAuth/usdt/usdtModel.js";

export const getDashboardSummary = async (_req, res) => {
  try {
    const rawLedger = await getUsdtLedger();
    let runningBalance = 0;
    const chronologicalItems = rawLedger.map((transaction) => {
      const amount = Math.abs(Number(transaction.amount || 0));
      runningBalance += transaction.type === "Credit" ? amount : -amount;
      return { ...transaction, balance: runningBalance };
    });

    const totalCredit = chronologicalItems
      .filter((item) => item.type === "Credit")
      .reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);
    const totalExpense = chronologicalItems
      .filter((item) => item.source === "Expense")
      .reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);
    const totalBuy = chronologicalItems
      .filter((item) => item.source === "Buy")
      .reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);

    const totalProfit = totalCredit - totalBuy;
    const totalUsdtBalance = totalProfit - totalExpense;

    const [recentSells, recentBuys] = await Promise.all([
      Sell.find().sort({ date: -1, createdAt: -1 }).limit(5).lean(),
      Buy.find().sort({ date: -1, createdAt: -1 }).limit(5).lean(),
    ]);

    return res.json({
      totalExpense,
      totalUsdtBalance,
      totalProfit,
      recentSells,
      recentBuys,
      currency: "USDT",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

