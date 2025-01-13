import { Request, Response, NextFunction } from "express";
import Event from "../models/event";

export const isEventOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(403).json({ success: false, error: "Event Id is missing" });
    return;
  }
  const event = await Event.findById(id);
  if (!event) {
    res.status(404).json({ success: false, error: "Event Not Found" });
    return;
  }
  if (req.user?.userId !== event?.organiser._id.toString()) {
    res.status(403).json({
      success: false,
      error: "Access Denied",
    });
  }
  next();
};
