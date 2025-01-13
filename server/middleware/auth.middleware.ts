import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JWTUser {
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

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies["auth_token"];
  if (!token) {
    res
      .status(401)
      .json({ success: false, error: "Access Denied. No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JWTUser;
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(403).json({ success: false, error: "Forbidden, Invalid Token" });
  }
};
