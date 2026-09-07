import Expense from "../../../models/nonAuth/expense/expenseModel.js";

const totals = (items) => ({
  totalUsdt: items
    .filter((item) => item.currency === "USDT")
    .reduce((sum, item) => sum + item.amount, 0),
});

export const getExpenses = async (_req, res) => {
  try {
    const items = await Expense.find().sort({ date: -1, createdAt: -1 });
    return res.json({ items, ...totals(items) });
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
