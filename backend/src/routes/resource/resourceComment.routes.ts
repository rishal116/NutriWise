import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { ResourceCommentController } from "../../controllers/implementations/resource/resourceComment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const resourceCommentController = container.get<ResourceCommentController>(
  TYPES.IResourceCommentController,
);

router.post(
  "/:resourceId/comments",
  authMiddleware,
  resourceCommentController.addComment,
);

router.get(
  "/:resourceId/comments",
  resourceCommentController.getComments,
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  resourceCommentController.deleteComment,
);

export default router;