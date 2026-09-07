import axiosInstance from "../axios";

export const partnersApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/partners");
    return res.data;
  },

  addPartner: async (data) => {
    const res = await axiosInstance.post("/partners", data);
    return res.data;
  },

  addLedgerEntry: async (data) => {
    const res = await axiosInstance.post("/partners/ledger", data);
    return res.data;
  },
};
