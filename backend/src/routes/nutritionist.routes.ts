import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { upload } from "../middlewares/multer.middleware"
import { authMiddleware } from "../middlewares/auth.middleware";
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { INutritionistProfileController } from "../controllers/interfaces/nutritionist/INutritionistProfileController";
import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutritionistPlanController";
import { INutritionistSubscriptionController } from "../controllers/interfaces/nutritionist/INutritionistSubscriptionController";
import { authorize } from "../middlewares/role.middleware";
import { ROLES } from "../constants/index";


const router = Router();
const nutritionistAuthController = container.get<INutritionistAuthController>(TYPES.INutritionistAuthController);
const nutritionistProfileController = container.get<INutritionistProfileController>(TYPES.INutritionistProfileController);
const nutritionistPlanController = container.get<INutritionistPlanController>(TYPES.INutritionistPlanController)
const nutritionistSubscriptionController = container.get<INutritionistSubscriptionController>(TYPES.INutritionistSubscriptionController)

router.post("/submit-details",authMiddleware,upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "certifications", maxCount: 10 }
]),nutritionistAuthController.submitDetails);
router.get("/rejection/:userId",authMiddleware,nutritionistAuthController.getRejectionReason);
router.get("/getName",authMiddleware,nutritionistAuthController.getName)


router.get("/profile",authMiddleware,nutritionistProfileController.getNutritionistProfile)
router.put("/profile",authMiddleware,nutritionistProfileController.updateNutritionistProfile)
router.post("/profile/upload-image",authMiddleware,upload.single("image"),nutritionistProfileController.updateNutritionistProfileImage)
router.get("/profile/upload-image",authMiddleware,nutritionistProfileController.getNutritionistProfileImage)

router.post("/plans",authMiddleware,nutritionistPlanController.createPlan);
router.put("/plans/:planId",authMiddleware,nutritionistPlanController.updatePlan);
router.get("/plans",authMiddleware,nutritionistPlanController.getMyPlans);
router.get("/specializations",authMiddleware,nutritionistPlanController.getSpecializations);
router.get("/pricing", authMiddleware,nutritionistPlanController.getNutritionistPricing);
router.get("/plans/:planId", authMiddleware, nutritionistPlanController.getPlanById);
router.put("/plans/:planId", authMiddleware, nutritionistPlanController.updatePlan);


router.get("/subscription",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistSubscriptionController.getSubscribers);



export default router;
