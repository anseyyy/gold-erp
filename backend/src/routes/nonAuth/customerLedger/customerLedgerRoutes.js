import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  getAllCustomerLedgers,
  getCustomerLedgerByName,
} from "../../../controllers/nonAuth/customerLedger/customerLedgerController.js";

const router = Router();

router.use(protect);
router.get("/", getAllCustomerLedgers);
router.get("/:name", getCustomerLedgerByName);

export default router;
