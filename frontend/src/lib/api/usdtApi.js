import axiosInstance from "../axios";

export const usdtApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/usdt");
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post("/usdt", data);
    return res.data;
  },

  createManual: async (data) => {
    const res = await axiosInstance.post("/usdt/manual", data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/usdt/${id}`);
    return res.data;
  },
};
