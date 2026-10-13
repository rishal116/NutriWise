import { Types } from "mongoose";
import { MessageStatus, MessageType } from "../../models/message.model";

export interface IMessageListItem {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text?: string;
  attachments?: {
    url: string;
    fileName?: string;
    size?: number;
    mimeType?: string;
    duration?: number;
  }[];
  messageType: MessageType;
  replyTo?: Types.ObjectId;
  status: MessageStatus;
  editedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
}
