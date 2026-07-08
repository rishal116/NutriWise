import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutritionistPlanController";
import { INutritionistSubscriptionController } from "../controllers/interfaces/nutritionist/INutritionistSubscriptionController";
import { authorize } from "../middlewares/role.middleware";
import { ROLES } from "../constants/index";
import { INutriMeetingsController } from "../controllers/interfaces/nutritionist/INutriMeetingsController";
import { INutriProgramController } from "../controllers/interfaces/nutritionist/INutriProgramController";
import { INutriGroupController } from "../controllers/interfaces/nutritionist/INutriGroupController";
import { UserRole } from "../enums/userRole.enum";

const router = Router();

const nutritionistPlanController = container.get<INutritionistPlanController>(
  TYPES.INutritionistPlanController,
);
const nutritionistSubscriptionController =
  container.get<INutritionistSubscriptionController>(
    TYPES.INutritionistSubscriptionController,
  );
const nutritionistMeetingsController = container.get<INutriMeetingsController>(
  TYPES.INutriMeetingsController,
);
const nutriProgramController = container.get<INutriProgramController>(
  TYPES.INutriProgramController,
);

const nurtiGroupController = container.get<INutriGroupController>(
  TYPES.INutriGroupController,
);

router.use(authMiddleware);
router.use(authorize(UserRole.NUTRITIONIST));

router.post("/plans", authMiddleware, nutritionistPlanController.createPlan);
router.put(
  "/plans/:planId",
  authMiddleware,
  nutritionistPlanController.updatePlan,
);
router.get("/plans", authMiddleware, nutritionistPlanController.getMyPlans);
router.get(
  "/allowed-plan-categories",
  authMiddleware,
  nutritionistPlanController.getAllowedPlanCategories,
);
router.get(
  "/pricing",
  authMiddleware,
  nutritionistPlanController.getNutritionistPricing,
);
router.get(
  "/plans/:planId",
  authMiddleware,
  nutritionistPlanController.getPlanById,
);
router.put(
  "/plans/:planId",
  authMiddleware,
  nutritionistPlanController.updatePlan,
);

router.get(
  "/subscription",
  authMiddleware,
  nutritionistSubscriptionController.getSubscriptions,
);
router.get(
  "/subscribers",
  authMiddleware,
  nutritionistSubscriptionController.getSubscribers,
);

router.get("/programs", authMiddleware, nutriProgramController.getPrograms);
router.get(
  "/programs/:programId",
  authMiddleware,
  nutriProgramController.getProgramDetails,
);
router.get(
  "/programs/:programId/days",
  authMiddleware,

  nutriProgramController.getProgramDays,
);
router.get(
  "/program-days/:dayId",
  authMiddleware,

  nutriProgramController.getProgramDayDetails,
);

router.post(
  "/programs/:programId/days",
  authMiddleware,

  nutriProgramController.createProgramDay,
);

router.patch(
  "/program-days/:dayId",
  authMiddleware,

  nutriProgramController.updateProgramDay,
);

router.delete(
  "/program-days/:dayId",
  authMiddleware,

  nutriProgramController.deleteProgramDay,
);

router.get(
  "/meetings",
  authMiddleware,

  nutritionistMeetingsController.getMeetings,
);
router.post(
  "/meetings",
  authMiddleware,

  nutritionistMeetingsController.createMeeting,
);
router.patch(
  "/meetings/status/:roomId",
  authMiddleware,

  nutritionistMeetingsController.updateMeetingStatus,
);
router.post(
  "/groups",
  authMiddleware,

  nurtiGroupController.createGroup,
);

router.get("/my-groups", authMiddleware, nurtiGroupController.getMyGroups);

export default router;
