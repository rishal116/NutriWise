import { Schema, model, Types, Document } from "mongoose";

export type MemberRole = "member" | "admin" | "owner";

export interface IConversationMember extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  userId: Types.ObjectId;

  role: MemberRole;

  lastReadAt?: Date;
  lastDeliveredAt?: Date;

  unreadCount: number;

  isMuted: boolean;
  isArchived: boolean;
  isPinned: boolean;
  isLeft: boolean;
  isBlocked:boolean;

  joinedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ConversationMemberSchema = new Schema<IConversationMember>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["member", "admin", "owner"],
      default: "member",
      index: true,
    },

    lastReadAt: Date,

    lastDeliveredAt: Date,

    unreadCount: {
      type: Number,
      default: 0,
    },

    isMuted: { type: Boolean, default: false },

    isArchived: { type: Boolean, default: false },

    isPinned: { type: Boolean, default: false },

    isLeft: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBlocked: {
      type: Boolean,
      default: false
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ConversationMemberSchema.index(
  { conversationId: 1, userId: 1 },
  { unique: true }
);

ConversationMemberSchema.index({
  userId: 1,
  isArchived: 1,
  isLeft: 1,
  updatedAt: -1,
});

export const ConversationMemberModel = model<IConversationMember>(
  "ConversationMember",
  ConversationMemberSchema
);