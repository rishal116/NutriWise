import { ChatType } from "@/types/chat/chat.types";

export interface ConversationListItemDTO {
  conversationId: string;
  chatType: ChatType;
  title: string;
  avatar?: string;
  otherUserId?: string;
  lastMessagePreview?: string;
  lastActivityAt?: string;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
}
