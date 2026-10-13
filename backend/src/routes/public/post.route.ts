import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IPublicPostController } from "../../controllers/interfaces/public/IPublicPostController";
import { optionalAuthMiddleware } from "../../middlewares/optionalAuth.middleware";

const router = Router();

const controller = container.get<IPublicPostController>(
  TYPES.IPublicPostController,
);

router.get("/", optionalAuthMiddleware, controller.browsePosts);

router.get("/author/:userId", controller.browsePostsByAuthor);

router.get("/:postId", controller.getPost);

export default router;
