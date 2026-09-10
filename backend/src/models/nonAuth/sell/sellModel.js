import mongoose from "mongoose";

const sellSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    customer: { type: String, required: true, trim: true },
    scrap: { type: Number, min: 0 },
    touch: { type: Number, min: 0, max: 100 },
    pure: { type: Number, required: true, min: 0 },
    scrapRate: { type: Number, min: 0 },
    pureIdrRate: { type: Number, required: true, min: 0 },
    dollarRate: { type: Number, min: 0 },
    payment: { type: String, enum: ["USDT", "IDR"], required: true },
    totalIdr: { type: Number, min: 0, default: 0 },
    totalDollar: { type: Number, min: 0, default: 0 },
    receivedAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Sell = mongoose.models.Sell || mongoose.model("Sell", sellSchema);

export default Sell;
