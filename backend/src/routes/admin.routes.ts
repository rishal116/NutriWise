import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { IAdminAuthController } from "../controllers/interfaces/admin/IAdminAuthController";
import { IAdminClientController } from "../controllers/interfaces/admin/IAdminClientController";
import {IAdminNotificationController} from "../controllers/interfaces/admin/IAdminNotificationController"
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { IAdminNutritionistController } from "../controllers/interfaces/admin/IAdminNutritionistController";

const router = Router();
const adminAuthController = container.get<IAdminAuthController>(TYPES.IAdminAuthController);
const adminClientController = container.get<IAdminClientController>(TYPES.IAdminClientController)
const adminNutritionistController = container.get<IAdminNutritionistController>(TYPES.IAdminNutritionistController)
const adminNotificationController = container.get<IAdminNotificationController>(TYPES.IAdminNotificationController)


router.post("/login",adminAuthController.login);
router.post("/logout",adminAuthController.logout)

router.get("/users",adminClientController.getAllUsers)
router.patch("/block-user/:userId",adminClientController.blockUser);
router.patch("/unblock-user/:userId",adminClientController.unblockUser)

router.get("/nutritionists",adminNutritionistController.getAllNutritionist)
router.patch("/nutritionist/approve/:userId",adminNutritionistController.approveNutritionist);
router.patch("/nutritionist/reject/:userId",adminNutritionistController.rejectNutritionist);
router.get("/nutritionist/:userId",adminNutritionistController.getNutritionistProfile);



router.get("/notifications", adminNotificationController.getAllNotifications);
router.patch("/notifications/read/:id",adminNotificationController.markAsRead);

export default router;



