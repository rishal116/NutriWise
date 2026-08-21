import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IConversationController } from "../../controllers/interfaces/chat/IConversationController";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const conversationController = container.get<IConversationController>(
  TYPES.IConversationController,
);

router.post(
  "/",
  authMiddleware,
  conversationController.createDirectConversation,
);

router.get("/", authMiddleware, conversationController.getUserChats);

export default router;
