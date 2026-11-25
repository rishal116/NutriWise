import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { authMiddleware } from "../../middlewares/auth.middleware";

import type { ISessionRoomController } from "../../controllers/interfaces/public/ISessionRoomController";

const router = Router();

const controller = container.get<ISessionRoomController>(
  TYPES.ISessionRoomController,
);

// Protect all session-room endpoints.
router.use(authMiddleware);

router.get("/:roomId/details", controller.getSessionRoomDetails);
router.post("/:roomId/join", controller.joinSession);
router.post("/:roomId/start", controller.startSession);
router.post("/:roomId/end", controller.endSession);

export default router;
