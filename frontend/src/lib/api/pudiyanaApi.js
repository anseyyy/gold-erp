import axiosInstance from '../axios';
import { localStore } from './store';
import { calculateTotal } from '../utils/calculations';

export const pudiyanaApi = {
  getBuy: async () => {
    try {
      const res = await axiosInstance.get('/pudiyana/buy');
      return res.data;
    } catch (err) {
      const items = localStore.get('pudiyanaBuy');
      const totalBuyAmount = items.reduce(
        (sum, i) => sum + (Number(i.total) || calculateTotal(i.amount, i.rate)),
        0
      );
      return { items, totalBuyAmount };
    }
  },

  createBuy: async (data) => {
    const total = calculateTotal(data.amount, data.rate);
    const payload = { ...data, total };
    try {
      const res = await axiosInstance.post('/pudiyana/buy', payload);
      return res.data;
    } catch (err) {
      return localStore.addItem('pudiyanaBuy', payload);
    }
  },

  deleteBuy: async (id) => {
    try {
      const res = await axiosInstance.delete(`/pudiyana/buy/${id}`);
      return res.data;
    } catch (err) {
      return localStore.deleteItem('pudiyanaBuy', id);
    }
  },

  getSell: async () => {
    try {
      const res = await axiosInstance.get('/pudiyana/sell');
      return res.data;
    } catch (err) {
      const items = localStore.get('pudiyanaSell');
      const totalSellAmount = items.reduce(
        (sum, i) => sum + (Number(i.total) || calculateTotal(i.amount, i.rate)),
        0
      );
      return { items, totalSellAmount };
    }
  },

  createSell: async (data) => {
    const total = calculateTotal(data.amount, data.rate);
    const payload = { ...data, total };
    try {
      const res = await axiosInstance.post('/pudiyana/sell', payload);
      return res.data;
    } catch (err) {
      return localStore.addItem('pudiyanaSell', payload);
    }
  },

  deleteSell: async (id) => {
    try {
      const res = await axiosInstance.delete(`/pudiyana/sell/${id}`);
      return res.data;
    } catch (err) {
      return localStore.deleteItem('pudiyanaSell', id);
    }
  },
};
