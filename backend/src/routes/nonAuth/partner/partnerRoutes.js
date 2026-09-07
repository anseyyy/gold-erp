import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  createPartner,
  createPartnerLedgerEntry,
  getPartners,
} from "../../../controllers/nonAuth/partner/partnerController.js";

const router = Router();

router.use(protect);
router.get("/", getPartners);
router.post("/", createPartner);
router.post("/ledger", createPartnerLedgerEntry);

export default router;
