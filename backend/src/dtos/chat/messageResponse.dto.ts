export interface MessageResponseDTO {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  mediaUrl?: string;
  type: string;
  createdAt: Date;
}
