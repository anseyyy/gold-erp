import Customer from "../../../models/nonAuth/customer/customerModel.js";
import Buy from "../../../models/nonAuth/buy/buyModel.js";
import Sell from "../../../models/nonAuth/sell/sellModel.js";

export const getCustomers = async (_req, res) => {
  try {
    const items = await Customer.find().sort({ name: 1 });
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    if (!name)
      return res.status(400).json({ message: "Customer name is required" });

    const item = await Customer.create({ name, createdBy: req.user?._id });
    return res.status(201).json({ item });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Customer already exists" });
    }
    return res.status(400).json({ message: error.message });
  }
};

export const getCustomerHistory = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const [buys, sells] = await Promise.all([
      Buy.find({ customer: customer.name }).sort({ date: -1, createdAt: -1 }),
      Sell.find({ customer: customer.name }).sort({ date: -1, createdAt: -1 }),
    ]);
    return res.json({ customer, buys, sells });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
