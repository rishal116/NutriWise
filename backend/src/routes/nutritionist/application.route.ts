import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { upload } from "../../middlewares/multer.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import { UserRole } from "../../enums/user.enum";

import { INutritionistApplicationController } from "../../controllers/interfaces/nutritionist/INutriApplicationController";

const router = Router();

const controller = container.get<INutritionistApplicationController>(
  TYPES.INutritionistApplicationController,
);

router.use(authMiddleware);

router.use(authorize(UserRole.USER, UserRole.NUTRITIONIST, UserRole.ADMIN));

router.get("/details", controller.getApplicationDetails);

router.post(
  "/submit",
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
    {
      name: "certifications",
      maxCount: 10,
    },
  ]),
  controller.submitApplication,
);

router.get("/status", controller.getApplicationStatus);

export default router;
