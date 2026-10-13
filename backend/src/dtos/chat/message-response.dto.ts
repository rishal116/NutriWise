import { MessageStatus, MessageType } from "../../models/message.model";

export interface AttachmentDTO {
  url: string;
  fileName?: string;
  size?: number;
  mimeType?: string;
  duration?: number;
}

export interface MessageResponseDTO {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  attachments?: AttachmentDTO[];
  messageType: MessageType;
  replyTo?: string;
  status: MessageStatus;
  editedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
}
