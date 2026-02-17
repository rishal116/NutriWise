import { Schema, model, Document, Types } from "mongoose";

export type ChatType = "direct" | "group";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  chatType: ChatType;

  title?: string;
  groupAvatar?: string;
  adminId?: Types.ObjectId;

  directKey?: string;

  lastMessageId?: Types.ObjectId;
  lastMessageAt?: Date;

  unreadCount?: Map<string, number>;
  isDeleted?: boolean;

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

    title: String,
    groupAvatar: String,

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

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

    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

export const ConversationModel = model<IConversation>(
  "Conversation",
  conversationSchema
);
