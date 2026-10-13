import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { PostCommentController } from "../../controllers/implementations/post/postComment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const postCommentController = container.get<PostCommentController>(
  TYPES.IPostCommentController,
);

router.post(
  "/:postId/comments",
  authMiddleware,
  postCommentController.createComment,
);

router.get("/:postId/comments", postCommentController.getComments);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  postCommentController.deleteComment,
);

export default router;
