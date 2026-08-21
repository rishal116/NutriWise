import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IMessageController } from "../../controllers/interfaces/chat/IMessageController";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

const router = Router();

const messageController = container.get<IMessageController>(
  TYPES.IMessageController,
);

router.get("/:conversationId", authMiddleware, messageController.getMessages);

router.post("/", authMiddleware, messageController.sendMessage);

router.post(
  "/file",
  authMiddleware,
  upload.single("file"),
  messageController.sendFile,
);

router.patch(
  "/read/:conversationId",
  authMiddleware,
  messageController.markAsRead,
);

router.patch(
  "/delete/:messageId",
  authMiddleware,
  messageController.deleteMessage,
);

router.patch("/edit/:messageId", authMiddleware, messageController.editMessage);

export default router;
