import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  createBuy,
  deleteBuy,
  getBuy,
  getBuys,
  updateBuy,
} from "../../../controllers/nonAuth/buy/buyController.js";

const router = Router();

router.use(protect);
router.get("/", getBuys);
router.get("/:id", getBuy);
router.post("/", createBuy);
router.put("/:id", updateBuy);
router.delete("/:id", deleteBuy);

export default router;
