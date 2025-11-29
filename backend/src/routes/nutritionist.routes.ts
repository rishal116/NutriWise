import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { upload } from "../middlewares/multer.middleware"
import { authMiddleware } from "../middlewares/auth.middleware";
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";



const router = Router();
const nutritionistAuthController = container.get<INutritionistAuthController>(TYPES.INutritionistAuthController);


router.post(
  "/submit-details",
  authMiddleware,
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "certifications", maxCount: 10 }
  ]),
  nutritionistAuthController.submitDetails
);

export default router;
