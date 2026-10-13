export interface ConversationResponseDTO {
  id: string;
  chatType: "direct" | "group";
  purpose: "coaching" | "consultation" | "group_coaching";
  status: "active" | "inactive" | "blocked" | "closed";
  title?: string;
  avatar?: string;
  description?: string;
  participant?: {
    id: string;
    name: string;
    profileImage?: string;
  };
  lastMessage?: string;
  lastActivityAt?: Date;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
