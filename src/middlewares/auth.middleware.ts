import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TaskModel } from "../models/task.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
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
