import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { optionalAuthMiddleware } from "../../middlewares/optionalAuth.middleware";

import type { IPublicSessionController } from "../../controllers/interfaces/public/IPublicSessionController";
import type { ISessionRoomController } from "../../controllers/interfaces/public/ISessionRoomController";

const router = Router();

const controller = container.get<IPublicSessionController>(
  TYPES.IPublicSessionController,
);

const sessionRoomController = container.get<ISessionRoomController>(
  TYPES.ISessionRoomController,
);

router.get("/", controller.getPublicSessions);

router.get(
  "/:sessionId",
  optionalAuthMiddleware,
  controller.getPublicSessionDetails,
);

router.post(
  "/:sessionId/join",
  authMiddleware,
  sessionRoomController.joinSession,
);

router.post(
  "/:sessionId/start",
  authMiddleware,
  sessionRoomController.startSession,
);

router.post(
  "/:sessionId/end",
  authMiddleware,
  sessionRoomController.endSession,
);

export default router;
