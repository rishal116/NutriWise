import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { INutritionistPlanController } from "../../controllers/interfaces/nutritionist/INutriPlanController";

const router = Router();

const controller = container.get<INutritionistPlanController>(
  TYPES.INutritionistPlanController,
);

router.post("/", controller.createPlan);

router.get("/", controller.getMyPlans);

router.get("/metadata", controller.getPlanMetadata);

router.get("/:planId", controller.getPlanById);

router.put("/:planId", controller.updatePlan);

export default router;
