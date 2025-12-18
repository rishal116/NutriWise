import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { upload } from "../middlewares/multer.middleware"
import { authMiddleware } from "../middlewares/auth.middleware";
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { INutritionistProfileController } from "../controllers/interfaces/nutritionist/INutritionistProfileController";
import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutritionistPlanController";
import { validateDtoMiddleware } from "../middlewares/validateDto.middleware";
import { CreatePlanDto, UpdatePlanDto } from "../dtos/nutritionist/nutritionsitPlan.dto";



const router = Router();
const nutritionistAuthController = container.get<INutritionistAuthController>(TYPES.INutritionistAuthController);
const nutritionistProfileController = container.get<INutritionistProfileController>(TYPES.INutritionistProfileController);
const nutritionistPlanController = container.get<INutritionistPlanController>(TYPES.INutritionistPlanController)


router.post(
  "/submit-details",
  authMiddleware,
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "certifications", maxCount: 10 }
  ]),
  nutritionistAuthController.submitDetails
);

router.get(
  "/rejection/:userId",
  authMiddleware,
  nutritionistAuthController.getRejectionReason
);

router.get("/profile",authMiddleware,nutritionistProfileController.getNutritionistProfile)


router.post("/plans",authMiddleware,validateDtoMiddleware(CreatePlanDto),nutritionistPlanController.createPlan);

router.put("/plans/:planId",authMiddleware,validateDtoMiddleware(UpdatePlanDto),nutritionistPlanController.updatePlan);

router.get(
  "/plans",
  authMiddleware,
  nutritionistPlanController.getMyPlans
);
export default router;
