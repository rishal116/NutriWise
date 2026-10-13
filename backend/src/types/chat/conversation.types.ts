import { Types } from "mongoose";

import {
  ChatType,
  ConversationPurpose,
  ConversationStatus,
} from "../../models/conversation.model";

export interface IConversationListItem {
  conversationId: Types.ObjectId;
  chatType: ChatType;
  title?: string;
  groupAvatar?: string;
  otherUserId?: Types.ObjectId;
  otherUsername?: string;
  otherProfileImage?: string;
  lastMessagePreview?: string;
  lastMessageSenderId?: Types.ObjectId;
  lastActivityAt?: Date;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
}

export interface IConversationDetails {
  conversationId: Types.ObjectId;
  chatType: ChatType;
  purpose: ConversationPurpose;
  status: ConversationStatus;
  title?: string;
  groupAvatar?: string;
  description?: string;
  participant?: {
    userId: Types.ObjectId;
    fullName: string;
    profileImage?: string;
  };
  lastMessagePreview?: string;
  lastActivityAt?: Date;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
