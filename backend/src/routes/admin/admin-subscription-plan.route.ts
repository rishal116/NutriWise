import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { IAdminSubscriptionPlanController } from "../../controllers/interfaces/admin/IAdminSubscriptionPlanController";

const router = Router();

const adminSubscriptionPlanController =
  container.get<IAdminSubscriptionPlanController>(
    TYPES.IAdminSubscriptionPlanController,
  );

router.post("/", adminSubscriptionPlanController.createPlan);

router.get("/", adminSubscriptionPlanController.browsePlans);

router.get("/:planId", adminSubscriptionPlanController.getPlan);

router.patch("/:planId", adminSubscriptionPlanController.updatePlan);

router.patch("/:planId/publish", adminSubscriptionPlanController.publishPlan);

router.patch("/:planId/archive", adminSubscriptionPlanController.archivePlan);

export default router;
