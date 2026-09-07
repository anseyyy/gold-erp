import { Router } from "express";
import {
  deleteUser,
  getMe,
  getUser,
  listUsers,
  login,
  register,
  updateUser,
} from "../../controllers/auth/userController.js";
import { protect } from "../../controllers/auth/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);


router.get("/me", protect, getMe);
router.get("/users", protect, listUsers);
router.get("/users/:id", protect, getUser);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

export default router;
