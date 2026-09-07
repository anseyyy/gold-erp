import axiosInstance from "../axios";
import { localStore } from "./store";
import { calculateNetBalance } from "../utils/calculations";

export const usdtApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/usdt");
      return res.data;
    } catch (err) {
      const items = localStore.get("usdt");
      const totalCredit = items
        .filter((i) => i.type === "Credit")
        .reduce((sum, i) => sum + Number(i.amount || 0), 0);
      const totalDebit = items
        .filter((i) => i.type === "Debit")
        .reduce((sum, i) => sum + Math.abs(Number(i.amount || 0)), 0);
      const netBalance = calculateNetBalance(totalCredit, totalDebit);

      return {
        items,
        totalCredit,
        totalDebit,
        balance: netBalance,
        netBalance,
      };
    }
  },

  create: async (data) => {
    try {
      const res = await axiosInstance.post("/usdt", data);
      return res.data;
    } catch (err) {
      return localStore.addItem("usdt", data);
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`/usdt/${id}`);
      return res.data;
    } catch (err) {
      return localStore.deleteItem("usdt", id);
    }
  },
};
