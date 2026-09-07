/**
 * Centralized financial calculations for GoldStockERP
 */

/**
 * TOTAL PROFIT = TOTAL SELL AMOUNT - TOTAL BUY AMOUNT - TOTAL EXPENSE
 */
export function calculateProfit(totalSell = 0, totalBuy = 0, totalExpense = 0) {
  const sell = Number(totalSell) || 0;
  const buy = Number(totalBuy) || 0;
  const exp = Number(totalExpense) || 0;
  return sell - buy - exp;
}

/**
 * TOTAL USDT / IDR BALANCE = TOTAL CREDIT - TOTAL DEBIT
 */
export function calculateNetBalance(totalCredit = 0, totalDebit = 0) {
  const credit = Number(totalCredit) || 0;
  const debit = Number(totalDebit) || 0;
  return credit - debit;
}

/**
 * TOTAL = AMOUNT * RATE
 */
export function calculateTotal(amount = 0, rate = 0) {
  const a = Number(amount) || 0;
  const r = Number(rate) || 0;
  return a * r;
}

/**
 * USDT to IDR conversion: IDR = USDT * RATE
 */
export function convertUsdtToIdr(usdt = 0, rate = 0) {
  const u = Number(usdt) || 0;
  const r = Number(rate) || 0;
  return u * r;
}

/**
 * IDR to USDT conversion: USDT = IDR / RATE
 */
export function convertIdrToUsdt(idr = 0, rate = 0) {
  const i = Number(idr) || 0;
  const r = Number(rate) || 0;
  if (r === 0) return 0;
  return i / r;
}

/**
 * Calculator P/L preview
 * Buy Cost = Quantity * Buy Rate
 * Sell Revenue = Quantity * Sell Rate
 * Gross P/L = Sell Revenue - Buy Cost
 */
export function calculatePLPreview(quantity = 0, buyRate = 0, sellRate = 0) {
  const qty = Number(quantity) || 0;
  const bRate = Number(buyRate) || 0;
  const sRate = Number(sellRate) || 0;

  const buyCost = qty * bRate;
  const sellRevenue = qty * sRate;
  const grossPL = sellRevenue - buyCost;

  return {
    buyCost,
    sellRevenue,
    grossPL,
  };
}
