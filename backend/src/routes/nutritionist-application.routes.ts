import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { upload } from "../middlewares/multer.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { INutritionistApplicationController } from "../controllers/interfaces/nutritionist/INutriApplicationController";
import { UserRole } from "../enums/userRole.enum";

const router = Router();
const nutriApplicationController =
  container.get<INutritionistApplicationController>(
    TYPES.INutritionistApplicationController,
  );

router.use(authMiddleware);
router.use(authorize(UserRole.USER, UserRole.NUTRITIONIST, UserRole.ADMIN));

router.get("/details", nutriApplicationController.getApplicationDetails);

router.post(
  "/submit",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "certifications", maxCount: 10 },
  ]),
  nutriApplicationController.submitApplication,
);

router.get("/status", nutriApplicationController.getApplicationStatus);

export default router;
