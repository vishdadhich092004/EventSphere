import express from "express";
import {
  registerForEvent,
  cancelRegistration,
  getEventAttendees,
} from "../controllers/registration.controllers";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router({ mergeParams: true });

router.post("/register", verifyToken, registerForEvent);
router.delete("/register", verifyToken, cancelRegistration);
router.get("/attendees", verifyToken, getEventAttendees);
export default router;
