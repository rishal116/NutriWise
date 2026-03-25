import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { upload } from "../middlewares/multer.middleware"
import { authMiddleware } from "../middlewares/auth.middleware";
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutritionistPlanController";
import { INutritionistSubscriptionController } from "../controllers/interfaces/nutritionist/INutritionistSubscriptionController";
import { authorize } from "../middlewares/role.middleware";
import { ROLES } from "../constants/index";
import { INutriMeetingsController } from "../controllers/interfaces/nutritionist/INutriMeetingsController";
import { INutriProgramController } from "../controllers/interfaces/nutritionist/INutriProgramController";


const router = Router();
const nutritionistAuthController = container.get<INutritionistAuthController>(TYPES.INutritionistAuthController);

const nutritionistPlanController = container.get<INutritionistPlanController>(TYPES.INutritionistPlanController)
const nutritionistSubscriptionController = container.get<INutritionistSubscriptionController>(TYPES.INutritionistSubscriptionController)
const nutritionistMeetingsController = container.get<INutriMeetingsController>(TYPES.INutriMeetingsController)
const nutriProgramController = container.get<INutriProgramController>(TYPES.INutriProgramController)

router.get("/details/me",authMiddleware,nutritionistAuthController.getMyDetails)
router.post("/submit-details",authMiddleware,upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "certifications", maxCount: 10 }
]),nutritionistAuthController.submitDetails);
router.get("/rejection/:userId",authMiddleware,nutritionistAuthController.getRejectionReason);
router.get("/getName",authMiddleware,nutritionistAuthController.getName)

router.post("/plans",authMiddleware,nutritionistPlanController.createPlan);
router.put("/plans/:planId",authMiddleware,nutritionistPlanController.updatePlan);
router.get("/plans",authMiddleware,nutritionistPlanController.getMyPlans);
router.get("/allowed-plan-categories",authMiddleware,nutritionistPlanController.getAllowedPlanCategories);
router.get("/pricing", authMiddleware,nutritionistPlanController.getNutritionistPricing);
router.get("/plans/:planId", authMiddleware, nutritionistPlanController.getPlanById);
router.put("/plans/:planId", authMiddleware, nutritionistPlanController.updatePlan);

router.get("/subscription",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistSubscriptionController.getSubscriptions);
router.get("/subscribers",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistSubscriptionController.getSubscribers);

router.get("/programs",authMiddleware,authorize(ROLES.NUTRITIONIST),nutriProgramController.getPrograms)
router.get("/programs/:programId",authMiddleware,authorize(ROLES.NUTRITIONIST),nutriProgramController.getProgramDetails);
router.get(
  "/programs/:programId/days",
  authMiddleware,
  authorize(ROLES.NUTRITIONIST),
  nutriProgramController.getProgramDays
);
router.get(
  "/program-days/:dayId",
  authMiddleware,
  authorize(ROLES.NUTRITIONIST),
  nutriProgramController.getProgramDayDetails
);

router.post(
  "/programs/:programId/days",
  authMiddleware,
  authorize(ROLES.NUTRITIONIST),
  nutriProgramController.createProgramDay
);

router.patch(
  "/program-days/:dayId",
  authMiddleware,
  authorize(ROLES.NUTRITIONIST),
  nutriProgramController.updateProgramDay
);

router.delete(
  "/program-days/:dayId",
  authMiddleware,
  authorize(ROLES.NUTRITIONIST),
  nutriProgramController.deleteProgramDay
);


router.get("/meetings",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistMeetingsController.getMeetings)
router.post("/meetings",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistMeetingsController.createMeeting)
router.patch("/meetings/status/:roomId",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistMeetingsController.updateMeetingStatus)


export default router;
