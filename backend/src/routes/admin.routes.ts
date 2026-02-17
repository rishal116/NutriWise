import { Router } from "express";
import { TYPES } from "../types/types";
import { IAdminAuthController } from "../controllers/interfaces/admin/IAdminAuthController";
import { IAdminClientController } from "../controllers/interfaces/admin/IAdminClientController";
import { IAdminNotificationController } from "../controllers/interfaces/admin/IAdminNotificationController";
import { IAdminNutritionistController } from "../controllers/interfaces/admin/IAdminNutritionistController";
import { container } from "../containers/index";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { ROLES } from "../constants/index";
import { adminRefreshToken } from "../middlewares/adminRefreshToken.middleware";

const adminAuthController = container.get<IAdminAuthController>(TYPES.IAdminAuthController);
const adminClientController = container.get<IAdminClientController>(TYPES.IAdminClientController);
const adminNutritionistController = container.get<IAdminNutritionistController>(TYPES.IAdminNutritionistController);
const adminNotificationController = container.get<IAdminNotificationController>(TYPES.IAdminNotificationController);

const router = Router();


//    PUBLIC ROUTES
router.post("/login", adminAuthController.login);
router.post("/refresh-token", adminRefreshToken);
router.post("/logout", adminAuthController.logout);


//    PROTECTED ROUTES

router.use(authMiddleware);
router.use(authorize(ROLES.ADMIN));


router.get("/users", adminClientController.getAllUsers);
router.patch("/block-user/:userId", adminClientController.blockUser);
router.patch("/unblock-user/:userId", adminClientController.unblockUser);

router.get("/nutritionists", adminNutritionistController.getAllNutritionists);
router.patch("/nutritionist/approve/:userId", adminNutritionistController.approveNutritionist);
router.patch("/nutritionist/reject/:userId", adminNutritionistController.rejectNutritionist);
router.patch("/nutritionist/:userId/level", adminNutritionistController.updateNutritionistLevel);
router.get("/nutritionist/:userId", adminNutritionistController.getNutritionistProfile);

router.get("/notifications", adminNotificationController.getAllNotifications);
router.patch("/notifications/read/:id", adminNotificationController.markAsRead);


export default router;

