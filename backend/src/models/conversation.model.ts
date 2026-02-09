import { Schema, model, Document, Types } from "mongoose";

export type ConversationType = "direct" | "group";

export interface IConversation extends Document {
  participants: Types.ObjectId[];

  type: ConversationType;       // direct or group

  name?: string;                // group name
  groupImage?: string;          // optional group image
  admin?: Types.ObjectId;       // group admin

  conversationKey?: string;     // only for direct chat

  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },

    name: {
      type: String,
    },

    groupImage: {
      type: String,
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Only required for direct chat
    conversationKey: {
      type: String,
      unique: true,
      sparse: true, // allows null for group chat
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessageAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true }
);

// Fast lookup of user's conversations
conversationSchema.index({ participants: 1 });

export const ConversationModel = model<IConversation>(
  "Conversation",
  conversationSchema
);
