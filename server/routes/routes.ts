import express from "express";
import userRoutes from "./user.routes";
import eventRoutes from "./event.routes";
import registrationRoutes from "../routes/registration.routes";
import adminRoutes from "./admin.routes";
import analyticsRoutes from "../routes/analytics.routes";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/events/:id", registrationRoutes);
router.use("/admin", adminRoutes);
router.use("/analytics", analyticsRoutes);
export default router;
