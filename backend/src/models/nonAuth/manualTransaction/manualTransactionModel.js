import mongoose from "mongoose";

const manualTransactionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    account: { type: String, enum: ["USDT", "IDR"], required: true },
    type: { type: String, enum: ["Credit", "Debit"], required: true },
    amount: { type: Number, required: true, min: 0 },
    customer: { type: String, default: "Manual Entry", trim: true },
    source: { type: String, default: "Manual", trim: true },
    notes: { type: String, default: "", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ManualTransaction =
  mongoose.models.ManualTransaction ||
  mongoose.model("ManualTransaction", manualTransactionSchema);

export default ManualTransaction;
