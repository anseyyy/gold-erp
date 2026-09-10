import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  getUsdtAccount,
  createUsdtManual,
  deleteUsdtManual,
} from "../../../controllers/nonAuth/usdt/usdtController.js";

const router = Router();

router.use(protect);
router.get("/", getUsdtAccount);
router.post("/", createUsdtManual);
router.post("/manual", createUsdtManual);
router.delete("/:id", deleteUsdtManual);

export default router;
