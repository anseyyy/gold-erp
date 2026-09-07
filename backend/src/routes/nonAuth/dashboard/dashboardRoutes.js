import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import { getDashboardSummary } from "../../../controllers/nonAuth/dashboard/dashboardController.js";

const router = Router();

router.get("/summary", protect, getDashboardSummary);

export default router;
