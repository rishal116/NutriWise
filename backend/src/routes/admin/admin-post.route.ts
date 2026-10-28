import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import type { IAdminPostController } from "../../controllers/interfaces/admin/IAdminPostController";

const router = Router();

const adminPostController = container.get<IAdminPostController>(
  TYPES.IAdminPostController,
);

router.get("/", adminPostController.getPosts);

router.delete("/:postId", adminPostController.deletePost);

export default router;