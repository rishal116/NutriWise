import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IAdminNutritionistController } from "../../controllers/interfaces/admin/IAdminNutritionistController";

const router = Router();

const adminNutritionistController =
  container.get<IAdminNutritionistController>(
    TYPES.IAdminNutritionistController,
  );

router.get("/", adminNutritionistController.getNutritionists);

router.get(
  "/:userId",
  adminNutritionistController.getNutritionistDetails,
);

router.patch(
  "/:userId/coach-level",
  adminNutritionistController.updateCoachLevel,
);

export default router;