import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import multer from "multer";
import { authMiddleware } from "../middlewares/auth.middleware";
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
const upload = multer({ dest: "uploads/nutritionist_cv/" });

const router = Router();
const nutritionistAuthController = container.get<INutritionistAuthController>(TYPES.INutritionistAuthController);


router.post("/submit-details",authMiddleware,upload.single("cv"),nutritionistAuthController.submitDetails)

export default router;
