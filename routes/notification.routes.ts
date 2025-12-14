import { Router } from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/:id/read", authMiddleware, markNotificationRead);
router.patch("/read-all", authMiddleware, markAllRead);

export default router;
