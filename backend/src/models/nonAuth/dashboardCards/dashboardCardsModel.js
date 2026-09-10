import mongoose from "mongoose";

const dashboardCardsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    todaySalesUsdt: { type: Number, default: 0 },
    todaySalesIdr: { type: Number, default: 0 },
    todayProfit: { type: Number, default: 0 },
    todayBuyAmount: { type: Number, default: 0 },
    todayExpenseAmount: { type: Number, default: 0 },
    totalUsdtBalance: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },
    lastCalculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DashboardCards =
  mongoose.models.DashboardCards ||
  mongoose.model("DashboardCards", dashboardCardsSchema);

export default DashboardCards;
