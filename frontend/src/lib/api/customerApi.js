import axiosInstance from "../axios";

export const customerApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/customer");
    return { ...res.data, items: res.data.items || res.data };
  },

  create: async (name) => {
    const res = await axiosInstance.post("/customer", { name });
    return res.data;
  },

  update: async (id, name) => {
    const res = await axiosInstance.put(`/customer/${id}`, { name });
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/customer/${encodeURIComponent(id)}`);
    return res.data;
  },

  getHistory: async (id) => {
    const res = await axiosInstance.get(`/customer/${id}/history`);
    return res.data;
  },
};
