import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { INutriDashboardController } from "../../controllers/interfaces/nutritionist/INutriDashboardController";

const router = Router();

const controller = container.get<INutriDashboardController>(
  TYPES.INutriDashboardController,
);

router.get("/", controller.getOverview);
router.get("/earnings-chart", controller.getEarningsChart);
router.get("/recent-activities", controller.getRecentActivities);

export default router;
