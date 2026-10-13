import { Schema, Types, model } from "mongoose";

export type ChatType = "direct" | "group";

export type ConversationVisibility = "public" | "private";

export type ConversationPurpose =
  | "coaching"
  | "consultation"
  | "group_coaching";

export type ConversationStatus = "active" | "inactive" | "blocked" | "closed";

export interface IConversation {
  _id: Types.ObjectId;
  chatType: ChatType;
  visibility: ConversationVisibility;
  directKey?: string;
  inviteToken?: string;
  inviteTokenHash?: string;
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

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      required: true,
      index: true,
    },

    directKey: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    inviteToken: {
      type: String,
      trim: true,
      select: false,
    },

    inviteTokenHash: {
      type: String,
      trim: true,
      select: false,
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

ConversationSchema.pre("validate", function (next) {
  if (this.chatType === "direct") {
    if (!this.directKey) {
      return next(new Error("Direct conversation requires directKey"));
    }

    if (this.visibility !== "private") {
      return next(new Error("Direct conversation must be private"));
    }

    if (this.inviteToken || this.inviteTokenHash) {
      return next(
        new Error("Direct conversation cannot have invitation tokens"),
      );
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

    if (
      this.visibility === "public" &&
      (this.inviteToken || this.inviteTokenHash)
    ) {
      return next(
        new Error("Public group conversation cannot have invitation tokens"),
      );
    }

    if (
      this.visibility === "private" &&
      (!this.inviteToken || !this.inviteTokenHash)
    ) {
      return next(
        new Error("Private group conversation requires both invitation tokens"),
      );
    }
  }

  next();
});

ConversationSchema.index(
  { inviteTokenHash: 1 },
  {
    unique: true,
    partialFilterExpression: {
      inviteTokenHash: { $type: "string" },
    },
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

ConversationSchema.index({
  chatType: 1,
  visibility: 1,
  status: 1,
});

export const ConversationModel = model<IConversation>(
  "Conversation",
  ConversationSchema,
);
