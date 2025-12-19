import { Response } from "express";
import Notification from "../models/notification.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/* GET USER NOTIFICATIONS */
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* MARK SINGLE AS READ */
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );

    res.json(notification);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* MARK ALL AS READ */
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    await Notification.updateMany({ user: userId, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
