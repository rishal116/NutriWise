import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { INutritionistBrowsingController } from "../../controllers/interfaces/user/INutriBrowsingController";

const router = Router();

const nutritionistBrowsingController =
  container.get<INutritionistBrowsingController>(
    TYPES.INutritionistBrowsingController,
  );

router.get("/", nutritionistBrowsingController.browseNutritionists);
router.get("/stats", nutritionistBrowsingController.getBrowseStatistics);
router.get("/:username", nutritionistBrowsingController.getNutritionistProfile);

export default router;
