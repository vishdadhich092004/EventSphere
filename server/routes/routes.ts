import express from "express";
import userRoutes from "./user.routes";
import eventRoutes from "./event.routes";
import registrationRoutes from "../routes/registration.routes";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/events/:id", registrationRoutes);
export default router;
