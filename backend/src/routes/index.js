import { Router } from "express";
import authRoutes from "./auth/authRoutes.js";
import expenseRoutes from "./nonAuth/expense/expenseRoutes.js";
import dashboardRoutes from "./nonAuth/dashboard/dashboardRoutes.js";
import buyRoutes from "./nonAuth/buy/buyRoutes.js";
import customerRoutes from "./nonAuth/customer/customerRoutes.js";
import sellRoutes from "./nonAuth/sell/sellRoutes.js";
import usdtRoutes from "./nonAuth/usdt/usdtRoutes.js";
import idrRoutes from "./nonAuth/idr/idrRoutes.js";
import partnerRoutes from "./nonAuth/partner/partnerRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/expense", expenseRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/buy", buyRoutes);
router.use("/customer", customerRoutes);
router.use("/sell", sellRoutes);
router.use("/usdt", usdtRoutes);
router.use("/idr", idrRoutes);
router.use("/partners", partnerRoutes);

export default router;
