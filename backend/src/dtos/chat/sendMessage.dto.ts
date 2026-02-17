import { MessageType } from "../../models/message.model";

export interface SendMessageDTO {
  conversationId: string;
  senderId: string;
  text?: string;
  fileUrl?: string;
  messageType: MessageType;
}
