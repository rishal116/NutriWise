import { injectable } from "inversify";
import { getIO } from "../../../infrastructures/socket/socket.server";
import { ISocketService } from "../../interfaces/socket/ISocketService";
import { MessageResponseDTO } from "../../../dtos/chat/message-response.dto";
import type { NotificationResponseDTO } from "../../../dtos/notification/notification-response.dto";
import { ConversationUpdatePayload } from "../../../types/socketEvents";
import logger from "../../../utils/logger";

@injectable()
export class SocketService implements ISocketService {

  emitNewMessage(conversationId: string, message: MessageResponseDTO): void {
    const io = getIO();
    io.to(`chat:${conversationId}`).emit("receiveMessage", message);
  }

  emitMessageEdited(
    conversationId: string,
    messageId: string,
    content: string
  ): void {
    const io = getIO();
    io.to(`chat:${conversationId}`).emit("messageEdited", {
      conversationId,
      messageId,
      content,
    });
  }

  emitMessageDeleted(
    conversationId: string,
    messageId: string
  ): void {
    const io = getIO();
    io.to(`chat:${conversationId}`).emit("messageDeleted", {
      conversationId,
      messageId,
    });
  }

  emitMessagesRead(
    conversationId: string,
    userId: string
  ): void {
    const io = getIO();
    const rooms = [`chat:${conversationId}`, `user:${userId}`];
    io.to(rooms).emit("messagesRead", {
      conversationId,
      userId,
    });
  }

  emitConversationUpdated(
    memberUserIds: string[],
    data: ConversationUpdatePayload
  ): void {
    const io = getIO();
    const rooms = Array.from(new Set(memberUserIds.map((userId) => `user:${userId}`)));
    rooms.push(`chat:${data.conversationId}`);
    io.to(rooms).emit("conversationUpdated", data);
    io.to(rooms).emit("conversation:updated", data);
  }

  emitNewNotification(
    recipientId: string,
    notification: NotificationResponseDTO,
    unreadCount: number
  ): void {
    try {
      const io = getIO();
      const payload = { notification, unreadCount };
      io.to(`user:${recipientId}`).emit("newNotification", payload);
      io.to(`user:${recipientId}`).emit("notification:new", payload);
      io.to(`user:${recipientId}`).emit("notification:count", { unreadCount });
      logger.info("Emitted newNotification event to socket room", {
        recipientId,
        notificationId: notification.id,
        unreadCount,
      });
    } catch (error) {
      logger.warn("Failed to emit newNotification socket event", {
        recipientId,
        error,
      });
    }
  }

  emitNotificationCount(
    recipientId: string,
    unreadCount: number
  ): void {
    try {
      const io = getIO();
      io.to(`user:${recipientId}`).emit("notification:count", { unreadCount });
      logger.info("Emitted notification:count event to socket room", {
        recipientId,
        unreadCount,
      });
    } catch (error) {
      logger.warn("Failed to emit notification:count socket event", {
        recipientId,
        error,
      });
    }
  }

}