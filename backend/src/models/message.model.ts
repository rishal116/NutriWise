import { Schema, model, Document, Types } from "mongoose";
export type MessageType = "text" | "image" | "file" | "video";

export interface IMessage extends Document {
  _id:Types.ObjectId
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text?: string;
  fileUrl?: string;
  messageType: MessageType;
  readBy: Types.ObjectId[];
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

    fileUrl: String,

    messageType: {
      type: String,
      enum: ["text", "image", "file", "video"],
      default: "text",
    },

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// For loading latest messages quickly
messageSchema.index({ conversationId: 1, createdAt: -1 });

export const MessageModel = model<IMessage>("Message", messageSchema);
