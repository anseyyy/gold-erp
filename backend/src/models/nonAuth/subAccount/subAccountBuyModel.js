import mongoose from "mongoose";

const subAccountBuySchema = new mongoose.Schema(
  {
    subAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    customer: {
      type: String,
      default: "",
    },
    scrap: {
      type: Number,
      default: 0,
    },
    touch: {
      type: Number,
      default: 0,
    },
    pure: {
      type: Number,
      default: 0,
    },
    scrapRate: {
      type: Number,
      default: 0,
    },
    pureIdrRate: {
      type: Number,
      default: 0,
    },
    dollarRate: {
      type: Number,
      default: 0,
    },
    payment: {
      type: String,
      default: "USDT",
    },
    totalIdr: {
      type: Number,
      default: 0,
    },
    totalDollar: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SubAccountBuy ||
  mongoose.model("SubAccountBuy", subAccountBuySchema);
