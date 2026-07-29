import express from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { IUserProgramDayController } from "../../controllers/interfaces/user/IUserProgramDayController";

const router = express.Router({ mergeParams: true });

const controller = container.get<IUserProgramDayController>(
  TYPES.IUserProgramDayController,
);

router.use(authMiddleware);

router.get("/", controller.browseProgramDays);

router.get("/:dayNumber", controller.getDayDetails);

export default router;
