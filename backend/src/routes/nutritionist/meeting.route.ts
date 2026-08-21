import express from "express";

import { container } from "../../configs/inversify";
import { INutriMeetingController } from "../../controllers/interfaces/nutritionist/INutriMeetingController";
import { TYPES } from "../../types/types";

const router = express.Router();

const nutritionistMeetingController = container.get<INutriMeetingController>(
  TYPES.INutriMeetingController,
);

router.get("/", nutritionistMeetingController.getMeetings);

router.get("/:meetingId", nutritionistMeetingController.getMeetingDetails);

router.post("/", nutritionistMeetingController.createMeeting);

router.patch(
  "/status/:roomId",
  nutritionistMeetingController.updateMeetingStatus,
);

export default router;
