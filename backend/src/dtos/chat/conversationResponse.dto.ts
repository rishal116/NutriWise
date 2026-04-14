export interface ConversationResponseDTO {
  id: string;

  chatType: "direct" | "group";

  otherUserName?: string | null;
  otherUserProfile?: string | null;

  title?: string;
  groupAvatar?: string;
  adminId?: string;

  lastMessageId?: string;
  lastMessageAt?: Date;

  lastMessage?: string | null;   // ✅ ADD THIS
}