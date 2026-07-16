import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { INutriMeetingsController } from "../../controllers/interfaces/nutritionist/INutriMeetingsController";

const router = Router();

const controller = container.get<INutriMeetingsController>(
  TYPES.INutriMeetingsController,
);

router.get("/", controller.getMeetings);

router.post("/", controller.createMeeting);

router.patch("/status/:roomId", controller.updateMeetingStatus);

export default router;
