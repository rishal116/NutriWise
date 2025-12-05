import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { upload } from "../middlewares/multer.middleware"
import { authMiddleware } from "../middlewares/auth.middleware";
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { INutritionistProfileController } from "../controllers/interfaces/nutritionist/INutritionistProfileController";
import { INutritionistAvailabilityController } from "../controllers/interfaces/nutritionist/INutritionistAvailabilityController";



const router = Router();
const nutritionistAuthController = container.get<INutritionistAuthController>(TYPES.INutritionistAuthController);
const nutritionistProfileController = container.get<INutritionistProfileController>(TYPES.INutritionistProfileController);
const nutritionistAvailability = container.get<INutritionistAvailabilityController>(TYPES.INutritionistAvailabilityController)


router.post(
  "/submit-details",
  authMiddleware,
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "certifications", maxCount: 10 }
  ]),
  nutritionistAuthController.submitDetails
);

router.get("/profile",authMiddleware,nutritionistProfileController.getNutritionistProfile)
router.post("/availability", authMiddleware,nutritionistAvailability.saveAvailability);
router.get("/availability", authMiddleware,nutritionistAvailability.getAvailability);
export default router;
