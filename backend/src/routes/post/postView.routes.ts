import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { PostViewController } from "../../controllers/implementations/post/postView.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const postViewController = container.get<PostViewController>(
  TYPES.IPostViewController,
);

router.post("/:postId/view", authMiddleware, postViewController.viewPost);

export default router;
