import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access Denied. No token provided" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as User;
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ success: false, error: "Invalid Token" });
  }
};
