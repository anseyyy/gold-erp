import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["USDT", "IDR"], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
