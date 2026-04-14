import { Schema, model, Document, Types } from "mongoose";

export enum ReceiptStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  SEEN = "seen",
}

export interface IMessageReceipt extends Document {
  _id: Types.ObjectId;

  messageId: Types.ObjectId;
  conversationId: Types.ObjectId;
  userId: Types.ObjectId;

  status: ReceiptStatus;

  deliveredAt?: Date;
  seenAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const messageReceiptSchema = new Schema<IMessageReceipt>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },

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
    },

    status: {
      type: String,
      enum: Object.values(ReceiptStatus),
      default: ReceiptStatus.SENT,
    },

    deliveredAt: {
      type: Date,
    },

    seenAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

messageReceiptSchema.pre("validate", function (next) {
  if (this.status === "delivered" && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }

  if (this.status === "seen" && !this.seenAt) {
    this.seenAt = new Date();
  }

  next();
});

messageReceiptSchema.index(
  { messageId: 1, userId: 1 },
  { unique: true }
);

messageReceiptSchema.index({
  conversationId: 1,
  userId: 1,
  status: 1,
});

messageReceiptSchema.index({
  messageId: 1,
  status: 1,
});

messageReceiptSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

export const MessageReceiptModel = model<IMessageReceipt>(
  "MessageReceipt",
  messageReceiptSchema
);