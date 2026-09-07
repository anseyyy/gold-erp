import axiosInstance from "../axios";

export const authApi = {
  login: async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (data) => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  },
};
