import { Schema, Types, model } from "mongoose";

export type ChatType = "direct" | "group";

export type ConversationPurpose =
  | "coaching"
  | "consultation"
  | "group_coaching";

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
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    purpose: {
      type: String,
      enum: ["coaching", "consultation", "group_coaching"],
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
    },

    groupAvatar: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
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

ConversationSchema.index({
  status: 1,
  lastActivityAt: -1,
});

ConversationSchema.index({
  purpose: 1,
  status: 1,
});

ConversationSchema.index({
  chatType: 1,
  status: 1,
});

ConversationSchema.pre("validate", function (next) {
  if (this.chatType === "direct") {
    if (!this.directKey) {
      return next(new Error("Direct conversation requires directKey"));
    }

    this.title = undefined;
    this.groupAvatar = undefined;
    this.description = undefined;

    if (this.purpose === "group_coaching") {
      return next(
        new Error("Direct conversation cannot use group_coaching purpose"),
      );
    }
  }

  if (this.chatType === "group") {
    if (!this.title) {
      return next(new Error("Group conversation requires title"));
    }

    if (this.directKey) {
      return next(new Error("Group conversation cannot have directKey"));
    }

    if (this.purpose !== "group_coaching") {
      return next(
        new Error("Group conversation must use group_coaching purpose"),
      );
    }
  }

  next();
});

export const ConversationModel = model<IConversation>(
  "Conversation",
  ConversationSchema,
);
