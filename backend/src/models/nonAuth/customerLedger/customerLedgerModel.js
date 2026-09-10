import mongoose from "mongoose";

const customerLedgerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, index: true },
    totalBuyOrders: { type: Number, default: 0 },
    totalSellOrders: { type: Number, default: 0 },
    totalPureGoldBought: { type: Number, default: 0 },
    totalPureGoldSold: { type: Number, default: 0 },
    totalIdrBuyVolume: { type: Number, default: 0 },
    totalIdrSellVolume: { type: Number, default: 0 },
    totalUsdtBuyVolume: { type: Number, default: 0 },
    totalUsdtSellVolume: { type: Number, default: 0 },
    lastTransactionDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const CustomerLedger =
  mongoose.models.CustomerLedger ||
  mongoose.model("CustomerLedger", customerLedgerSchema);

export default CustomerLedger;
