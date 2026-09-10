import Expense from "../../../models/nonAuth/expense/expenseModel.js";
import Buy from "../../../models/nonAuth/buy/buyModel.js";
import Sell from "../../../models/nonAuth/sell/sellModel.js";

export const getDashboardSummary = async (_req, res) => {
  try {
    const [usdtSells, usdtBuys, usdtExpenses, recentSells, recentBuys] = await Promise.all([
      Sell.find({ payment: { $regex: /^usdt$/i } }).lean(),
      Buy.find({ payment: { $regex: /^usdt$/i } }).lean(),
      Expense.find({
        $or: [
          { currency: { $regex: /^usdt$/i } },
          { currency: { $exists: false } },
          { currency: null },
          { currency: "" },
        ],
      }).lean(),
      Sell.find().sort({ date: -1, createdAt: -1 }).limit(5).lean(),
      Buy.find().sort({ date: -1, createdAt: -1 }).limit(5).lean(),
    ]);

    const totalSalesUsdt = usdtSells.reduce(
      (sum, item) => sum + Number(item.totalDollar || 0),
      0
    );
    const totalBuyUsdt = usdtBuys.reduce(
      (sum, item) => sum + Number(item.totalDollar || 0),
      0
    );
    const totalExpense = usdtExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalProfit = totalSalesUsdt - totalBuyUsdt;
    const totalUsdtBalance = totalProfit - totalExpense;

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
