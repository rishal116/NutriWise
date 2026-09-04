import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { IPublicResourceController } from "../../controllers/interfaces/public/IPublicResourceController";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const controller = container.get<IPublicResourceController>(
  TYPES.IPublicResourceController,
);

// Public
router.get("/", controller.getPublicResources);

router.get("/:resourceId", controller.getPublicResourceDetails);

// Authenticated resource interactions
router.post("/:resourceId/view", authMiddleware, controller.recordResourceView);

router.post("/:resourceId/like", authMiddleware, controller.likeResource);

router.delete("/:resourceId/like", authMiddleware, controller.unlikeResource);

router.post(
  "/:resourceId/bookmark",
  authMiddleware,
  controller.bookmarkResource,
);

router.delete(
  "/:resourceId/bookmark",
  authMiddleware,
  controller.unbookmarkResource,
);

router.post(
  "/:resourceId/comments",
  authMiddleware,
  controller.addResourceComment,
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  controller.deleteResourceComment,
);

export default router;
