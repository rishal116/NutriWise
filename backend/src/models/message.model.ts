import { Schema, Types, model } from "mongoose";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  VIDEO = "video",
  SYSTEM = "system",
}

export type MessageStatus = "active" | "edited" | "deleted";

interface IMessageAttachment {
  url: string;
  fileName?: string;
  size?: number;
  mimeType?: string;
}

export interface IMessage {
  _id: Types.ObjectId;

  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;

  text?: string;
  attachments?: IMessageAttachment[];

  messageType: MessageType;

  replyTo?: Types.ObjectId;

  status: MessageStatus;

  editedAt?: Date;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
          trim: true,
        },

        fileName: {
          type: String,
          trim: true,
        },

        size: {
          type: Number,
          min: 0,
        },

        mimeType: {
          type: String,
          trim: true,
        },
      },
    ],

    messageType: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
      required: true,
    },

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    status: {
      type: String,
      enum: ["active", "edited", "deleted"],
      default: "active",
      required: true,
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
  },
);

MessageSchema.pre("validate", function (next) {
  const hasText = Boolean(this.text?.trim());
  const hasAttachments = Boolean(
    this.attachments && this.attachments.length > 0,
  );

  if (!hasText && !hasAttachments) {
    return next(new Error("Message must contain text or attachment"));
  }

  if (this.messageType === MessageType.TEXT && !hasText) {
    return next(new Error("Text message requires text"));
  }

  if (
    [MessageType.IMAGE, MessageType.FILE, MessageType.VIDEO].includes(
      this.messageType,
    ) &&
    !hasAttachments
  ) {
    return next(new Error("Media message requires attachment"));
  }

  if (this.messageType === MessageType.SYSTEM && !hasText) {
    return next(new Error("System message requires text"));
  }

  next();
});

MessageSchema.index(
  {
    conversationId: 1,
    createdAt: -1,
  },
  {
    partialFilterExpression: {
      status: {
        $ne: "deleted",
      },
    },
  },
);

export const MessageModel = model<IMessage>("Message", MessageSchema);
