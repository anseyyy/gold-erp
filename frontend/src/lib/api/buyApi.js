import axiosInstance from "../axios";

export const buyApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/buy");
    return { ...res.data, items: res.data.items || res.data };
  },

  create: async (data) => {
    const res = await axiosInstance.post("/buy", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/buy/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/buy/${id}`);
    return res.data;
  },
};
