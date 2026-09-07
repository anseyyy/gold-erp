import axiosInstance from "../axios";
import { localStore } from "./store";
import { calculateProfit, calculateNetBalance } from "../utils/calculations";

export const dashboardApi = {
  getSummary: async () => {
    try {
      const res = await axiosInstance.get("/dashboard/summary");
      return res.data;
    } catch (err) {
      // Local store calculations
      const usdtList = localStore.get("usdt");
      const expenseList = localStore.get("expenses");
      const buyList = localStore.get("buy");
      const sellList = localStore.get("sell");

      const podiyanaBuy = localStore.get("podiyanaBuy");
      const podiyanaSell = localStore.get("podiyanaSell");
      const pudiyanaBuy = localStore.get("pudiyanaBuy");
      const pudiyanaSell = localStore.get("pudiyanaSell");

      // Aggregate credit/debit for USDT
      const totalCredit = usdtList
        .filter((i) => i.type === "Credit")
        .reduce((sum, i) => sum + Number(i.amount || 0), 0);

      const totalDebit = usdtList
        .filter((i) => i.type === "Debit")
        .reduce((sum, i) => sum + Number(i.amount || 0), 0);

      const totalUsdtBalance = calculateNetBalance(totalCredit, totalDebit);

      // Aggregate Sell (General + Podiyana + Pudiyana)
      const generalSellTotal = sellList.reduce(
        (sum, i) => sum + Number(i.total || i.amount * i.rate || 0),
        0,
      );
      const podiyanaSellTotal = podiyanaSell.reduce(
        (sum, i) => sum + Number(i.total || i.amount * i.rate || 0),
        0,
      );
      const pudiyanaSellTotal = pudiyanaSell.reduce(
        (sum, i) => sum + Number(i.total || i.amount * i.rate || 0),
        0,
      );
      const totalSellAmount =
        generalSellTotal + podiyanaSellTotal + pudiyanaSellTotal;

      // Aggregate Buy (General + Podiyana + Pudiyana)
      const generalBuyTotal = buyList.reduce(
        (sum, i) => sum + Number(i.total || i.amount * i.rate || 0),
        0,
      );
      const podiyanaBuyTotal = podiyanaBuy.reduce(
        (sum, i) => sum + Number(i.total || i.amount * i.rate || 0),
        0,
      );
      const pudiyanaBuyTotal = pudiyanaBuy.reduce(
        (sum, i) => sum + Number(i.total || i.amount * i.rate || 0),
        0,
      );
      const totalBuyAmount =
        generalBuyTotal + podiyanaBuyTotal + pudiyanaBuyTotal;

      // Aggregate expense amounts without converting currency values.
      const totalExpense = expenseList
        .filter((i) => i.currency === "USDT")
        .reduce((sum, i) => sum + Number(i.amount || 0), 0);

      const totalProfit = calculateProfit(
        totalSellAmount,
        totalBuyAmount,
        totalExpense,
      );

      return {
        totalProfit,
        totalSellAmount,
        totalUsdtBalance,
        totalCredit,
        totalExpense,
        totalBuyAmount,
      };
    }
  },

  getChartData: async (range = "Last 30 Days") => {
    try {
      const res = await axiosInstance.get(
        `/dashboard/chart?range=${encodeURIComponent(range)}`,
      );
      return res.data;
    } catch (err) {
      return [];
    }
  },

  getRecentTransactions: async () => {
    try {
      const res = await axiosInstance.get("/dashboard/recent-transactions");
      return res.data;
    } catch (err) {
      return [];
    }
  },
};
