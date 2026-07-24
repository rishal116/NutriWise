import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { INutriProgramController } from "../../controllers/interfaces/nutritionist/INutriProgramController";
import { INutriProgramDayController } from "../../controllers/interfaces/nutritionist/INutriProgramDayController";

const router = Router();

const programController = container.get<INutriProgramController>(
  TYPES.INutriProgramController,
);

const programDayController = container.get<INutriProgramDayController>(
  TYPES.INutriProgramDayController,
);

router.get("/", programController.getPrograms);

router.get("/:programId", programController.getProgramDetails);

// Program Days
router.get("/:programId/days", programDayController.getProgramDays);

router.post("/:programId/days", programDayController.createProgramDay);

export default router;