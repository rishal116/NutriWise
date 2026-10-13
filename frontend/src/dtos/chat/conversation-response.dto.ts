export interface ConversationParticipantDTO {
  id: string;
  name: string;
  profileImage?: string;
}

export interface ConversationResponseDTO {
  id: string;
  chatType: "direct" | "group";
  purpose: "coaching" | "consultation" | "group_coaching";
  status: "active" | "inactive" | "blocked" | "closed";
  title?: string;
  avatar?: string;
  description?: string;
  participant?: ConversationParticipantDTO;
  lastMessage?: string;
  lastActivityAt?: string;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
