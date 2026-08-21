import { Schema, Types, model } from "mongoose";

export interface IMessageReaction {
  _id: Types.ObjectId;

  messageId: Types.ObjectId;
  userId: Types.ObjectId;

  emoji: string;

  createdAt: Date;
  updatedAt: Date;
}

const MessageReactionSchema = new Schema<IMessageReaction>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emoji: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  },
);

MessageReactionSchema.index(
  {
    messageId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

export const MessageReactionModel = model<IMessageReaction>(
  "MessageReaction",
  MessageReactionSchema,
);
