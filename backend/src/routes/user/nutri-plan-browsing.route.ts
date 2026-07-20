import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { INutritionistPlanBrowsingController } from "../../controllers/interfaces/user/INutritionistPlanBrowsingController";

const router = Router();

const nutritionistPlanBrowsingController =
  container.get<INutritionistPlanBrowsingController>(
    TYPES.INutritionistPlanBrowsingController,
  );

router.get(
  "/plans/:slug",
  (req, res, next) => {
    console.log("DETAIL ROUTE HIT", req.params);
    next();
  },
  nutritionistPlanBrowsingController.getPlanBySlug,
);

router.get("/:username/plans", nutritionistPlanBrowsingController.getPlans);

export default router;
