// src/middleware/auth.middleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TaskModel } from "../models/task.model";

// -----------------------------
// Authentication Middleware
// -----------------------------
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).userId = decoded.id; // Attach userId to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// -----------------------------
// Authorization Middleware: Task Owner
// -----------------------------
export const authorizeTaskOwner = async (req: Request, res: Response, next: NextFunction) => {
  const taskId = req.params.id;
  const task = await TaskModel.findById(taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.creatorId.toString() !== (req as any).userId) {
    return res.status(403).json({ message: "Forbidden: You are not the task owner" });
  }

  next();
};

// -----------------------------
// Role-Based Authorization (Optional)
// -----------------------------
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).role; // Assume you store role in JWT
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
