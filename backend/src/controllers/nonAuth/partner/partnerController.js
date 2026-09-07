import Partner from "../../../models/nonAuth/partner/partnerModel.js";
import PartnerLedger from "../../../models/nonAuth/partner/partnerLedgerModel.js";
import Buy from "../../../models/nonAuth/buy/buyModel.js";
import Sell from "../../../models/nonAuth/sell/sellModel.js";
import Expense from "../../../models/nonAuth/expense/expenseModel.js";

const sum = (items, field) =>
  items.reduce((total, item) => total + Math.abs(Number(item[field] || 0)), 0);

const getBusinessProfit = async () => {
  const [buys, sells, expenses] = await Promise.all([
    Buy.find({ payment: "USDT" }).select("totalDollar"),
    Sell.find({ payment: "USDT" }).select("totalDollar"),
    Expense.find({ currency: "USDT" }).select("amount"),
  ]);

  return (
    sum(sells, "totalDollar") -
    sum(buys, "totalDollar") -
    sum(expenses, "amount")
  );
};

export const getPartners = async (_req, res) => {
  try {
    const [partners, ledger, totalBusinessProfit] = await Promise.all([
      Partner.find().sort({ name: 1 }).lean(),
      PartnerLedger.find().sort({ date: -1, createdAt: -1 }).lean(),
      getBusinessProfit(),
    ]);

    const partnerCount = partners.length;
    const equalShare = partnerCount ? totalBusinessProfit / partnerCount : 0;
    const mappedPartners = partners.map((partner) => {
      const entries = ledger
        .filter((entry) => String(entry.partner) === String(partner._id))
        .map((entry) => ({
          id: entry._id,
          date: entry.date,
          type: entry.type,
          amount: entry.amount,
          description: entry.description,
        }));
      const credit = sum(
        entries.filter((entry) => entry.type === "Credit"),
        "amount",
      );
      const debit = sum(
        entries.filter((entry) => entry.type === "Debit"),
        "amount",
      );

      return {
        id: partner._id,
        name: partner.name,
        entries,
        profitShare: equalShare,
        credit,
        debit,
        netPayout: equalShare + credit - debit,
      };
    });

    return res.json({
      partners: mappedPartners,
      totalBusinessProfit,
      partnerCount,
      equalShare,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPartner = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    if (!name)
      return res.status(400).json({ message: "Partner name is required" });

    const partner = await Partner.create({ name, createdBy: req.user?._id });
    return res.status(201).json({ item: partner });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Partner already exists" });
    }
    return res.status(400).json({ message: error.message });
  }
};

export const createPartnerLedgerEntry = async (req, res) => {
  try {
    const { partnerId, date, type, amount, description } = req.body;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    const entry = await PartnerLedger.create({
      partner: partnerId,
      date,
      type,
      amount,
      description: String(description || `${type} transaction`).trim(),
      createdBy: req.user?._id,
    });
    return res.status(201).json({ item: entry });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
