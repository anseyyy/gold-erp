import Sell from "../../../models/nonAuth/sell/sellModel.js";

const calculateSellValues = (data) => {
  const scrap = Number(data.scrap || 0);
  const touch = Number(data.touch || 0);
  const pure = scrap > 0 ? (scrap * touch) / 100 : Number(data.pure || 0);
  const pureIdrRate = Number(data.pureIdrRate || 0);
  const totalIdr = pure * pureIdrRate;
  const dollarRate = Number(data.dollarRate || 0);
  const totalDollar = dollarRate > 0 ? totalIdr / dollarRate : 0;
  const payment = data.payment || "USDT";
  const balance = payment === "USDT" ? totalDollar : totalIdr;

  return {
    ...data,
    scrap,
    touch,
    pure,
    pureIdrRate,
    totalIdr,
    totalDollar,
    balance,
  };
};

export const getSells = async (_req, res) => {
  try {
    const records = await Sell.find().sort({ date: -1, createdAt: -1 });
    const items = records.map((item) => calculateSellValues(item.toObject()));
    const totalSellAmount = items.reduce(
      (sum, item) => sum + Number(item.totalIdr || 0),
      0,
    );
    return res.json({ items, totalSellAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSell = async (req, res) => {
  try {
    const item = await Sell.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Sell order not found" });
    return res.json({ item: calculateSellValues(item.toObject()) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSell = async (req, res) => {
  try {
    const item = await Sell.create({
      ...calculateSellValues(req.body),
      createdBy: req.user?._id,
    });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateSell = async (req, res) => {
  try {
    const item = await Sell.findByIdAndUpdate(
      req.params.id,
      calculateSellValues(req.body),
      {
        new: true,
        runValidators: true,
      },
    );
    if (!item) return res.status(404).json({ message: "Sell order not found" });
    return res.json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteSell = async (req, res) => {
  try {
    const item = await Sell.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Sell order not found" });
    return res.json({ message: "Sell order deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
