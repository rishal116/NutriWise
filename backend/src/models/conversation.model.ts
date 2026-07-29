import { Schema, Types, model } from "mongoose";

export type ChatType = "direct" | "group";

export type ConversationPurpose = "coaching" | "consultation" | "group";

export type ConversationStatus = "active" | "inactive" | "blocked" | "closed";

export interface IConversation {
  _id: Types.ObjectId;
  chatType: ChatType;
  directKey?: string;
  purpose: ConversationPurpose;
  status: ConversationStatus;
  title?: string;
  groupAvatar?: string;
  description?: string;
  lastMessageId?: Types.ObjectId;
  lastMessagePreview?: string;

  lastMessageSenderId?: Types.ObjectId;

  lastActivityAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    chatType: {
      type: String,
      enum: ["direct", "group"],
      required: true,
      index: true,
    },
    
    directKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    purpose: {
      type: String,
      enum: ["coaching", "consultation", "group"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "closed"],
      default: "active",
      index: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 100,
      required: function () {
        return this.chatType === "group";
      },
    },

    groupAvatar: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessagePreview: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    lastMessageSenderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    lastActivityAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Chat listing optimization
 */
ConversationSchema.index({
  status: 1,
  lastActivityAt: -1,
});

/**
 * Find conversations by purpose
 */
ConversationSchema.index({
  purpose: 1,
  status: 1,
});

/**
 * Group / direct filtering
 */
ConversationSchema.index({
  chatType: 1,
  status: 1,
});

ConversationSchema.pre("validate", function (next) {
  if (this.chatType === "direct") {
    this.title = undefined;
    this.groupAvatar = undefined;
    this.description = undefined;
  }

  if (this.chatType === "group") {
    if (!this.title) {
      return next(new Error("Group conversation requires title"));
    }
  }

  next();
});

export const ConversationModel = model<IConversation>(
  "Conversation",
  ConversationSchema,
);
