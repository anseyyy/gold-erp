import Expense from "../../../models/nonAuth/expense/expenseModel.js";
import Buy from "../../../models/nonAuth/buy/buyModel.js";
import Sell from "../../../models/nonAuth/sell/sellModel.js";
import SubAccountBuy from "../../../models/nonAuth/subAccount/subAccountBuyModel.js";
import SubAccountSell from "../../../models/nonAuth/subAccount/subAccountSellModel.js";

export const getDashboardSummary = async (_req, res) => {
  try {
    const [usdtSells, usdtBuys, usdtExpenses, subUsdtSells, subUsdtBuys, recentSells, recentBuys, allSells, allBuys, allSubSells, allSubBuys] = await Promise.all([
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
      SubAccountSell.find({ payment: { $regex: /^usdt$/i } }).lean(),
      SubAccountBuy.find({ payment: { $regex: /^usdt$/i } }).lean(),
      Sell.find().sort({ date: -1, createdAt: -1 }).limit(5).lean(),
      Buy.find().sort({ date: -1, createdAt: -1 }).limit(5).lean(),
      Sell.find().lean(),
      Buy.find().lean(),
      SubAccountSell.find().lean(),
      SubAccountBuy.find().lean(),
    ]);

    const allUsdtSells = [...usdtSells, ...subUsdtSells];
    const allUsdtBuys = [...usdtBuys, ...subUsdtBuys];

    const totalSalesUsdt = allUsdtSells.reduce(
      (sum, item) => sum + Number(item.totalDollar || 0),
      0
    );
    const totalBuyUsdt = allUsdtBuys.reduce(
      (sum, item) => sum + Number(item.totalDollar || 0),
      0
    );
    const totalExpense = usdtExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalProfit = totalSalesUsdt - totalBuyUsdt;
    const totalUsdtBalance = totalProfit - totalExpense;

    // Calculate To Get (Receivables) and To Give (Payables)
    const combinedSells = [...allSells, ...allSubSells];
    const combinedBuys = [...allBuys, ...allSubBuys];

    const getMap = {};
    combinedSells.forEach((item) => {
      const bal = Number(item.balance || 0);
      if (bal > 0) {
        const cust = item.customer || "General Customer";
        if (!getMap[cust]) getMap[cust] = { customer: cust, amount: 0, orderCount: 0 };
        getMap[cust].amount += bal;
        getMap[cust].orderCount += 1;
      }
    });

    const giveMap = {};
    combinedBuys.forEach((item) => {
      const bal = Number(item.balance || 0);
      if (bal > 0) {
        const cust = item.customer || "General Customer";
        if (!giveMap[cust]) giveMap[cust] = { customer: cust, amount: 0, orderCount: 0 };
        giveMap[cust].amount += bal;
        giveMap[cust].orderCount += 1;
      }
    });

    const toGetByCustomer = Object.values(getMap).sort((a, b) => b.amount - a.amount);
    const toGiveByCustomer = Object.values(giveMap).sort((a, b) => b.amount - a.amount);

    const totalToGet = toGetByCustomer.reduce((sum, i) => sum + i.amount, 0);
    const totalToGive = toGiveByCustomer.reduce((sum, i) => sum + i.amount, 0);

    // Calculate Gold Stock Metrics
    const totalPureGoldBought = combinedBuys.reduce((sum, item) => sum + Number(item.pure || 0), 0);
    const totalPureGoldSold = combinedSells.reduce((sum, item) => sum + Number(item.pure || 0), 0);
    const totalGoldBalance = totalPureGoldBought - totalPureGoldSold;

    return res.json({
      totalExpense,
      totalUsdtBalance,
      totalProfit,
      totalToGet,
      totalToGive,
      totalPureGoldBought,
      totalPureGoldSold,
      totalGoldBalance,
      toGetByCustomer,
      toGiveByCustomer,
      recentSells,
      recentBuys,
      currency: "USDT",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
