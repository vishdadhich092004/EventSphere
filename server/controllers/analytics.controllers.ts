import { Request, Response } from "express";
import { EventType, UserType } from "../shared/types";
import Registration from "../models/registration";
import Event from "../models/event";

export const getPopularEvents = async (
  req: Request,
  res: Response
): Promise<EventType[] | any> => {
  try {
    const popularEvents = await Registration.aggregate([
      { $match: { status: "registered" } },
      {
        $group: {
          _id: "$event",
          registrationCount: { $sum: 1 }, // basically counts the registration per event
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: "$eventDetails" },
      {
        $project: {
          _id: 1,
          registrationCount: 1,
          eventName: "$eventDetails.name",
          eventDate: "$eventDetails.date",
          capacity: "$eventDetails.capacity",
          registrationRatePercent: {
            $multiply: [
              { $divide: ["$registrationCount", "$eventDetails.capacity"] },
              100,
            ],
          },
        },
      },
      { $sort: { registrationCount: -1 } }, // descending order
      { $limit: 5 }, // top5
    ]);

    return res.status(200).json({ success: true, data: popularEvents });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getTopActiveUsers = async (
  req: Request,
  res: Response
): Promise<UserType[] | any> => {
  try {
    const activeUsers = await Registration.aggregate([
      {
        $match: {
          status: "registered",
        },
      },
      {
        $group: {
          _id: "$user",
          totalRegistrations: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          totalRegistrations: 1,
          userName: "$userDetails.name",
          userEmail: "$userDetails.email",
        },
      },
      {
        $sort: { totalRegistrations: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.json({ success: true, data: activeUsers });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getEventDetailedStats = async (
  req: Request,
  res: Response
): Promise<EventType | any> => {
  try {
    const { id: eventId } = req.params;
    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, error: "Event ID is missing" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event Not Found" });
    }
    const totalRegistrations = await Registration.countDocuments({
      event: eventId,
    });

    const activeRegistrations = await Registration.countDocuments({
      event: eventId,
      status: "registered",
    });

    const cancelledRegistrations = await Registration.countDocuments({
      event: eventId,
      status: "cancelled",
    });

    const daysUntilEvent = Math.ceil(
      (new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const response = {
      data: {
        event: {
          id: event._id,
          name: event.name,
          description: event.description,
          date: event.date,
          capacity: event.capacity,
          location: event.location,
          organiser: event.organiser,
          daysUntilEvent: daysUntilEvent,
        },
        stats: {
          totalRegistrations,
          activeRegistrations,
          cancelledRegistrations,
          availableSpots: event.capacity - activeRegistrations,
          registrationRatePercent: (activeRegistrations / event.capacity) * 100,
          capacityStatus:
            event.capacity === activeRegistrations
              ? "FULL"
              : activeRegistrations >= event.capacity * 0.8
              ? "ALMOST_FULL"
              : activeRegistrations >= event.capacity * 0.5
              ? "HALFWAY"
              : "AVAILABLE",
        },
      },
    };
    res.status(200).json({ success: true, data: response });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
