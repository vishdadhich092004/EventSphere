import { Request, Response } from "express";
import Registration from "../models/registration";
import { RegistrationType, UserType } from "../shared/types";
import Event from "../models/event";
import User from "../models/user";
import { sendEventEmail } from "../services/email.service";

export const registerForEvent = async (
  req: Request,
  res: Response
): Promise<RegistrationType | any> => {
  try {
    const { id: eventId } = req.params;
    if (!eventId) {
      return res
        .status(404)
        .json({ success: false, error: "Event Id is missing" });
    }
    const userId = req.user?.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event Not Found" });
    }

    // event date comparision
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        error: "Cannot register for past events",
      });
    }
    // check for the capacity
    const registeredCount = await Registration.countDocuments({
      event: eventId,
      status: "registered",
    });
    if (registeredCount >= event.capacity) {
      return res
        .status(400)
        .json({ success: false, error: "Event is at full capacity" });
    }

    // check if alredy registered
    let registration = await Registration.findOne({
      event: eventId,
      user: userId,
    });
    if (registration) {
      if (registration.status === "registered") {
        return res
          .status(400)
          .json({ success: false, error: "Already registered for this event" });
      } else if (registration.status === "cancelled") {
        registration.status = "registered";
        registration.registeredAt = new Date();
        await registration.save();
      }
    } else {
      registration = new Registration({
        event: eventId,
        user: userId,
      });
      await registration.save();
    }
    // mail notification
    const user = await User.findById(userId);
    if (user && event) {
      await sendEventEmail(user, event, "registration");
    }
    res.status(201).json({ success: true, data: registration });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const cancelRegistration = async (
  req: Request,
  res: Response
): Promise<RegistrationType | any> => {
  try {
    const { id: eventId } = req.params;
    if (!eventId) {
      return res
        .status(404)
        .json({ success: false, error: "Event Id missing" });
    }
    const userId = req.user?.userId;
    const registration = await Registration.findOne({
      event: eventId,
      user: userId,
    });
    if (!registration) {
      return res
        .status(404)
        .json({ success: false, error: "Registration Not Found" });
    }
    if (registration.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, error: "Registration Already Cancelled" });
    }
    registration.status = "cancelled";
    await registration.save();

    // send the mail
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (user && event) {
      await sendEventEmail(user, event, "cancellation");
    }
    return res
      .status(200)
      .json({ success: true, message: "Registration Cancelled" });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getEventAttendees = async (
  req: Request,
  res: Response
): Promise<UserType[] | any> => {
  try {
    const { id: eventId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const attendees = await Registration.find({
      event: eventId,
      status: "registered",
    })
      .populate("user", "-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ registeredAt: "asc" });

    const totalAttendees = await Registration.countDocuments({
      event: eventId,
      status: "registered",
    });

    return res.status(200).json({
      success: true,
      data: attendees,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalAttendees / limit),
        totalAttendees: totalAttendees,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
