import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import { getIdrAccount } from "../../../controllers/nonAuth/idr/idrController.js";

const router = Router();

router.use(protect);
router.get("/", getIdrAccount);

export default router;
