import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { check, ValidationChain } from "express-validator";
import {
  createEvent,
  fetchAllEvents,
  fetchEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controllers";
import { isEventOwner } from "../middleware/event.middleware";
const router = express.Router();

const eventValidation = [
  check("name", "Name is required")
    .isString()
    .withMessage("Name should be a string"),
  check("date", "Date is required").isISO8601().withMessage("Invalid Date"),
  check("location", "Location is required")
    .isString()
    .withMessage("Location should be a string"),
  check("capacity", "Capacity is required")
    .isInt()
    .withMessage("Capacity should be a integral number"),
];

router.post("/", verifyToken, eventValidation, createEvent);
router.get("/", fetchAllEvents);
router.get("/:id", fetchEvent);
router.put("/:id", verifyToken, isEventOwner, eventValidation, updateEvent);
router.delete("/:id", verifyToken, isEventOwner, deleteEvent);
export default router;
