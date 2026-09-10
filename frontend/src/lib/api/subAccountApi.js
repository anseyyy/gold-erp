import axiosInstance from "../axios";

export const subAccountApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/sub-accounts");
    return res.data;
  },
  getById: async (id) => {
    const res = await axiosInstance.get(`/sub-accounts/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await axiosInstance.post("/sub-accounts", payload);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await axiosInstance.put(`/sub-accounts/${id}`, payload);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosInstance.delete(`/sub-accounts/${id}`);
    return res.data;
  },

  // Buy orders for sub account
  getBuys: async (subAccountId) => {
    const res = await axiosInstance.get(`/sub-accounts/${subAccountId}/buy`);
    return res.data;
  },
  createBuy: async (subAccountId, payload) => {
    const res = await axiosInstance.post(
      `/sub-accounts/${subAccountId}/buy`,
      payload
    );
    return res.data;
  },
  updateBuy: async (subAccountId, buyId, payload) => {
    const res = await axiosInstance.put(
      `/sub-accounts/${subAccountId}/buy/${buyId}`,
      payload
    );
    return res.data;
  },
  deleteBuy: async (subAccountId, buyId) => {
    const res = await axiosInstance.delete(
      `/sub-accounts/${subAccountId}/buy/${buyId}`
    );
    return res.data;
  },

  // Sell orders for sub account
  getSells: async (subAccountId) => {
    const res = await axiosInstance.get(`/sub-accounts/${subAccountId}/sell`);
    return res.data;
  },
  createSell: async (subAccountId, payload) => {
    const res = await axiosInstance.post(
      `/sub-accounts/${subAccountId}/sell`,
      payload
    );
    return res.data;
  },
  updateSell: async (subAccountId, sellId, payload) => {
    const res = await axiosInstance.put(
      `/sub-accounts/${subAccountId}/sell/${sellId}`,
      payload
    );
    return res.data;
  },
  deleteSell: async (subAccountId, sellId) => {
    const res = await axiosInstance.delete(
      `/sub-accounts/${subAccountId}/sell/${sellId}`
    );
    return res.data;
  },
};
