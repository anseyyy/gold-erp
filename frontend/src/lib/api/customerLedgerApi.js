import axiosInstance from "../axios";
import { localStore } from "./store";

export const customerLedgerApi = {
  getByName: async (name) => {
    try {
      const res = await axiosInstance.get(`/customer-ledger/${encodeURIComponent(name)}`);
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch customer ledger API, using local calculations fallback:", err);
      const buyList = localStore.get("buy") || [];
      const sellList = localStore.get("sell") || [];

      const buys = buyList.filter((i) => i.customer?.toLowerCase() === name.toLowerCase());
      const sells = sellList.filter((i) => i.customer?.toLowerCase() === name.toLowerCase());

      const totalPureGoldBought = buys.reduce((sum, i) => sum + (Number(i.pure) || 0), 0);
      const totalPureGoldSold = sells.reduce((sum, i) => sum + (Number(i.pure) || 0), 0);

      const totalIdrBuyVolume = buys.reduce((sum, i) => sum + (Number(i.totalIdr) || 0), 0);
      const totalIdrSellVolume = sells.reduce((sum, i) => sum + (Number(i.totalIdr) || 0), 0);

      const totalUsdtBuyVolume = buys.reduce((sum, i) => sum + (Number(i.totalDollar) || 0), 0);
      const totalUsdtSellVolume = sells.reduce((sum, i) => sum + (Number(i.totalDollar) || 0), 0);

      const combinedLedger = [
        ...buys.map((i) => ({ ...i, entryType: "BUY" })),
        ...sells.map((i) => ({ ...i, entryType: "SELL" })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        summaryMetrics: {
          customerName: name,
          totalBuyOrders: buys.length,
          totalSellOrders: sells.length,
          totalPureGoldBought,
          totalPureGoldSold,
          netPureGoldBalance: totalPureGoldSold - totalPureGoldBought,
          totalIdrBuyVolume,
          totalIdrSellVolume,
          totalUsdtBuyVolume,
          totalUsdtSellVolume,
          netUsdtBalance: totalUsdtSellVolume - totalUsdtBuyVolume,
        },
        buys,
        sells,
        combinedLedger,
      };
    }
  },

  getAll: async () => {
    try {
      const res = await axiosInstance.get("/customer-ledger");
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch customer-ledger API, using localStore fallback:", err);
      const buyList = localStore.get("buy") || [];
      const sellList = localStore.get("sell") || [];
      const customerList = localStore.get("customers") || [];

      const nameSet = new Set([
        ...customerList.map((c) => (typeof c === "string" ? c : c.name)),
        ...buyList.map((b) => b.customer),
        ...sellList.map((s) => s.customer),
      ]);

      const items = Array.from(nameSet)
        .filter(Boolean)
        .map((name) => {
          const buys = buyList.filter((i) => i.customer?.toLowerCase() === name.toLowerCase());
          const sells = sellList.filter((i) => i.customer?.toLowerCase() === name.toLowerCase());
          return {
            customerName: name,
            totalBuyOrders: buys.length,
            totalSellOrders: sells.length,
            totalOrders: buys.length + sells.length,
          };
        });

      return { items };
    }
  },
};
