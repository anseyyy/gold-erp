import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  createSell,
  deleteSell,
  getSell,
  getSells,
  updateSell,
} from "../../../controllers/nonAuth/sell/sellController.js";

const router = Router();

router.use(protect);
router.get("/", getSells);
router.get("/:id", getSell);
router.post("/", createSell);
router.put("/:id", updateSell);
router.delete("/:id", deleteSell);

export default router;
