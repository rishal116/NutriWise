import { MessageResponseDTO } from "../dtos/chat/message-response.dto";
import type { NotificationResponseDTO } from "../dtos/notification/notification-response.dto";

export interface NotificationSocketPayload {
  notification: NotificationResponseDTO;
  unreadCount: number;
}

export interface SocketEvents {

  receiveMessage: MessageResponseDTO;

  messagesRead: {
    conversationId: string;
    userId: string;
  };

  userTyping: {
    conversationId: string;
    userId: string;
  };

  userStoppedTyping: {
    conversationId: string;
    userId: string;
  };

  messageDeleted: {
    conversationId: string;
    messageId: string;
  };

  messageEdited: {
    conversationId: string;
    messageId: string;
    content: string;
  };

  conversationUpdated: ConversationUpdatePayload;

  "conversation:updated": ConversationUpdatePayload;

  newNotification: NotificationSocketPayload;

  "notification:new": NotificationSocketPayload;

  "notification:count": {
    unreadCount: number;
  };

}

export interface ConversationUpdatePayload {
  conversationId: string;
  chatType?: "direct" | "group";
  lastMessagePreview: string;
  lastMessageSenderId?: string;
  lastActivityAt: string;
  unreadCount?: number;
  title?: string;
  avatar?: string;
  otherUserId?: string;
}