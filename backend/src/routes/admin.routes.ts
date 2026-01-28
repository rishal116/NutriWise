import { Router } from "express";
import { TYPES } from "../types/types";
import { IAdminAuthController } from "../controllers/interfaces/admin/IAdminAuthController";
import { IAdminClientController } from "../controllers/interfaces/admin/IAdminClientController";
import { IAdminNotificationController } from "../controllers/interfaces/admin/IAdminNotificationController";
import { IAdminNutritionistController } from "../controllers/interfaces/admin/IAdminNutritionistController";
import { IAdminPlanController } from "../controllers/interfaces/admin/IAdminPlanController";
import { container } from "../containers/index";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { ROLES } from "../constants/index";
import { refreshToken } from "../middlewares/refreshToken.middleware";
import { adminRefreshToken } from "../middlewares/adminRefreshToken.middleware";

const router = Router();

const adminAuthController = container.get<IAdminAuthController>(TYPES.IAdminAuthController);
const adminClientController = container.get<IAdminClientController>(TYPES.IAdminClientController);
const adminNutritionistController = container.get<IAdminNutritionistController>(TYPES.IAdminNutritionistController);
const adminNotificationController = container.get<IAdminNotificationController>(TYPES.IAdminNotificationController);
const adminPlanController = container.get<IAdminPlanController>(TYPES.IAdminPlanController);

// Public routes (no auth needed)
router.post("/login", adminAuthController.login);
router.post("/logout", authMiddleware, authorize(ROLES.ADMIN), adminAuthController.logout);

// Protected admin routes
router.get("/users", authMiddleware, authorize(ROLES.ADMIN), adminClientController.getAllUsers);
router.patch("/block-user/:userId", authMiddleware, authorize(ROLES.ADMIN), adminClientController.blockUser);
router.patch("/unblock-user/:userId", authMiddleware, authorize(ROLES.ADMIN), adminClientController.unblockUser);

router.get("/nutritionists", authMiddleware, authorize(ROLES.ADMIN), adminNutritionistController.getAllNutritionist);
router.patch("/nutritionist/approve/:userId", authMiddleware, authorize(ROLES.ADMIN), adminNutritionistController.approveNutritionist);
router.patch("/nutritionist/reject/:userId", authMiddleware, authorize(ROLES.ADMIN), adminNutritionistController.rejectNutritionist);
router.patch("/nutritionist/:userId/level", authMiddleware, authorize(ROLES.ADMIN), adminNutritionistController.updateNutritionistLevel);
router.get("/nutritionist/:userId", authMiddleware, authorize(ROLES.ADMIN), adminNutritionistController.getNutritionistProfile);

router.get("/notifications", authMiddleware, authorize(ROLES.ADMIN), adminNotificationController.getAllNotifications);
router.patch("/notifications/read/:id", authMiddleware, authorize(ROLES.ADMIN), adminNotificationController.markAsRead);

router.get("/plans", authMiddleware, authorize(ROLES.ADMIN), adminPlanController.getAllPlans);
router.patch("/plans/:planId/publish", authMiddleware, authorize(ROLES.ADMIN), adminPlanController.publishPlan);
router.post("/refresh-token", adminRefreshToken);
export default router;
