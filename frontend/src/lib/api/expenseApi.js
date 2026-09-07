import axiosInstance from "../axios";

export const expenseApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/expense");
    return { ...res.data, items: res.data.items || res.data };
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
