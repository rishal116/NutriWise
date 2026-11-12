
import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { INutritionistPlanController } from "../../controllers/interfaces/nutritionist/INutriPlanController";
import type { INutritionistPlanDayController } from "../../controllers/interfaces/nutritionist/INutriPlanDayController";

const router = Router();

const planController = container.get<INutritionistPlanController>(
  TYPES.INutritionistPlanController,
);

const planDayController = container.get<INutritionistPlanDayController>(
  TYPES.INutriPlanDayController,
);

// Plan routes
router.post("/", planController.createPlan);
router.get("/", planController.getMyPlans);
router.get("/metadata", planController.getPlanMetadata);
router.get("/:planId", planController.getPlanById);
router.put("/:planId", planController.updatePlan);
router.patch("/:planId/status", planController.updatePlanStatus);

// Plan day routes
router.post("/:planId/days", planDayController.createPlanDay);
router.get("/:planId/days", planDayController.browsePlanDays);
router.get("/:planId/days/:dayNumber", planDayController.getPlanDayDetails);
router.put("/:planId/days/:dayNumber", planDayController.updatePlanDay);

export default router;
