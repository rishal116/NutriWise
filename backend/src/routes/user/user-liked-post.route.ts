import express from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IUserLikedPostController } from "../../controllers/interfaces/user/IUserLikedPostController";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

const likedPostController = container.get<IUserLikedPostController>(
  TYPES.IUserLikedPostController,
);

router.get("/", authMiddleware, likedPostController.browseMyLikedPosts);

router.get(
  "/:postId",
  authMiddleware,
  likedPostController.findMyLikedPostDetails,
);

export default router;