export interface ConversationListItemDTO {
  conversationId: string;
  chatType: "direct" | "group";
  title: string;
  avatar?: string;
  lastMessagePreview?: string;
  lastActivityAt?: string;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
}