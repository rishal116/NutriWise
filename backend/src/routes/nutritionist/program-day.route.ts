import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { INutriProgramDayController } from "../../controllers/interfaces/nutritionist/INutriProgramDayController";

const router = Router();

const controller = container.get<INutriProgramDayController>(
  TYPES.INutriProgramDayController,
);

router.get("/:dayId", controller.getProgramDayDetails);

router.patch("/:dayId", controller.updateProgramDay);

router.delete("/:dayId", controller.deleteProgramDay);

export default router;