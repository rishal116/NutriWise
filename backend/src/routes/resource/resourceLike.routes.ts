import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { ResourceLikeController } from "../../controllers/implementations/resource/resourceLike.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const resourceLikeController = container.get<ResourceLikeController>(
  TYPES.IResourceLikeController,
);

router.post(
  "/:resourceId/like",
  authMiddleware,
  resourceLikeController.likeResource,
);

router.delete(
  "/:resourceId/like",
  authMiddleware,
  resourceLikeController.unlikeResource,
);

export default router;