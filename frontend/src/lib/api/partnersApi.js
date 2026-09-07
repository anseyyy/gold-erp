import axiosInstance from "../axios";
import { localStore } from "./store";
import { dashboardApi } from "./dashboardApi";

export const partnersApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/partners");
      return res.data;
    } catch (err) {
      const partners = localStore.get("partners");
      const ledger = localStore.get("partnerLedger");

      // Get real total business profit from dashboard
      const summary = await dashboardApi.getSummary();
      const totalBusinessProfit =
        summary.totalProfit > 0 ? summary.totalProfit : 0;
      const partnerCount = partners.length || 1;
      const equalShare =
        partnerCount > 0 ? totalBusinessProfit / partnerCount : 0;

      // Map partners with equal profit share & net payout calculation
      const mappedPartners = partners.map((p) => {
        const pLedger = ledger.filter(
          (l) => String(l.partnerId) === String(p.id),
        );
        const credit = pLedger
          .filter((l) => l.type === "Credit")
          .reduce((s, l) => s + Number(l.amount || 0), 0);
        const debit = pLedger
          .filter((l) => l.type === "Debit")
          .reduce((s, l) => s + Number(l.amount || 0), 0);
        const netPayout = equalShare + credit - debit;

        return {
          ...p,
          profitShare: equalShare,
          credit,
          debit,
          netPayout,
        };
      });

      return {
        partners: mappedPartners,
        ledger,
        totalBusinessProfit,
        partnerCount,
        equalShare,
      };
    }
  },

  addPartner: async (data) => {
    try {
      const res = await axiosInstance.post("/partners", data);
      return res.data;
    } catch (err) {
      return localStore.addItem("partners", data);
    }
  },

  addLedgerEntry: async (data) => {
    try {
      const res = await axiosInstance.post("/partners/ledger", data);
      return res.data;
    } catch (err) {
      return localStore.addItem("partnerLedger", data);
    }
  },
};
