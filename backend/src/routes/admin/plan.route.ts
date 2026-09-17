import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IAdminPlanController } from "../../controllers/interfaces/admin/IAdminPlanController";

const router = Router();

const adminPlanController = container.get<IAdminPlanController>(
  TYPES.IAdminPlanController,
);

router.get("/", adminPlanController.browsePlans);

router.patch("/:planId/archive", adminPlanController.archivePlan);

export default router;
