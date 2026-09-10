import DashboardCards from "../../../models/nonAuth/dashboardCards/dashboardCardsModel.js";
import Sell from "../../../models/nonAuth/sell/sellModel.js";
import Buy from "../../../models/nonAuth/buy/buyModel.js";
import Expense from "../../../models/nonAuth/expense/expenseModel.js";
import SubAccountBuy from "../../../models/nonAuth/subAccount/subAccountBuyModel.js";
import SubAccountSell from "../../../models/nonAuth/subAccount/subAccountSellModel.js";

export const getDashboardCardsData = async (_req, res) => {
  try {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const localTodayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);

    const isToday = (dateVal) => {
      if (!dateVal) return false;
      if (typeof dateVal === "string") {
        const dStr = dateVal.slice(0, 10);
        if (dStr === todayStr || dStr === localTodayStr) return true;
      }
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return false;
      const dIso = d.toISOString().slice(0, 10);
      return dIso === todayStr || dIso === localTodayStr;
    };

    // Fetch all transactions from Buy, Sell, SubAccountBuy, SubAccountSell, and Expense
    const [rawBuys, rawSells, subBuys, subSells, usdtExpenses] = await Promise.all([
      Buy.find().lean(),
      Sell.find().lean(),
      SubAccountBuy.find().lean(),
      SubAccountSell.find().lean(),
      Expense.find().lean(),
    ]);

    const allSells = [...rawSells, ...subSells];
    const allBuys = [...rawBuys, ...subBuys];

    // Filter today's transactions
    const todaySells = allSells.filter(
      (item) => isToday(item.date) || isToday(item.createdAt)
    );
    const todayBuys = allBuys.filter(
      (item) => isToday(item.date) || isToday(item.createdAt)
    );
    const todayExpenses = usdtExpenses.filter(
      (item) => isToday(item.date) || isToday(item.createdAt)
    );

    // Today's metrics (in USDT)
    const todaySalesUsdt = todaySells.reduce(
      (sum, item) => sum + Number(item.totalDollar || (item.dollarRate > 0 ? item.totalIdr / item.dollarRate : 0)),
      0
    );
    const todayBuyUsdt = todayBuys.reduce(
      (sum, item) => sum + Number(item.totalDollar || (item.dollarRate > 0 ? item.totalIdr / item.dollarRate : 0)),
      0
    );
    const todayExpenseUsdt = todayExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const todayProfit = todaySalesUsdt - todayBuyUsdt;

    // All-time metrics (in USDT)
    const totalSalesUsdt = allSells.reduce(
      (sum, item) => sum + Number(item.totalDollar || (item.dollarRate > 0 ? item.totalIdr / item.dollarRate : 0)),
      0
    );
    const totalBuyUsdt = allBuys.reduce(
      (sum, item) => sum + Number(item.totalDollar || (item.dollarRate > 0 ? item.totalIdr / item.dollarRate : 0)),
      0
    );
    const totalExpense = usdtExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalProfit = totalSalesUsdt - totalBuyUsdt;
    const totalUsdtBalance = totalProfit - totalExpense;

    // Gold Stock Metrics (in grams)
    const totalPureGoldBought = allBuys.reduce(
      (sum, item) => sum + Number(item.pure || 0),
      0
    );
    const totalPureGoldSold = allSells.reduce(
      (sum, item) => sum + Number(item.pure || 0),
      0
    );
    const totalGoldBalance = totalPureGoldBought - totalPureGoldSold;

    return res.status(200).json({
      success: true,
      todaySalesUsdt,
      todaySalesIdr: 0,
      todayProfit,
      todayBuyUsdt,
      todayExpenseUsdt,
      totalSalesUsdt,
      totalBuyUsdt,
      totalUsdtBalance,
      totalProfit,
      totalExpense,
      totalPureGoldBought,
      totalPureGoldSold,
      totalGoldBalance,
      lastCalculatedAt: now,
    });
  } catch (error) {
    console.error("Error in getDashboardCardsData:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard cards data",
    });
  }
};
