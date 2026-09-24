import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomerHistory,
  getCustomers,
  updateCustomer,
} from "../../../controllers/nonAuth/customer/customerController.js";

const router = Router();

router.use(protect);
router.get("/", getCustomers);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.get("/:id/history", getCustomerHistory);

export default router;
