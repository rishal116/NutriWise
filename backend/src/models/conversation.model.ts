import { Schema, model, Document, Types } from "mongoose";

export type ChatType = "direct" | "group";

export interface IConversation extends Document {
  _id: Types.ObjectId;

  chatType: ChatType;

  directKey?: string;

  title?: string;
  groupAvatar?: string;
  admins?: Types.ObjectId[];
  description?: string;
  visibility?: "public" | "private";
  joinRequests: {
    userId: Types.ObjectId;
    requestedAt: Date;
  }[];

  lastMessageId?: Types.ObjectId;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  lastMessageSenderId?: Types.ObjectId;

  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    chatType: {
      type: String,
      enum: ["direct", "group"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: function () {
        return this.chatType === "group";
      },
      trim: true,
    },

    groupAvatar: {
      type: String,
      default: null,
    },

    admins: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: function () {
        return this.chatType === "group";
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },

    directKey: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 100,
      required: function () {
        return this.chatType === "direct";
      },
    },

    joinRequests: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessageAt: {
      type: Date,
      index: true,
    },

    lastMessagePreview: {
      type: String,
      maxlength: 200,
      trim: true,
    },

    lastMessageSenderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

conversationSchema.index(
  { directKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      chatType: "direct",
      isDeleted: false,
    },
  },
);

conversationSchema.index(
  { _id: 1, "joinRequests.userId": 1 },
  { unique: true, sparse: true },
);

conversationSchema.index({ visibility: 1, chatType: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ isDeleted: 1, lastMessageAt: -1 });

conversationSchema.pre("validate", function (next) {
  if (this.chatType === "direct") {
    this.title = undefined;
    this.description = undefined;
    this.visibility = undefined;
    this.joinRequests = [];
  }

  if (this.chatType === "group") {
    if (!this.admins || this.admins.length === 0) {
      return next(new Error("Group must have at least one admin"));
    }
  }

  next();
});

export const ConversationModel = model<IConversation>(
  "Conversation",
  conversationSchema,
);
