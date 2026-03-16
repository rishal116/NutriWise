import { Schema, model, Document, Types } from "mongoose";

export type ChatType = "direct" | "group";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  chatType: ChatType;
  title?: string;
  groupAvatar?: string;
  adminId?: Types.ObjectId;
  directKey?: string;
  lastMessageId?: Types.ObjectId;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  lastMessageSenderId?:Types.ObjectId;
  participantsCount?:number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
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
    
    lastMessagePreview: {
      type: String,
      maxlength: 200
    },
    
    lastMessageSenderId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    participantsCount: {
      type: Number,
      default: 2
    },

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

conversationSchema.index({ lastMessageAt: -1 });

export const ConversationModel = model<IConversation>(
  "Conversation",
  conversationSchema
);