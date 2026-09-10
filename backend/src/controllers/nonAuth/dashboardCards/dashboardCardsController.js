import DashboardCards from "../../../models/nonAuth/dashboardCards/dashboardCardsModel.js";
import Sell from "../../../models/nonAuth/sell/sellModel.js";
import Buy from "../../../models/nonAuth/buy/buyModel.js";
import Expense from "../../../models/nonAuth/expense/expenseModel.js";

export const getDashboardCardsData = async (_req, res) => {
  try {
    const now = new Date();

    // Fetch transactions filtering by USDT currency/payment to prevent IDR amounts from leaking into USDT metrics
    const [usdtSells, usdtBuys, usdtExpenses] = await Promise.all([
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
    ]);

    const isToday = (dateVal) => {
      if (!dateVal) return false;
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return false;
      return (
        (d.getUTCFullYear() === now.getUTCFullYear() &&
          d.getUTCMonth() === now.getUTCMonth() &&
          d.getUTCDate() === now.getUTCDate()) ||
        (d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate())
      );
    };

    // Filter today's USDT transactions
    const todaySells = usdtSells.filter(
      (item) => isToday(item.date) || isToday(item.createdAt)
    );
    const todayBuys = usdtBuys.filter(
      (item) => isToday(item.date) || isToday(item.createdAt)
    );
    const todayExpenses = usdtExpenses.filter(
      (item) => isToday(item.date) || isToday(item.createdAt)
    );

    // Today's metrics (in USDT)
    const todaySalesUsdt = todaySells.reduce(
      (sum, item) => sum + Number(item.totalDollar || 0),
      0
    );
    const todayBuyUsdt = todayBuys.reduce(
      (sum, item) => sum + Number(item.totalDollar || 0),
      0
    );
    const todayExpenseUsdt = todayExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const todayProfit = todaySalesUsdt - todayBuyUsdt;

    // All-time metrics (in USDT)
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

    // Save snapshot in DashboardCards model
    const cardsSnapshot = await DashboardCards.create({
      date: now,
      todaySalesUsdt,
      todaySalesIdr: 0,
      todayProfit,
      todayBuyAmount: todayBuyUsdt,
      todayExpenseAmount: todayExpenseUsdt,
      totalUsdtBalance,
      totalProfit,
      totalExpense,
      lastCalculatedAt: now,
    });

    return res.status(200).json({
      success: true,
      todaySalesUsdt,
      todaySalesIdr: 0,
      todayProfit,
      todayBuyUsdt,
      todayExpenseUsdt,
      totalUsdtBalance,
      totalProfit,
      totalExpense,
      snapshotId: cardsSnapshot._id,
      lastCalculatedAt: cardsSnapshot.lastCalculatedAt,
    });
  } catch (error) {
    console.error("Error in getDashboardCardsData:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard cards data",
    });
  }
};
