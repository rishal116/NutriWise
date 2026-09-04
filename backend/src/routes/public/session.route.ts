import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { IPublicSessionController } from "../../controllers/interfaces/public/IPublicSessionController";

import { ISessionRoomController } from "../../controllers/interfaces/public/ISessionRoomController"; 

const router = Router();

const controller = container.get<IPublicSessionController>(
  TYPES.IPublicSessionController,
);

const sessionRoomController = container.get<ISessionRoomController>(
  TYPES.ISessionRoomController,
);

router.get("/", controller.getPublicSessions);

router.get("/:sessionId", controller.getPublicSessionDetails);

router.post(
  "/:sessionId/join",
  authMiddleware,
  sessionRoomController.joinSession,
);

export default router;
