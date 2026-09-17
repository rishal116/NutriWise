import express from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { IUserChallengeTrackingController } from "../../controllers/interfaces/user/IUserChallengeTrackingController";

const router = express.Router();

const userChallengeTrackingController =
  container.get<IUserChallengeTrackingController>(
    TYPES.IUserChallengeTrackingController,
  );

router.post(
  "/:userChallengeId/days/:challengeDayId/activities/:activityId/complete",
  authMiddleware,
  userChallengeTrackingController.completeActivity,
);

router.delete(
  "/:userChallengeId/days/:challengeDayId/activities/:activityId/complete",
  authMiddleware,
  userChallengeTrackingController.uncompleteActivity,
);

export default router;
