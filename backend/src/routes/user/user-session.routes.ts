
import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { IUserSessionController } from "../../controllers/interfaces/user/IUserSessionController"; 

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const controller = container.get<IUserSessionController>(
  TYPES.IUserSessionController,
);

router.get("/", authMiddleware, controller.getUserSessions);

router.get("/:sessionId", authMiddleware, controller.getUserSessionDetails);

export default router;
