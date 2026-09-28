import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { INutriDashboardController } from "../../controllers/interfaces/nutritionist/INutriDashboardController";

const router = Router();

const controller = container.get<INutriDashboardController>(
  TYPES.INutriDashboardController,
);

router.get("/", controller.getOverview);

export default router;
