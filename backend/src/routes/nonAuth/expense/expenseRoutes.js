import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from "../../../controllers/nonAuth/expense/expenseController.js";

const router = Router();

router.use(protect);
router.get("/", getExpenses);
router.get("/:id", getExpense);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
