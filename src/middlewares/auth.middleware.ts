import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { TaskModel } from "../models/task.model";

/* Extend Express Request */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/* ======================
   AUTHENTICATION
====================== */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ======================
   TASK OWNER AUTHORIZATION
====================== */
export const authorizeTaskOwner = async (req: Request, res: Response, next: NextFunction) => {
  const task = await TaskModel.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.creatorId.toString() !== req.user?._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
