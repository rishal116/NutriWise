import { Schema, model, Document, Types } from "mongoose";

export type MessageType = "text" | "image" | "file" | "video";

export interface IMessage extends Document {
  conversation: Types.ObjectId;     // Room reference
  sender: Types.ObjectId;           // Who sent the message

  content?: string;                 // Text message
  mediaUrl?: string;                // Image/File/Video URL
  type: MessageType;

  readBy: Types.ObjectId[];         // Users who read
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      trim: true,
    },

    mediaUrl: {
      type: String,
    },

    type: {
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

// Load latest messages faster
messageSchema.index({ conversation: 1, createdAt: -1 });

export const MessageModel = model<IMessage>("Message", messageSchema);
