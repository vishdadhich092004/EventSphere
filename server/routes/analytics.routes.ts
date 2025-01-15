import express from "express";
import {
  getPopularEvents,
  getTopActiveUsers,
  getEventDetailedStats,
} from "../controllers/analytics.controllers";

const router = express.Router();

router.get("/events/popular", getPopularEvents);
router.get("/users/active", getTopActiveUsers);
router.get("/events/:id/stats", getEventDetailedStats);
export default router;
