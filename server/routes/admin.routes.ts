import express from "express";
import { isAdmin } from "../middleware/owner-admin.middleware";
import {
  deleteUser,
  fetchAllUsers,
  getAllEvents,
} from "../controllers/admin.controllers";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/users", verifyToken, isAdmin, fetchAllUsers);
router.get("/events", verifyToken, isAdmin, getAllEvents);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);
export default router;
