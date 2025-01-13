import { Request, Response } from "express";
import { EventType } from "../shared/types";
import { validationResult } from "express-validator";
import Event from "../models/event";

export const createEvent = async (
  req: Request,
  res: Response
): Promise<EventType | any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const { name, description, date, location, capacity } = req.body;
    const newEvent = new Event({
      name,
      description,
      location,
      capacity,
      date,
      organiser: req.user?.userId,
    });
    await newEvent.save();
    await newEvent.populate("organiser", "-password");
    return res.status(201).json({ success: true, data: newEvent });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const fetchAllEvents = async (
  req: Request,
  res: Response
): Promise<EventType[] | any> => {
  try {
    // pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skipIndex = (page - 1) * limit;
    const events = await Event.find()
      .populate("organiser", "-password")
      .sort({ date: "asc" })
      .limit(limit)
      .skip(skipIndex);
    const totalEventCount = await Event.countDocuments();
    return res.status(200).json({
      success: true,
      data: events,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalEventCount / limit),
        totalEvents: totalEventCount,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const fetchEvent = async (
  req: Request,
  res: Response
): Promise<EventType | any> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(403)
        .json({ success: false, error: "Event Id Missing" });
    }
    const event = await Event.findById(id).populate("organiser", "-password");

    if (!event) {
      return res.status(404).json({ success: false, error: "No Event Found" });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<EventType | any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event Not Found" });
    }
    const { name, description, location, date, capacity } = req.body;
    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.capacity = capacity || event.capacity;

    await event.save();
    await event.populate("organiser", "-password");
    return res.status(201).json({ succes: true, data: event });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<EventType | any> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event Not Found" });
    }
    await event.deleteOne();
    return res.status(200).json({ success: true, message: "Event Deleted" });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
