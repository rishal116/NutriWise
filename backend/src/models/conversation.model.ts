import { Schema, model, Document, Types } from "mongoose";

export type ChatType = "direct" | "group";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  participantCount: number;
  chatType: ChatType;
  title?: string;
  groupAvatar?: string;
  adminId?: Types.ObjectId;
  directKey?: string;
  lastMessageId?: Types.ObjectId;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: function (val: Types.ObjectId[]) {
          return val.length >= 2;
        },
        message: "Conversation must have at least 2 participants",
      },
      index: true,
    },

    participantCount: {
      type: Number,
      required: true,
    },

    chatType: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
      index: true,
    },

    title: String,
    groupAvatar: String,

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    
    directKey: {
      type: String,
      trim: true,
    },

    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessageAt: {
      type: Date,
      index: true,
    },

    lastMessagePreview: String,

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

conversationSchema.index(
  { directKey: 1 },
  {
    unique: true,
    partialFilterExpression: { chatType: "direct" },
  }
);

conversationSchema.index({ participants: 1, lastMessageAt: -1 });

export const ConversationModel = model<IConversation>(
  "Conversation",
  conversationSchema
);