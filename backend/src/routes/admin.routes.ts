import { Router } from "express";
import { TYPES } from "../types/types";
import { IAdminAuthController } from "../controllers/interfaces/admin/IAdminAuthController";
import { IAdminClientController } from "../controllers/interfaces/admin/IAdminClientController";
import { IAdminNotificationController } from "../controllers/interfaces/admin/IAdminNotificationController";
import { IAdminNutritionistController } from "../controllers/interfaces/admin/IAdminNutritionistController";
import { IAdminChallengeController } from "../controllers/interfaces/admin/IAdminChallengeController";
import { container } from "../configs/inversify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { ROLES } from "../constants";
import { upload } from "../middlewares/multer.middleware";
import { refreshToken } from "../middlewares/refreshToken.middleware";
import { IAdminTaskController } from "../controllers/interfaces/admin/IAdminTaskController";

const adminAuthController = container.get<IAdminAuthController>(
  TYPES.IAdminAuthController,
);
const adminClientController = container.get<IAdminClientController>(
  TYPES.IAdminClientController,
);
const adminNutritionistController = container.get<IAdminNutritionistController>(
  TYPES.IAdminNutritionistController,
);
const adminNotificationController = container.get<IAdminNotificationController>(
  TYPES.IAdminNotificationController,
);
const adminChallengeController = container.get<IAdminChallengeController>(
  TYPES.IAdminChallengeController,
);

const adminTaskController = container.get<IAdminTaskController>(
  TYPES.IAdminTaskController,
);

const router = Router();

router.post("/login", adminAuthController.login);
router.get("/refresh-token", refreshToken);
router.post("/logout", adminAuthController.logout);

router.use(authMiddleware);
router.use(authorize(ROLES.ADMIN));

router.get("/users", adminClientController.getAllUsers);
router.patch("/users/:userId/block", adminClientController.blockUser);
router.patch("/users/:userId/unblock", adminClientController.unblockUser);

router.get("/nutritionists", adminNutritionistController.getAllNutritionists);
router.get(
  "/nutritionists/applications",
  adminNutritionistController.getNutritionistApplications,
);
router.get(
  "/nutritionists/:userId",
  adminNutritionistController.getNutritionistProfile,
);
router.patch(
  "/nutritionists/:userId/approve",
  adminNutritionistController.approveNutritionist,
);
router.patch(
  "/nutritionists/:userId/reject",
  adminNutritionistController.rejectNutritionist,
);

router.patch(
  "/nutritionists/:userId/level",
  adminNutritionistController.updateNutritionistLevel,
);

router.get("/notifications", adminNotificationController.getAllNotifications);
router.patch("/notifications/:id/read", adminNotificationController.markAsRead);

router.post(
  "/challenges/create",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "introVideo", maxCount: 1 },
    { name: "mediaFiles", maxCount: 50 },
  ]),
  adminChallengeController.createChallenge,
);
router.get("/challenges", adminChallengeController.getChallenges);
router.get("/challenges/:id", adminChallengeController.getChallengeById);
router.put("/challenges/:id",  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "introVideo", maxCount: 1 },
    { name: "mediaFiles", maxCount: 50 },
  ]), adminChallengeController.updateChallenge);
router.delete("/challenges/:id", adminChallengeController.deleteChallenge);
router.patch(
  "/challenges/:id/publish",
  adminChallengeController.publishChallenge,
);

router.post(
  "/challenges/:challengeId/tasks",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "mediaFiles", maxCount: 50 },
    { name: "instructionMediaFiles", maxCount: 100 },
  ]),
  adminTaskController.createTask,
);

router.get(
  "/challenges/:challengeId/tasks",
  adminTaskController.getTasksByChallenge,
);
router.get("/tasks/:taskId", adminTaskController.getTaskById);
router.put(
  "/tasks/:taskId",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "mediaFiles", maxCount: 50 },
    { name: "instructionMediaFiles", maxCount: 100 },
  ]),
  adminTaskController.updateTask,
);

router.delete("/tasks/:taskId", adminTaskController.deleteTask);

export default router;
