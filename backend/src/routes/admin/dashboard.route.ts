import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IAdminDashboardController } from "../../controllers/interfaces/admin/IAdminDashboardController";

const router = Router();

const adminDashboardController = container.get<IAdminDashboardController>(
  TYPES.IAdminDashboardController,
);

router.get("/overview", adminDashboardController.getOverview);

export default router;
