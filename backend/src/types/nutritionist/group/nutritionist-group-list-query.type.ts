import type {
  ConversationStatus,
  ConversationVisibility,
} from "../../../models/conversation.model";

export type NutritionistGroupSortBy =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc";

export interface NutritionistGroupListQuery {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: ConversationStatus;
  visibility?: ConversationVisibility;
  sortBy?: NutritionistGroupSortBy;
}
