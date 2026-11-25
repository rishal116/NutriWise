import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { optionalAuthMiddleware } from "../../middlewares/optionalAuth.middleware";

import type { IPublicSessionController } from "../../controllers/interfaces/public/IPublicSessionController";

const router = Router();

const controller = container.get<IPublicSessionController>(
  TYPES.IPublicSessionController,
);

router.get("/", controller.getPublicSessions);

router.get(
  "/:sessionId",
  optionalAuthMiddleware,
  controller.getPublicSessionDetails,
);

export default router;
