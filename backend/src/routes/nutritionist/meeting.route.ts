import express from "express";

import { container } from "../../configs/inversify";
import { INutriMeetingController } from "../../controllers/interfaces/nutritionist/INutriMeetingController";
import { TYPES } from "../../types/types";

const router = express.Router();

const nutritionistMeetingController = container.get<INutriMeetingController>(
  TYPES.INutriMeetingController,
);

router.get("/", nutritionistMeetingController.getMeetings);

router.post("/", nutritionistMeetingController.createMeeting);

router.patch(
  "/status/:roomId",
  nutritionistMeetingController.updateMeetingStatus,
);

router.patch("/:meetingId/cancel", nutritionistMeetingController.cancelMeeting);

router.patch("/:meetingId", nutritionistMeetingController.updateMeeting);

router.get("/:meetingId", nutritionistMeetingController.getMeetingDetails);

export default router;
