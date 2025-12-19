import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TaskModel } from "../models/task.model";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).userId = decoded.id;
    (req as any).role = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeTaskOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const task = await TaskModel.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.creatorId.toString() !== (req as any).userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
