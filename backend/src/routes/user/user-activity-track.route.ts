import express from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IUserActivityTrackingController } from "../../controllers/interfaces/user/IUserActivityTrackingController";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router({ mergeParams: true });

const userActivityTrackingController =
  container.get<IUserActivityTrackingController>(
    TYPES.IUserActivityTrackingController,
  );

router.use(authMiddleware);

router.post(
  "/:dayId/activities/:activityId/start",
  userActivityTrackingController.startActivity,
);

router.patch(
  "/:dayId/activities/:activityId",
  userActivityTrackingController.updateActivity,
);

router.patch(
  "/:dayId/activities/:activityId/skip",
  userActivityTrackingController.skipActivity,
);

router.get(
  "/:dayId/activities/:activityId/tracking",
  userActivityTrackingController.getActivityTracking,
);

router.get(
  "/:dayId/activities/tracking",
  userActivityTrackingController.getDayActivityTracking,
);

export default router;
