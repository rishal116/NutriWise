import type {
  ConversationStatus,
  ConversationVisibility,
} from "../../../models/conversation.model";

export interface NutritionistGroupListItem {
  id: string;
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: ConversationVisibility;
  status: ConversationStatus;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}
