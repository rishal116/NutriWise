import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { optionalAuthMiddleware } from "../../middlewares/optionalAuth.middleware";

import { IPublicGroupController } from "../../controllers/interfaces/public/IPublicGroupController";

const router = Router();

const controller = container.get<IPublicGroupController>(
  TYPES.IPublicGroupController,
);

router.get("/", controller.browseGroups);

router.get("/:groupId", optionalAuthMiddleware, controller.getGroup);

router.post("/:groupId/join", authMiddleware, controller.joinGroup);

export default router;
