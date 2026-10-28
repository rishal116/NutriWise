
import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { IUserDashboardController } from "../../controllers/interfaces/user/IUserDashboardController";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const controller = container.get<IUserDashboardController>(
  TYPES.IUserDashboardController,
);

router.get("/overview", authMiddleware, controller.getOverview);

router.get("/active-programs", authMiddleware, controller.getActivePrograms);

router.get("/today-tracking", authMiddleware, controller.getTodayTracking);

router.get("/weekly-progress", authMiddleware, controller.getWeeklyProgress);

router.get(
  "/upcoming-consultations",
  authMiddleware,
  controller.getUpcomingConsultations,
);

router.get("/payment-overview", authMiddleware, controller.getPaymentOverview);

export default router;
