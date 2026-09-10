import Expense from "../../../models/nonAuth/expense/expenseModel.js";

const calculateTotals = (items) => {
  const totalUsdt = items
    .filter((item) => item.currency === "USDT")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const totalIdr = items
    .filter((item) => item.currency === "IDR")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return {
    totalUsdt,
    totalIdr,
    totalCount: items.length,
  };
};

export const getExpenses = async (req, res) => {
  try {
    const { period, startDate, endDate, currency, search } = req.query;

    const query = {};

    // Filter by currency
    if (currency && currency !== "ALL") {
      query.currency = currency.toUpperCase();
    }

    // Filter by text search (reason or description)
    if (search && search.trim() !== "") {
      query.$or = [
        { reason: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filter by date / period
    const now = new Date();
    if (period === "today") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (period === "this_week") {
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0, 0);
      const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - dayOfWeek), 23, 59, 59, 999);
      query.date = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (period === "this_month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Fetch filtered items
    const items = await Expense.find(query).sort({ date: -1, createdAt: -1 }).lean();

    // Fetch all items for overall lifetime summary
    const allItems = await Expense.find().lean();
    const overallTotals = calculateTotals(allItems);
    const filteredTotals = calculateTotals(items);

    return res.json({
      items,
      ...overallTotals,
      filteredTotals,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getExpenseSummary = async (_req, res) => {
  try {
    const allItems = await Expense.find().lean();
    const totals = calculateTotals(allItems);

    return res.json({
      success: true,
      ...totals,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getExpense = async (req, res) => {
  try {
    const item = await Expense.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Expense not found" });
    return res.json({ item });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { date, reason, description, amount, currency } = req.body;
    const item = await Expense.create({
      date,
      reason,
      description,
      amount,
      currency,
      createdBy: req.user?._id,
    });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { date, reason, description, amount, currency } = req.body;
    const item = await Expense.findByIdAndUpdate(
      req.params.id,
      { date, reason, description, amount, currency },
      { new: true, runValidators: true },
    );
    if (!item) return res.status(404).json({ message: "Expense not found" });
    return res.json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const item = await Expense.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Expense not found" });
    return res.json({ message: "Expense deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
