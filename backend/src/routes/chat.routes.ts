import express from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { IConversationController } from "../controllers/interfaces/chat/IConversationController";
import { IMessageController } from "../controllers/interfaces/chat/IMessageController";
import { upload } from "../middlewares/multer.middleware";


const router = express.Router();
const conversationController = container.get<IConversationController>(TYPES.IConversationController);
const messageController = container.get<IMessageController>(TYPES.IMessageController);

// Conversation Routes
router.post("/conversation",authMiddleware,conversationController.createDirectConversation);
router.get("/conversations",authMiddleware,conversationController.getUserChats);

// Message Routes
router.get("/messages/:conversationId",authMiddleware,messageController.getMessages);
router.post("/message",authMiddleware,messageController.sendMessage);

// File Messages
router.post(
  "/message/file",
  authMiddleware,
  upload.single("file"),
  messageController.sendFile
);

// Mark As Read
router.patch("/read/:conversationId",authMiddleware,messageController.markAsRead);

// Delete Messages
router.patch("/delete/:messageId",authMiddleware,messageController.deleteMessage);

// Edit Messages
router.patch("/edit/:messageId",authMiddleware,messageController.editMessage);

export default router;