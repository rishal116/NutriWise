import { MessageType } from "../../models/message.model";

export interface AttachmentDTO {
  url: string;
  fileName: string;
}

export interface MessageResponseDTO {

  id: string;
  conversationId: string;
  senderId: string;

  content?: string;

  isEdited: boolean;

  attachments?: AttachmentDTO[];

  type: MessageType;
  editedAt?:Date;

  createdAt: Date;

}