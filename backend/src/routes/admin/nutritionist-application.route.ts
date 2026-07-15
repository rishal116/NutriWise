import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IAdminNutritionistApplicationController } from "../../controllers/interfaces/admin/IAdminNutritionistApplicationController";

const router = Router();

const applicationController =
  container.get<IAdminNutritionistApplicationController>(
    TYPES.IAdminNutritionistApplicationController,
  );

router.get("/", applicationController.getApplications);

router.patch(
  "/:userId/status",
  applicationController.updateApplicationStatus,
);

export default router;