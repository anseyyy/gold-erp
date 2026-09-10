import { Router } from "express";
import {
  getSubAccounts,
  getSubAccountById,
  createSubAccount,
  updateSubAccount,
  deleteSubAccount,
  getSubAccountBuys,
  createSubAccountBuy,
  updateSubAccountBuy,
  deleteSubAccountBuy,
  getSubAccountSells,
  createSubAccountSell,
  updateSubAccountSell,
  deleteSubAccountSell,
} from "../../../controllers/nonAuth/subAccount/subAccountController.js";

const router = Router();

// Sub account directory routes
router.get("/", getSubAccounts);
router.post("/", createSubAccount);
router.get("/:id", getSubAccountById);
router.put("/:id", updateSubAccount);
router.delete("/:id", deleteSubAccount);

// Sub account Buy orders
router.get("/:id/buy", getSubAccountBuys);
router.post("/:id/buy", createSubAccountBuy);
router.put("/:id/buy/:buyId", updateSubAccountBuy);
router.delete("/:id/buy/:buyId", deleteSubAccountBuy);

// Sub account Sell orders
router.get("/:id/sell", getSubAccountSells);
router.post("/:id/sell", createSubAccountSell);
router.put("/:id/sell/:sellId", updateSubAccountSell);
router.delete("/:id/sell/:sellId", deleteSubAccountSell);

export default router;
