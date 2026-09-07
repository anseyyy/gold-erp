import Expense from "../../../models/nonAuth/expense/expenseModel.js";

export const getDashboardSummary = async (_req, res) => {
  try {
    const expenses = await Expense.find().select("amount currency");
    const totalExpense = expenses
      .filter((expense) => expense.currency === "USDT")
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    return res.json({ totalExpense, currency: "USDT" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
