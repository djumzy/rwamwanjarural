import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

export const isInstructor = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === "instructor" || req.user.role === "admin")) {
    return next();
  }
  return res.status(403).json({ message: "Instructor access required" });
};