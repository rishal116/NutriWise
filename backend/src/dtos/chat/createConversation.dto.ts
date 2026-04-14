export interface CreateDirectConversationDTO {
  currentUserId: string;
  otherUserId: string;
  context: "user" | "nutritionist";
}