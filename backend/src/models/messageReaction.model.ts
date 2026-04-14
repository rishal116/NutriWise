import { Schema, model, Document, Types } from "mongoose";

export interface IMessageReaction extends Document {
  _id: Types.ObjectId;

  messageId: Types.ObjectId;
  conversationId: Types.ObjectId;
  userId: Types.ObjectId;

  emoji: string;

  createdAt: Date;
  updatedAt: Date;
}

const messageReactionSchema = new Schema<IMessageReaction>(
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

    emoji: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

messageReactionSchema.index({ messageId: 1, userId: 1 }, { unique: true });

messageReactionSchema.index({
  messageId: 1,
});

messageReactionSchema.index({
  conversationId: 1,
});

export const MessageReactionModel = model<IMessageReaction>(
  "MessageReaction",
  messageReactionSchema,
);
