import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  createPartner,
  createPartnerLedgerEntry,
  deletePartner,
  deletePartnerLedgerEntry,
  getPartners,
} from "../../../controllers/nonAuth/partner/partnerController.js";

const router = Router();

router.use(protect);
router.get("/", getPartners);
router.post("/", createPartner);
router.delete("/:id", deletePartner);
router.post("/ledger", createPartnerLedgerEntry);
router.delete("/ledger/:id", deletePartnerLedgerEntry);

export default router;
