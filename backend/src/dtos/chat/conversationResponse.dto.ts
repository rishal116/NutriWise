export interface ConversationResponseDTO {
  id: string;

  chatType: "direct" | "group";

  // For direct chat
otherUserName?: string | null;
otherUserProfile?: string | null;

  // For group chat
  title?: string;
  groupAvatar?: string;
  adminId?: string;

  // Common
  lastMessageId?: string;
  lastMessageAt?: Date;
}
