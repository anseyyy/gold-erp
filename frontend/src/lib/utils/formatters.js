/**
 * Formatting utilities for Creston
 */

export function formatNumber(val, decimals = 2) {
  const num = Number(val) || 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatUSDT(val) {
  return `${formatNumber(val, 2)} USDT`;
}

export function formatIDR(val) {
  const num = Number(val) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatCurrency(val, currency = "USDT") {
  if (currency === "IDR") {
    return formatIDR(val);
  }
  return formatUSDT(val);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}
