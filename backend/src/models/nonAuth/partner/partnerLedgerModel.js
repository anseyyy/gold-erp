import mongoose from "mongoose";

const partnerLedgerSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    date: { type: Date, required: true },
    type: { type: String, enum: ["Credit", "Debit"], required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const PartnerLedger =
  mongoose.models.PartnerLedger ||
  mongoose.model("PartnerLedger", partnerLedgerSchema);

export default PartnerLedger;
