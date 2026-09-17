import express from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { IUserChallengeController } from "../../controllers/interfaces/user/IUserChallengeController";

const router = express.Router();

const userChallengeController = container.get<IUserChallengeController>(
  TYPES.IUserChallengeController,
);

router.get("/", authMiddleware, userChallengeController.browseChallenges);

router.post(
  "/:challengeId/join",
  authMiddleware,
  userChallengeController.joinChallenge,
);

router.get(
  "/:userChallengeId",
  authMiddleware,
  userChallengeController.getChallenge,
);

export default router;
