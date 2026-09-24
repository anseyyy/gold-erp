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

  deletePartner: async (id) => {
    const res = await axiosInstance.delete(`/partners/${id}`);
    return res.data;
  },

  addLedgerEntry: async (data) => {
    const res = await axiosInstance.post("/partners/ledger", data);
    return res.data;
  },

  deleteLedgerEntry: async (id) => {
    const res = await axiosInstance.delete(`/partners/ledger/${id}`);
    return res.data;
  },
};
