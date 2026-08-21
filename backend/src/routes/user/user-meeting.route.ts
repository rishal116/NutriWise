import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IUserMeetingController } from "../../controllers/interfaces/user/IUserMeetingController";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const userMeetingController = container.get<IUserMeetingController>(
  TYPES.IUserMeetingController,
);

router.use(authMiddleware);

router.get("/", userMeetingController.getMeetings);

router.get("/:meetingId", userMeetingController.getMeetingDetails);

export default router;
