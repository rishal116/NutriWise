import { MessageType } from "../../models/message.model";
import { RoleContext } from "../../models/conversationMember.model";

export interface SendMessageDTO {
  conversationId: string;
  senderId: string;
  context: RoleContext;
  text?: string;

  attachments?: {
    url: string;
    fileName: string;
    size: number;
    mimeType: string;
  }[];

  messageType: MessageType;
}