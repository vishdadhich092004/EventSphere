import { Request, Response } from "express";
import { UserType } from "../shared/types";
import User from "../models/user";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const registerUser = async (
  req: Request,
  res: Response
): Promise<UserType | any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const { email, password, name } = req.body;
    let user = await User.findOne({
      email: email,
    });
    if (user) {
      return res
        .status(409)
        .json({ success: false, error: "User Already exists with this email" });
    }
    user = new User({ email, name, password });
    await user.save();

    // generating a token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // omitting the password
    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.status(201).json(userWithoutPassword);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
export const loginUser = async (
  req: Request,
  res: Response
): Promise<UserType | any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const { email, password } = req.body;

    let user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid Credentials" });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Credentials" });
    }
    // generating a token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // omitting the password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json(userWithoutPassword);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
export const fetchUser = async (
  req: Request,
  res: Response
): Promise<UserType | any> => {
  return "i";
};
export const updateUser = async (
  req: Request,
  res: Response
): Promise<UserType | any> => {
  return "ji";
};
