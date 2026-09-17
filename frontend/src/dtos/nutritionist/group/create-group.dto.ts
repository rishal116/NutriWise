import type { ConversationVisibility } from "@/types/nutritionist/group/group.types";

export interface CreateGroupDTO {
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: ConversationVisibility;
}
