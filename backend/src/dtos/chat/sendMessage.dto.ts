import { MessageType } from "../../models/message.model";

export interface SendMessageDTO {
  conversationId: string;
  senderId: string;
  content?: string;
  mediaUrl?: string;
  type: MessageType;
}
