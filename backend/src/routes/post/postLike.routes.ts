import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { PostLikeController } from "../../controllers/implementations/post/postLike.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const postLikeController = container.get<PostLikeController>(
  TYPES.IPostLikeController,
);

router.post("/:postId/like", authMiddleware, postLikeController.likePost);

router.delete("/:postId/like", authMiddleware, postLikeController.unlikePost);

export default router;
