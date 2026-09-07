import axiosInstance from "../axios";

export const sellApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/sell");
    return { ...res.data, items: res.data.items || res.data };
  },

  create: async (data) => {
    const res = await axiosInstance.post("/sell", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/sell/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/sell/${id}`);
    return res.data;
  },
};
