import { Request, Response } from "express";
import User from "../models/user";
import { EventType, UserType } from "../shared/types";
import Event from "../models/event";
import Registration from "../models/registration";

export const fetchAllUsers = async (
  req: Request,
  res: Response
): Promise<UserType[] | any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .skip(skip)
      .select("-password")
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!users) {
      return res.status(404).json({ success: false, error: "No Users Found" });
    }
    const totalUserCount = await User.countDocuments();

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUserCount / limit),
        totalUsers: totalUserCount,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<EventType | any> => {
  try {
    const events = await Event.find();

    if (!events) {
      return res.status(404).json({ success: false, error: "No Events Found" });
    }

    const eventWithStats = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({
          event: event._id,
          status: "registered",
        });

        return {
          ...event.toObject(),
          registrationCount: registrationCount,
          availableSpots: event.capacity - registrationCount,
        };
      })
    );
    return res.status(200).json({ success: true, data: eventWithStats });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<UserType | any> => {
  // soft delete, we start a transaction
  const session = await User.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    // soft delete user
    let user = await User.findById(id);
    user = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        email: `deleted_${Date.now()}_${user?.email}`,
      },
      { session }
    );
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, error: "User Not Found" });
    }
    // soft deleting users' registration
    await Registration.updateMany(
      { user: id },
      {
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: "User Account Deleted",
      },
      {
        session,
      }
    );
    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "User and associated registrations deleted.",
    });
  } catch (e) {
    await session.abortTransaction();
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  } finally {
    session.endSession();
  }
};
