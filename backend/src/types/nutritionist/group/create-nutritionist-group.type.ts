import type { ConversationVisibility } from "../../../models/conversation.model";
export interface CreateNutritionistGroupData {
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: ConversationVisibility;
  inviteTokenEncrypted?: string;
}
