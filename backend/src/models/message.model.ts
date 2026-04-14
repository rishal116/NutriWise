import { Schema, model, Document, Types } from "mongoose";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  VIDEO = "video",
  SYSTEM = "system",
}

export type MessageStatus = "active" | "edited" | "deleted";

interface IAttachment {
  url: string;
  fileName?: string;
  size?: number;
  mimeType?: string;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;

  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;

  text?: string;
  attachments?: IAttachment[];

  messageType: MessageType;

  replyTo?: Types.ObjectId;

  status: MessageStatus;

  senderRole?: "user" | "nutritionist";

  editedAt?: Date;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        fileName: String,
        size: Number,
        mimeType: String,
      },
    ],

    messageType: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
      index: true,
    },

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    status: {
      type: String,
      enum: ["active", "edited", "deleted"],
      default: "active",
      index: true,
    },

    senderRole: {
      type: String,
      enum: ["user", "nutritionist"],
    },

    editedAt: {
      type: Date,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.pre("validate", function (next) {
  if (!this.text && (!this.attachments || this.attachments.length === 0)) {
    return next(new Error("Message must contain text or attachment"));
  }
  next();
});

messageSchema.index(
  { conversationId: 1, createdAt: -1 },
  {
    partialFilterExpression: { status: { $ne: "deleted" } },
  }
);

messageSchema.index({
  conversationId: 1,
  senderId: 1,
});

messageSchema.index({
  replyTo: 1,
});

export const MessageModel = model<IMessage>("Message", messageSchema);