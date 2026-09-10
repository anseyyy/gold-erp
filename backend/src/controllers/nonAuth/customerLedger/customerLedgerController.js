import CustomerLedger from "../../../models/nonAuth/customerLedger/customerLedgerModel.js";
import Buy from "../../../models/nonAuth/buy/buyModel.js";
import Sell from "../../../models/nonAuth/sell/sellModel.js";
import Customer from "../../../models/nonAuth/customer/customerModel.js";

export const getCustomerLedgerByName = async (req, res) => {
  try {
    const rawName = req.params.name || req.query.name;
    if (!rawName || !rawName.trim()) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const customerName = decodeURIComponent(rawName).trim();
    const regex = new RegExp(`^${customerName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, "i");

    // Fetch all Buy and Sell records for this customer
    const [buys, sells] = await Promise.all([
      Buy.find({ customer: regex }).sort({ date: -1, createdAt: -1 }).lean(),
      Sell.find({ customer: regex }).sort({ date: -1, createdAt: -1 }).lean(),
    ]);

    // Calculate aggregated stats
    const totalBuyOrders = buys.length;
    const totalSellOrders = sells.length;

    const totalPureGoldBought = buys.reduce((sum, item) => sum + (Number(item.pure) || 0), 0);
    const totalPureGoldSold = sells.reduce((sum, item) => sum + (Number(item.pure) || 0), 0);

    const totalIdrBuyVolume = buys.reduce((sum, item) => sum + (Number(item.totalIdr) || 0), 0);
    const totalIdrSellVolume = sells.reduce((sum, item) => sum + (Number(item.totalIdr) || 0), 0);

    const totalUsdtBuyVolume = buys.reduce((sum, item) => sum + (Number(item.totalDollar) || 0), 0);
    const totalUsdtSellVolume = sells.reduce((sum, item) => sum + (Number(item.totalDollar) || 0), 0);

    // Latest transaction date
    const allDates = [...buys, ...sells]
      .map((item) => new Date(item.date).getTime())
      .filter((d) => !isNaN(d));
    const lastTransactionDate = allDates.length > 0 ? new Date(Math.max(...allDates)) : null;

    // Combined timeline ledger
    const combinedLedger = [
      ...buys.map((item) => ({ ...item, entryType: "BUY" })),
      ...sells.map((item) => ({ ...item, entryType: "SELL" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Upsert CustomerLedger model record
    const summaryMetrics = {
      customerName,
      totalBuyOrders,
      totalSellOrders,
      totalPureGoldBought,
      totalPureGoldSold,
      netPureGoldBalance: totalPureGoldSold - totalPureGoldBought,
      totalIdrBuyVolume,
      totalIdrSellVolume,
      totalUsdtBuyVolume,
      totalUsdtSellVolume,
      netUsdtBalance: totalUsdtSellVolume - totalUsdtBuyVolume,
      lastTransactionDate,
    };

    await CustomerLedger.findOneAndUpdate(
      { customerName: { $regex: regex } },
      { ...summaryMetrics, createdBy: req.user?._id },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      summaryMetrics,
      buys,
      sells,
      combinedLedger,
    });
  } catch (error) {
    console.error("Error in getCustomerLedgerByName:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllCustomerLedgers = async (_req, res) => {
  try {
    // Get unique customer names across Customer, Buy, and Sell models
    const [customers, buyCustomers, sellCustomers] = await Promise.all([
      Customer.find().lean(),
      Buy.distinct("customer"),
      Sell.distinct("customer"),
    ]);

    const nameSet = new Set([
      ...customers.map((c) => c.name),
      ...buyCustomers,
      ...sellCustomers,
    ]);

    const customerNames = Array.from(nameSet).filter(Boolean);

    // Fetch summaries for each customer
    const ledgers = await Promise.all(
      customerNames.map(async (name) => {
        const [buys, sells] = await Promise.all([
          Buy.find({ customer: name }).lean(),
          Sell.find({ customer: name }).lean(),
        ]);

        const totalPureGoldBought = buys.reduce((sum, i) => sum + (Number(i.pure) || 0), 0);
        const totalPureGoldSold = sells.reduce((sum, i) => sum + (Number(i.pure) || 0), 0);
        const totalUsdtBuyVolume = buys.reduce((sum, i) => sum + (Number(i.totalDollar) || 0), 0);
        const totalUsdtSellVolume = sells.reduce((sum, i) => sum + (Number(i.totalDollar) || 0), 0);

        return {
          customerName: name,
          totalBuyOrders: buys.length,
          totalSellOrders: sells.length,
          totalPureGoldBought,
          totalPureGoldSold,
          totalUsdtBuyVolume,
          totalUsdtSellVolume,
          totalOrders: buys.length + sells.length,
        };
      })
    );

    return res.status(200).json({ success: true, items: ledgers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
