import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { USER_ROLES } from "@shared/constants";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Auth middleware - Session ID:", req.sessionID);
  console.log("Auth middleware - Session userId:", req.session?.userId);
  
  if (!req.session?.userId) {
    console.log("Auth middleware - No session userId found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      console.log("Auth middleware - User not found for ID:", req.session.userId);
      return res.status(401).json({ message: "User not found" });
    }
    console.log("Auth middleware - User found:", user.email, "role:", user.role);
    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware - Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const hasRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

// Role-specific middleware
export const isAdmin = hasRole([USER_ROLES.ADMIN]);
export const isInstructor = hasRole([USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR]);
export const isStudent = hasRole([USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR, USER_ROLES.STUDENT]); 