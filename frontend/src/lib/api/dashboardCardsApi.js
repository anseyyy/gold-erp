import axiosInstance from "../axios";
import { localStore } from "./store";

export const dashboardCardsApi = {
  getCardsData: async () => {
    try {
      const res = await axiosInstance.get("/dashboard-cards");
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch dashboard-cards API, using local calculations fallback:", err);
      // Local calculations fallback
      const sellList = localStore.get("sell") || [];
      const buyList = localStore.get("buy") || [];
      const expenseList = localStore.get("expenses") || [];

      const now = new Date();

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

      const isUsdtPayment = (payment) => {
        if (!payment) return true; // Default to USDT if unassigned
        return String(payment).trim().toUpperCase() === "USDT";
      };

      const usdtSells = sellList.filter((item) => isUsdtPayment(item.payment));
      const usdtBuys = buyList.filter((item) => isUsdtPayment(item.payment));
      const usdtExpenses = expenseList.filter(
        (item) => !item.currency || String(item.currency).trim().toUpperCase() === "USDT"
      );

      const todaySells = usdtSells.filter((item) => isToday(item.date));
      const todayBuys = usdtBuys.filter((item) => isToday(item.date));
      const todayExpenses = usdtExpenses.filter((item) => isToday(item.date));

      const todaySalesUsdt = todaySells.reduce((sum, item) => sum + Number(item.totalDollar || item.total || 0), 0);
      const todayBuyUsdt = todayBuys.reduce((sum, item) => sum + Number(item.totalDollar || item.total || 0), 0);
      const todayExpenseUsdt = todayExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const todayProfit = todaySalesUsdt - todayBuyUsdt;

      const totalSalesUsdt = usdtSells.reduce((sum, item) => sum + Number(item.totalDollar || item.total || 0), 0);
      const totalBuyUsdt = usdtBuys.reduce((sum, item) => sum + Number(item.totalDollar || item.total || 0), 0);
      const totalExpense = usdtExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

      const totalProfit = totalSalesUsdt - totalBuyUsdt;
      const totalUsdtBalance = totalProfit - totalExpense;

      return {
        todaySalesUsdt,
        todaySalesIdr: 0,
        todayProfit,
        todayBuyUsdt,
        todayExpenseUsdt,
        totalUsdtBalance,
        totalProfit,
        totalExpense,
      };
    }
  },
};
