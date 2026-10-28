import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import type { IAdminDashboardController } from "../../controllers/interfaces/admin/IAdminDashboardController";

const router = Router();

const adminDashboardController = container.get<IAdminDashboardController>(
  TYPES.IAdminDashboardController,
);

router.get("/overview", adminDashboardController.getOverview);

router.get(
  "/registration-trend",
  adminDashboardController.getRegistrationTrend,
);

router.get("/revenue-trend", adminDashboardController.getRevenueTrend);

router.get("/recent-users", adminDashboardController.getRecentUsers);

router.get(
  "/pending-nutritionists",
  adminDashboardController.getPendingNutritionists,
);

router.get("/recent-payments", adminDashboardController.getRecentPayments);

export default router;
