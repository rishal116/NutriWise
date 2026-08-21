import { Schema, Types, model } from "mongoose";

export type ConversationMemberRole = "member" | "admin" | "owner";

export type ConversationMemberStatus =
  | "active"
  | "left"
  | "removed"
  | "blocked";

export interface IConversationMember {
  _id: Types.ObjectId;

  conversationId: Types.ObjectId;
  userId: Types.ObjectId;

  role: ConversationMemberRole;
  status: ConversationMemberStatus;

  lastReadAt?: Date;
  lastReadMessageId?: Types.ObjectId;

  unreadCount: number;

  isMuted: boolean;
  isArchived: boolean;

  joinedAt: Date;
  leftAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ConversationMemberSchema = new Schema<IConversationMember>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["member", "admin", "owner"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["active", "left", "removed", "blocked"],
      default: "active",
    },

    lastReadAt: {
      type: Date,
    },

    lastReadMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isMuted: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    leftAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

ConversationMemberSchema.index(
  {
    conversationId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

ConversationMemberSchema.index({
  conversationId: 1,
  status: 1,
});

ConversationMemberSchema.index({
  userId: 1,
  status: 1,
  updatedAt: -1,
});

export const ConversationMemberModel = model<IConversationMember>(
  "ConversationMember",
  ConversationMemberSchema,
);
