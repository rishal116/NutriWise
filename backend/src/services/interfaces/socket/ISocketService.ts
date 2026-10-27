import { MessageResponseDTO } from "../../../dtos/chat/message-response.dto";
import type { NotificationResponseDTO } from "../../../dtos/notification/notification-response.dto";
import { ConversationUpdatePayload } from "../../../types/socketEvents";

export interface ISocketService {

  emitNewMessage(
    conversationId: string,
    message: MessageResponseDTO
  ): void;

  emitMessageEdited(
    conversationId: string,
    messageId: string,
    content: string
  ): void;

  emitMessageDeleted(
    conversationId: string,
    messageId: string
  ): void;

  emitMessagesRead(
    conversationId: string,
    userId: string
  ): void;

  emitConversationUpdated(
    memberUserIds: string[],
    data: ConversationUpdatePayload
  ): void;

  emitNewNotification(
    recipientId: string,
    notification: NotificationResponseDTO,
    unreadCount: number
  ): void;

  emitNotificationCount(
    recipientId: string,
    unreadCount: number
  ): void;

}