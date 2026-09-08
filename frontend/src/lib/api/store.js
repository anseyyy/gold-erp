/**
 * Local Data Store for Creston
 * Manages client state and provides realistic fallback data when backend endpoints are not active.
 */

const INITIAL_DATA = {
  usdt: [],
  expenses: [],
  buy: [],
  sell: [],
  podiyanaBuy: [],
  podiyanaSell: [],
  pudiyanaBuy: [],
  pudiyanaSell: [],
  idr: [],
  partners: [],
  partnerLedger: [],
};

function getStorage(key) {
  if (typeof window === "undefined") return INITIAL_DATA[key] || [];
  try {
    const raw = localStorage.getItem(`gold_erp_${key}`);
    if (!raw) {
      localStorage.setItem(
        `gold_erp_${key}`,
        JSON.stringify(INITIAL_DATA[key] || []),
      );
      return INITIAL_DATA[key] || [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return INITIAL_DATA[key] || [];
  }
}

function setStorage(key, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`gold_erp_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const localStore = {
  get: getStorage,
  set: setStorage,
  addItem: (key, item) => {
    const list = getStorage(key);
    const newItem = { id: `${key.slice(0, 3)}-${Date.now()}`, ...item };
    const updated = [newItem, ...list];
    setStorage(key, updated);
    return newItem;
  },
  deleteItem: (key, id) => {
    const list = getStorage(key);
    const updated = list.filter((item) => String(item.id) !== String(id));
    setStorage(key, updated);
    return updated;
  },
};
