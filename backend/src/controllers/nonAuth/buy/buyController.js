import Buy from "../../../models/nonAuth/buy/buyModel.js";

const calculateBuyValues = (data) => {
  const scrap = Number(data.scrap || 0);
  const touch = Number(data.touch || 0);
  const pure = scrap > 0 ? scrap * touch : Number(data.pure || 0);
  const pureIdrRate = data.scrapRate
    ? touch > 0
      ? Number(data.scrapRate) / touch
      : 0
    : Number(data.pureIdrRate || 0);
  const totalIdr = pure * pureIdrRate;
  const dollarRate = Number(data.dollarRate || 0);
  const totalDollar = dollarRate > 0 ? totalIdr / dollarRate : 0;

  return { ...data, scrap, touch, pure, pureIdrRate, totalIdr, totalDollar };
};

export const getBuys = async (_req, res) => {
  try {
    const records = await Buy.find().sort({ date: -1, createdAt: -1 });
    const items = records.map((item) => calculateBuyValues(item.toObject()));
    const totalBuyAmount = items.reduce(
      (sum, item) => sum + Number(item.totalIdr || 0),
      0,
    );
    return res.json({ items, totalBuyAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBuy = async (req, res) => {
  try {
    const item = await Buy.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Buy order not found" });
    return res.json({ item: calculateBuyValues(item.toObject()) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBuy = async (req, res) => {
  try {
    const values = calculateBuyValues(req.body);
    const item = await Buy.create({ ...values, createdBy: req.user?._id });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateBuy = async (req, res) => {
  try {
    const item = await Buy.findByIdAndUpdate(
      req.params.id,
      calculateBuyValues(req.body),
      {
        new: true,
        runValidators: true,
      },
    );
    if (!item) return res.status(404).json({ message: "Buy order not found" });
    return res.json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteBuy = async (req, res) => {
  try {
    const item = await Buy.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Buy order not found" });
    return res.json({ message: "Buy order deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
