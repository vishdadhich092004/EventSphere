import { Request, Response, NextFunction } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || req.user.role !== "admin") {
    res
      .status(403)
      .json({ success: false, error: "Access denied. Admins only." });
    return;
  }
  next();
};

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  if (!req.user) {
    res.status(403).json({
      success: false,
      error: "Access denied. User not authenticated.",
    });
    return;
  }
  if (req.user.userId === id) {
    return next();
  }
  res.status(403).json({ success: false, error: "Access Denied." });
};

export const isOwnerOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (!req.user) {
    res.status(403).json({
      success: false,
      error: "Access denied. User not authenticated.",
    });
    return;
  }

  if (req.user.role === "admin" || req.user.userId === id) {
    return next();
  }

  res.status(403).json({
    success: false,
    error: "Access denied. Admins or the user themselves only.",
  });
};
