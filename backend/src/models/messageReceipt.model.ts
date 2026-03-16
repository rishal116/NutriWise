import { Schema, model, Document, Types } from "mongoose";

export enum ReceiptStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  SEEN = "seen",
}

export interface IMessageReceipt extends Document {
  _id: Types.ObjectId;

  messageId: Types.ObjectId;

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
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ReceiptStatus),
      default: ReceiptStatus.SENT,
      index: true,
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

messageReceiptSchema.index(
  { messageId: 1, userId: 1 },
  { unique: true }
);

messageReceiptSchema.index({
  userId: 1,
  status: 1,
});

messageReceiptSchema.index({
  messageId: 1,
  status: 1,
});

export const MessageReceiptModel = model<IMessageReceipt>(
  "MessageReceipt",
  messageReceiptSchema
);