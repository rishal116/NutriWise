import { Router } from "express";
import { TYPES } from "../types/types";
import { IAdminUserController } from "../controllers/interfaces/admin/IAdminUserController";
import { IAdminNotificationController } from "../controllers/interfaces/admin/IAdminNotificationController";
import { IAdminNutritionistController } from "../controllers/interfaces/admin/IAdminNutritionistController";
import { container } from "../configs/inversify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "../enums/userRole.enum";
import { IAdminNutritionistApplicationController } from "../controllers/interfaces/admin/IAdminNutritionistApplicationController";

const adminUserController = container.get<IAdminUserController>(
  TYPES.IAdminUserController,
);
const adminNutritionistController = container.get<IAdminNutritionistController>(
  TYPES.IAdminNutritionistController,
);
const adminNotificationController = container.get<IAdminNotificationController>(
  TYPES.IAdminNotificationController,
);

const adminNutritionistApplicationController =
  container.get<IAdminNutritionistApplicationController>(
    TYPES.IAdminNutritionistApplicationController,
  );

  
const router = Router();
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

router.get("/users", adminUserController.getUsers);
router.patch(
  "/users/:userId/block-status",
  adminUserController.updateBlockStatus,
);

router.get("/nutritionists", adminNutritionistController.getNutritionists);
router.get(
  "/nutritionists/:userId",
  adminNutritionistController.getNutritionistDetails,
);
router.patch(
  "/nutritionists/:userId/coach-level",
  adminNutritionistController.updateCoachLevel,
);

router.get(
  "/nutritionist-applications",
  adminNutritionistApplicationController.getApplications,
);

router.patch(
  "/nutritionist-applications/:userId/status",
  adminNutritionistApplicationController.updateApplicationStatus,
);

router.get("/notifications", adminNotificationController.getAllNotifications);
router.patch("/notifications/read/:id", adminNotificationController.markAsRead);

export default router;
