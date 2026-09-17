import type {
  ConversationStatus,
  ConversationVisibility,
} from "@/types/nutritionist/group/group.types";

export type NutritionistGroupSortBy =
  "newest" | "oldest" | "title_asc" | "title_desc";

export interface NutritionistGroupListQueryDTO {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: ConversationStatus;
  visibility?: ConversationVisibility;
  sortBy?: NutritionistGroupSortBy;
}
