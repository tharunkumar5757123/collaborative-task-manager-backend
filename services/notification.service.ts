import Notification from "../models/notification.model";

export class NotificationService {
  async getUserNotifications(userId: string) {
    return Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string, userId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
  }
}
