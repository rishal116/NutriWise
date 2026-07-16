import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { INutriProgramController } from "../../controllers/interfaces/nutritionist/INutriProgramController";

const router = Router();

const controller = container.get<INutriProgramController>(
  TYPES.INutriProgramController,
);

router.get("/", controller.getPrograms);

router.get("/:programId", controller.getProgramDetails);

router.get("/:programId/days", controller.getProgramDays);

router.post("/:programId/days", controller.createProgramDay);

router.get("/program-days/:dayId", controller.getProgramDayDetails);

router.patch("/program-days/:dayId", controller.updateProgramDay);

router.delete("/program-days/:dayId", controller.deleteProgramDay);

export default router;
