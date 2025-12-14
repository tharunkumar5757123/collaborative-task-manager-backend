import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

const service = new NotificationService();

export const getNotifications = async (req: Request, res: Response) => {
  const notifications = await service.getUserNotifications(
    (req as any).userId
  );
  res.json(notifications);
};

export const markNotificationRead = async (
  req: Request,
  res: Response
) => {
  const updated = await service.markAsRead(
    req.params.id,
    (req as any).userId
  );

  res.json(updated);
};

export const markAllRead = async (req: Request, res: Response) => {
  await service.markAllAsRead((req as any).userId);
  res.status(204).send();
};
