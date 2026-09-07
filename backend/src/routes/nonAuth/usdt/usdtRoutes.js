import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import { getUsdtAccount } from "../../../controllers/nonAuth/usdt/usdtController.js";

const router = Router();

router.use(protect);
router.get("/", getUsdtAccount);

export default router;
