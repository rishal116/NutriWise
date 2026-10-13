import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IGroupController } from "../../controllers/interfaces/chat/IGroupController";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const groupController = container.get<IGroupController>(
  TYPES.IGroupController,
);

router.post(
  "/join/private",
  authMiddleware,
  groupController.joinPrivateGroup,
);

export default router;