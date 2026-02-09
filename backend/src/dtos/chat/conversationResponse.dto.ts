export interface ConversationResponseDTO {
  id: string;
  participants: string[];
  type: "direct" | "group";
  lastMessage?: string;
  lastMessageAt?: Date;
}
