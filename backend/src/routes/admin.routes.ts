import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { IAdminAuthController } from "../controllers/interfaces/admin/IAdminAuthController";
import { IAdminUsersController } from "../controllers/interfaces/admin/IAdminUsersController";
import {IAdminNotificationController} from "../controllers/interfaces/admin/IAdminNotificationController"

const router = Router();
const adminAuthController = container.get<IAdminAuthController>(TYPES.IAdminAuthController);
const adminUsersController = container.get<IAdminUsersController>(TYPES.IAdminUsersController)
const adminNotificationController = container.get<IAdminNotificationController>(TYPES.IAdminNotificationController)

router.post("/login",adminAuthController.login);
router.get("/users",adminUsersController.getAllClients)
router.get("/nutritionists",adminUsersController.getAllNutritionist)
router.patch("/block-user/:userId",adminUsersController.blockUser);
router.patch("/unblock-user/:userId",adminUsersController.unblockUser)
router.get("/notifications", adminNotificationController.getAllNotifications);
router.patch("/notifications/read/:id",adminNotificationController.markAsRead);
router.delete("notifications/:id",adminNotificationController.deleteNotification);
router.patch("/nutritionist/approve/:userId",adminNotificationController.approveNutritionist);
router.patch("/nutritionist/reject/:userId",adminNotificationController.rejectNutritionist);
router.get("/nutritionist/:userId", adminUsersController.getNutritionistDetails);

export default router;



