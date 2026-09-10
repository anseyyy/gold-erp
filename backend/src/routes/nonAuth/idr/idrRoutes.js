import { Router } from "express";
import { protect } from "../../../controllers/auth/authMiddleware.js";
import {
  getIdrAccount,
  createIdrManual,
  deleteIdrManual,
} from "../../../controllers/nonAuth/idr/idrController.js";

const router = Router();

router.use(protect);
router.get("/", getIdrAccount);
router.post("/", createIdrManual);
router.post("/manual", createIdrManual);
router.delete("/:id", deleteIdrManual);

export default router;
