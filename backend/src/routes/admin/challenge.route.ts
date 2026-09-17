import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { IAdminChallengeController } from "../../controllers/interfaces/admin/IAdminChallengeController";

import { upload } from "../../middlewares/multer.middleware";

import challengeDayRoutes from "./challenge-day.route";

const router = Router();

const adminChallengeController = container.get<IAdminChallengeController>(
  TYPES.IAdminChallengeController,
);

router.post(
  "/",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  adminChallengeController.createChallenge,
);

router.get("/", adminChallengeController.listChallenges);

router.get("/:challengeId", adminChallengeController.getChallengeDetails);

router.patch(
  "/:challengeId",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  adminChallengeController.updateChallenge,
);

router.delete("/:challengeId", adminChallengeController.deleteChallenge);

router.patch(
  "/:challengeId/publish",
  adminChallengeController.publishChallenge,
);

router.use("/:challengeId/days", challengeDayRoutes);

export default router;
