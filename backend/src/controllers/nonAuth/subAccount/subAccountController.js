import SubAccount from "../../../models/nonAuth/subAccount/subAccountModel.js";
import SubAccountBuy from "../../../models/nonAuth/subAccount/subAccountBuyModel.js";
import SubAccountSell from "../../../models/nonAuth/subAccount/subAccountSellModel.js";

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

  const totalOrderCost = data.payment === "USDT" ? totalDollar : totalIdr;
  const paidAmount =
    data.paidAmount !== undefined && data.paidAmount !== null && data.paidAmount !== ""
      ? Number(data.paidAmount)
      : totalOrderCost;
  const balance = totalOrderCost - paidAmount;

  return {
    ...data,
    scrap,
    touch,
    pure,
    pureIdrRate,
    totalIdr,
    totalDollar,
    paidAmount,
    balance,
  };
};

const calculateSellValues = (data) => {
  const scrap = Number(data.scrap || 0);
  const touch = Number(data.touch || 0);
  const pure = data.pure
    ? Number(data.pure)
    : (scrap * touch) / 100;
  const pureIdrRate = data.pureIdrRate
    ? Number(data.pureIdrRate)
    : Number(data.scrapRate || 0);
  const totalIdr = pure * pureIdrRate;
  const dollarRate = Number(data.dollarRate || 0);
  const totalDollar = dollarRate > 0 ? totalIdr / dollarRate : 0;

  const totalOrderValue = data.payment === "USDT" ? totalDollar : totalIdr;
  const receivedAmount =
    data.receivedAmount !== undefined && data.receivedAmount !== null && data.receivedAmount !== ""
      ? Number(data.receivedAmount)
      : totalOrderValue;
  const balance = totalOrderValue - receivedAmount;

  return {
    ...data,
    scrap,
    touch,
    pure,
    pureIdrRate,
    totalIdr,
    totalDollar,
    receivedAmount,
    balance,
  };
};

// Sub Accounts Directory Endpoints
export const getSubAccounts = async (_req, res) => {
  try {
    const subAccounts = await SubAccount.find().sort({ createdAt: -1 });

    const items = await Promise.all(
      subAccounts.map(async (acc) => {
        const obj = acc.toObject();
        const buys = await SubAccountBuy.find({ subAccount: acc._id });
        const sells = await SubAccountSell.find({ subAccount: acc._id });

        const totalBuyAmount = buys.reduce(
          (sum, item) => sum + Number(item.totalIdr || 0),
          0
        );
        const totalSellAmount = sells.reduce(
          (sum, item) => sum + Number(item.totalIdr || 0),
          0
        );
        const netBalance = totalSellAmount - totalBuyAmount;

        return {
          ...obj,
          totalBuyAmount,
          totalSellAmount,
          netBalance,
          totalBuyOrders: buys.length,
          totalSellOrders: sells.length,
        };
      })
    );

    const overallBuyTotal = items.reduce(
      (sum, acc) => sum + acc.totalBuyAmount,
      0
    );
    const overallSellTotal = items.reduce(
      (sum, acc) => sum + acc.totalSellAmount,
      0
    );

    return res.json({
      items,
      totalSubAccounts: items.length,
      overallBuyTotal,
      overallSellTotal,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSubAccountById = async (req, res) => {
  try {
    const subAccount = await SubAccount.findById(req.params.id);
    if (!subAccount) {
      return res.status(404).json({ message: "Sub account not found" });
    }

    const rawBuys = await SubAccountBuy.find({
      subAccount: req.params.id,
    }).sort({ date: -1, createdAt: -1 });
    const rawSells = await SubAccountSell.find({
      subAccount: req.params.id,
    }).sort({ date: -1, createdAt: -1 });

    const buyItems = rawBuys.map((b) => calculateBuyValues(b.toObject()));
    const sellItems = rawSells.map((s) => calculateSellValues(s.toObject()));

    const totalBuyAmount = buyItems.reduce(
      (sum, item) => sum + Number(item.totalIdr || 0),
      0
    );
    const totalSellAmount = sellItems.reduce(
      (sum, item) => sum + Number(item.totalIdr || 0),
      0
    );
    const netBalance = totalSellAmount - totalBuyAmount;

    return res.json({
      item: subAccount,
      buyItems,
      sellItems,
      totalBuyAmount,
      totalSellAmount,
      netBalance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSubAccount = async (req, res) => {
  try {
    const { name, customer, description } = req.body;
    if (!name || !customer) {
      return res
        .status(400)
        .json({ message: "Sub account name and client/customer are required." });
    }
    const item = await SubAccount.create({
      name: name.trim(),
      customer: customer.trim(),
      description: description ? description.trim() : "",
      createdBy: req.user?._id,
    });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateSubAccount = async (req, res) => {
  try {
    const item = await SubAccount.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name?.trim(),
        customer: req.body.customer?.trim(),
        description: req.body.description?.trim(),
      },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Sub account not found" });
    return res.json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteSubAccount = async (req, res) => {
  try {
    const item = await SubAccount.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Sub account not found" });

    // Cascade delete buy and sell orders for this sub account
    await SubAccountBuy.deleteMany({ subAccount: req.params.id });
    await SubAccountSell.deleteMany({ subAccount: req.params.id });

    return res.json({ message: "Sub account and associated transactions deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Sub Account Buy Order Endpoints
export const getSubAccountBuys = async (req, res) => {
  try {
    const records = await SubAccountBuy.find({
      subAccount: req.params.id,
    }).sort({ date: -1, createdAt: -1 });
    const items = records.map((item) => calculateBuyValues(item.toObject()));
    const totalBuyAmount = items.reduce(
      (sum, item) => sum + Number(item.totalIdr || 0),
      0
    );
    return res.json({ items, totalBuyAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSubAccountBuy = async (req, res) => {
  try {
    const values = calculateBuyValues(req.body);
    const item = await SubAccountBuy.create({
      ...values,
      subAccount: req.params.id,
      createdBy: req.user?._id,
    });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateSubAccountBuy = async (req, res) => {
  try {
    const item = await SubAccountBuy.findByIdAndUpdate(
      req.params.buyId,
      calculateBuyValues(req.body),
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Buy order not found" });
    return res.json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteSubAccountBuy = async (req, res) => {
  try {
    const item = await SubAccountBuy.findByIdAndDelete(req.params.buyId);
    if (!item) return res.status(404).json({ message: "Buy order not found" });
    return res.json({ message: "Buy order deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Sub Account Sell Order Endpoints
export const getSubAccountSells = async (req, res) => {
  try {
    const records = await SubAccountSell.find({
      subAccount: req.params.id,
    }).sort({ date: -1, createdAt: -1 });
    const items = records.map((item) => calculateSellValues(item.toObject()));
    const totalSellAmount = items.reduce(
      (sum, item) => sum + Number(item.totalIdr || 0),
      0
    );
    return res.json({ items, totalSellAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSubAccountSell = async (req, res) => {
  try {
    const values = calculateSellValues(req.body);
    const item = await SubAccountSell.create({
      ...values,
      subAccount: req.params.id,
      createdBy: req.user?._id,
    });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateSubAccountSell = async (req, res) => {
  try {
    const item = await SubAccountSell.findByIdAndUpdate(
      req.params.sellId,
      calculateSellValues(req.body),
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Sell order not found" });
    return res.json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteSubAccountSell = async (req, res) => {
  try {
    const item = await SubAccountSell.findByIdAndDelete(req.params.sellId);
    if (!item) return res.status(404).json({ message: "Sell order not found" });
    return res.json({ message: "Sell order deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
