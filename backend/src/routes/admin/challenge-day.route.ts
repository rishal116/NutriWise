import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { IAdminChallengeDayController } from "../../controllers/interfaces/admin/IAdminChallengeDayController";

import { upload } from "../../middlewares/multer.middleware";

const router = Router({
  mergeParams: true,
});

const adminChallengeDayController = container.get<IAdminChallengeDayController>(
  TYPES.IAdminChallengeDayController,
);

const activityMediaUpload = upload.fields([
  {
    name: "activityImages",
    maxCount: 50,
  },
  {
    name: "activityVideos",
    maxCount: 50,
  },
]);

router.post("/", activityMediaUpload, adminChallengeDayController.createDay);

router.get("/", adminChallengeDayController.listDays);

router.get("/:dayId", adminChallengeDayController.getDay);

router.patch(
  "/:dayId",
  activityMediaUpload,
  adminChallengeDayController.updateDay,
);

router.delete("/:dayId", adminChallengeDayController.deleteDay);

export default router;
