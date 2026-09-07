import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  createCustomer,
  getCustomerHistory,
  getCustomers,
} from "../../../controllers/nonAuth/customer/customerController.js";

const router = Router();

router.use(protect);
router.get("/", getCustomers);
router.post("/", createCustomer);
router.get("/:id/history", getCustomerHistory);

export default router;
