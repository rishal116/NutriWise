import { Schema, model, Document, Types } from "mongoose";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  VIDEO = "video",
}

export enum DeliveryStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  SEEN = "seen",
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text?: string;
  fileUrl?: string;
  messageType: MessageType;
  replyTo?: Types.ObjectId;
  isEdited: boolean;
  editedAt?: Date;
  deliveryStatus: DeliveryStatus;
  reactions?: {
    userId: Types.ObjectId;
    emoji: string;
  }[];
  mediaMeta?: {
    size?: number;
    duration?: number;
    width?: number;
    height?: number;
  };
  isCoachMessage: boolean;
  isDeleted: boolean;
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

    text: String,
    fileUrl: String,

    messageType: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
      index: true,
    },

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      index: true,
    },

    deliveryStatus: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.SENT,
      index: true,
    },

    reactions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        emoji: {
          type: String,
          required: true,
        },
      },
    ],

    mediaMeta: {
      size: Number,
      duration: Number,
      width: Number,
      height: Number,
    },

    isCoachMessage: {
      type: Boolean,
      default: false,
      index: true,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);


messageSchema.pre("validate", function (next) {
  if (this.isDeleted) return next();

  const hasText = !!this.text?.trim();
  const hasFile = !!this.fileUrl?.trim();

  if (this.messageType === MessageType.TEXT && !hasText) {
    return next(new Error("Text message must contain text"));
  }

  if (this.messageType !== MessageType.TEXT && !hasFile) {
    return next(new Error("Media message must contain fileUrl"));
  }

  next();
});

messageSchema.index(
  { conversationId: 1, createdAt: -1 },
  { partialFilterExpression: { isDeleted: false } }
);

messageSchema.index({ replyTo: 1, createdAt: 1 });

export const MessageModel = model<IMessage>("Message", messageSchema);