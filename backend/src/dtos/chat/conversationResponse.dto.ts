export interface ConversationResponseDTO {
  id: string;
  chatType: "direct" | "group";

  // Direct chat
  otherUserName?: string | null;
  otherUserProfile?: string | null;

  // Group chat
  title?: string;
  groupAvatar?: string;
  memberCount?: number;

  // Common
  lastMessageId?: string;
  lastMessageAt?: Date;
  lastMessage?: string | null;
}