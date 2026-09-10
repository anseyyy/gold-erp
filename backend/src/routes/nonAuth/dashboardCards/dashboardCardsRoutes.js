import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import { getDashboardCardsData } from "../../../controllers/nonAuth/dashboardCards/dashboardCardsController.js";

const router = Router();

router.get("/", protect, getDashboardCardsData);

export default router;
