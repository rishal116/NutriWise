import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { INutriProgramProgressController } from "../../controllers/interfaces/nutritionist/INutriProgramProgressController";

const router = Router();

const controller = container.get<INutriProgramProgressController>(
  TYPES.INutriProgramProgressController,
);

router.get(
  "/clients/:clientId/programs/:userProgramId/progress",
  controller.getProgramOverview,
);

router.get(
  "/clients/:clientId/programs/:userProgramId/progress/days",
  controller.getProgramDays,
);

router.get(
  "/clients/:clientId/programs/:userProgramId/progress/days/:dayNumber/activities",
  controller.getDayActivityResults,
);

export default router;
