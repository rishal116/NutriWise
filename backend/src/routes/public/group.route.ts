import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { IPublicGroupController } from "../../controllers/interfaces/public/IPublicGroupController";

const router = Router();

const controller = container.get<IPublicGroupController>(
  TYPES.IPublicGroupController,
);

router.get("/", controller.browseGroups);

router.get("/:groupId", controller.getGroup);

router.post("/:groupId/join", authMiddleware, controller.joinGroup);

export default router;
