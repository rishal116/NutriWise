import { MessageType } from "../../models/message.model";

export interface SendMessageDTO {
  conversationId: string;
  senderId: string;
  text?: string;

  attachments?: {
    url: string;
    fileName: string;
    size: number;
    mimeType: string;
  }[];

  messageType: MessageType;
}