import { Schema, model, Document, Types } from "mongoose";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  VIDEO = "video",
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text?: string;
  fileUrl?: string;
  messageType: MessageType;
  replyTo?: Types.ObjectId;
  readBy: Map<string, Date>;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      trim: true,
    },

    fileUrl: {
      type: String,
      trim: true,
    },

    messageType: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
    },

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    readBy: {
      type: Map,
      of: Date,
      default: {},
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessage>("Message", messageSchema);
