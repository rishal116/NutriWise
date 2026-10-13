import { MessageResponseDTO } from "../dtos/chat/message-response.dto";

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