import { Schema, model, Document, Types } from "mongoose";

export type ChatType = "direct" | "group";

export interface IConversation extends Document {
  _id:Schema.Types.ObjectId;
  participants: Types.ObjectId[];
  chatType: ChatType;

  // Group Only
  title?: string;
  groupAvatar?: string;
  adminId?: Types.ObjectId;

  // Direct Only
  directKey?: string;

  lastMessageId?: Types.ObjectId;
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

    chatType: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },

    // Group fields
    title: String,
    groupAvatar: String,

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Direct unique key (user1_user2 sorted)
    directKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    lastMessageId: {
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

// Index for faster user conversation lookup
conversationSchema.index({ participants: 1 });

export const ConversationModel = model<IConversation>(
  "Conversation",
  conversationSchema
);
