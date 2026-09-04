import express from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IUserPostController } from "../../controllers/interfaces/user/IUserPostController";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

const router = express.Router();

const postController = container.get<IUserPostController>(
  TYPES.IUserPostController,
);

router.post(
  "/",
  authMiddleware,
  upload.single("media"),
  postController.createPost,
);

router.get("/", authMiddleware, postController.browseMyPosts);

router.get("/:postId", authMiddleware, postController.findMyPostDetails);

router.patch(
  "/:postId",
  authMiddleware,
  upload.single("media"),
  postController.updatePost,
);

router.delete("/:postId", authMiddleware, postController.deletePost);

export default router;
