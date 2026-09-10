import axiosInstance from "../axios";

export const expenseApi = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get("/expense", { params });
    return { ...res.data, items: res.data.items || res.data };
  },

  getSummary: async () => {
    const res = await axiosInstance.get("/expense/summary");
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post("/expense", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/expense/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/expense/${id}`);
    return res.data;
  },
};
