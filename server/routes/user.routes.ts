import express from "express";
import {
  registerUser,
  fetchUser,
  loginUser,
  updateUser,
} from "../controllers/user.controllers";
import { check } from "express-validator";
import { verifyToken } from "../middleware/auth.middleware";
import { isOwner, isOwnerOrAdmin } from "../middleware/owner-admin.middleware";
const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").isString(),
    check("email", "Email is required")
      .isEmail()
      .withMessage("Email is Invalid"),
    check("password", "Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);
router.post(
  "/login",
  [
    check("email", "Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    check("password", "Password is required")
      .isLength({ min: 6 })
      .withMessage("Password is invalid"),
  ],
  loginUser
);
router.get("/:id", verifyToken, isOwnerOrAdmin, fetchUser);
router.put("/:id", verifyToken, isOwner, updateUser);

export default router;
