import { Schema, model, Document, Types } from "mongoose";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  VIDEO = "video",
  SYSTEM = "system",
}

interface IAttachment {
  url: string;
  fileName: string;
  size?: number;
  mimeType?: string;
}

interface IReaction {
  userId: Types.ObjectId;
  emoji: string;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;

  conversationId: Types.ObjectId;

  senderId: Types.ObjectId;

  text?: string;

  attachments?: IAttachment[];

  messageType: MessageType;

  replyTo?: Types.ObjectId;

  reactions?: IReaction[];

  isCoachMessage: boolean;

  isEdited: boolean;

  editedAt?: Date;

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

    text: {
      type: String,
      trim: true,
    },

    attachments: [
      {
        url: {
          type: String,
        },
        fileName: {
          type: String,
        },
        size: {
          type: Number,
        },
        mimeType: {
          type: String,
        },
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

    isCoachMessage: {
      type: Boolean,
      default: false,
      index: true,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index(
  { conversationId: 1, createdAt: -1 },
  { partialFilterExpression: { isDeleted: false } }
);

messageSchema.index({
  conversationId: 1,
  senderId: 1,
});



export const MessageModel = model<IMessage>("Message", messageSchema);