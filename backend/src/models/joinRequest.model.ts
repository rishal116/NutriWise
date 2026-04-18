import { Schema, model, Document, Types } from "mongoose";

export type JoinRequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface IJoinRequest extends Document {
  _id: Types.ObjectId;

  conversationId: Types.ObjectId;
  userId: Types.ObjectId;

  status: JoinRequestStatus;

  createdAt: Date;
  updatedAt: Date;
}

const joinRequestSchema = new Schema<IJoinRequest>(
  {
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
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

joinRequestSchema.index(
  { conversationId: 1, userId: 1 },
  { unique: true },
);

joinRequestSchema.index({ conversationId: 1, status: 1 });
joinRequestSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const JoinRequestModel = model<IJoinRequest>(
  "JoinRequest",
  joinRequestSchema,
);