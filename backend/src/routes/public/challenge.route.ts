import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { optionalAuthMiddleware } from "../../middlewares/optionalAuth.middleware";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { IPublicChallengeController } from "../../controllers/interfaces/public/IPublicChallengeController";

import { IUserChallengeController } from "../../controllers/interfaces/user/IUserChallengeController";

const router = Router();

const controller = container.get<IPublicChallengeController>(
  TYPES.IPublicChallengeController,
);

const userChallengeController = container.get<IUserChallengeController>(
  TYPES.IUserChallengeController,
);

router.get("/sections", controller.getChallengeSections);

router.get("/:challengeId/days/:dayId", controller.getChallengeDayDetails);

router.get(
  "/:challengeId",
  optionalAuthMiddleware,
  controller.getChallengeDetails,
);

router.post(
  "/:challengeId/join",
  authMiddleware,
  userChallengeController.joinChallenge,
);

export default router;
