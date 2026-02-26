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


const router = Router();
const nutritionistAuthController = container.get<INutritionistAuthController>(TYPES.INutritionistAuthController);

const nutritionistPlanController = container.get<INutritionistPlanController>(TYPES.INutritionistPlanController)
const nutritionistSubscriptionController = container.get<INutritionistSubscriptionController>(TYPES.INutritionistSubscriptionController)
const nutritionistMeetingsController = container.get<INutriMeetingsController>(TYPES.INutriMeetingsController)


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
router.get("/specializations",authMiddleware,nutritionistPlanController.getSpecializations);
router.get("/pricing", authMiddleware,nutritionistPlanController.getNutritionistPricing);
router.get("/plans/:planId", authMiddleware, nutritionistPlanController.getPlanById);
router.put("/plans/:planId", authMiddleware, nutritionistPlanController.updatePlan);

router.get("/subscription",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistSubscriptionController.getSubscribers);



router.get("/meetings",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistMeetingsController.getMeetings)
router.post("/meetings",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistMeetingsController.createMeeting)

export default router;
