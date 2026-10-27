import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import { UserRole } from "../../enums/user.enum";

import { INotificationController } from "../../controllers/interfaces/common/INotificationController";

const router = Router();

const controller = container.get<INotificationController>(
  TYPES.INotificationController,
);

router.use(authMiddleware);

router.use(authorize(UserRole.USER, UserRole.NUTRITIONIST, UserRole.ADMIN));

router.get("/", controller.getNotifications);

router.get("/unread-count", controller.getUnreadCount);

router.patch("/:notificationId/read", controller.markNotificationRead);

router.patch("/read-all", controller.markAllNotificationsRead);

export default router;
