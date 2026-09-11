import { ApplicationStatus } from "../../../types/nutritionist.types";

export const ADMIN_NUTRITIONIST_APPLICATION_SORT_OPTIONS = [
  "newest",
  "oldest",
] as const;

export type AdminNutritionistApplicationSortBy =
  (typeof ADMIN_NUTRITIONIST_APPLICATION_SORT_OPTIONS)[number];

export interface AdminNutritionistApplicationListQueryDto {
  search?: string;

  applicationStatus?: ApplicationStatus;

  sortBy?: AdminNutritionistApplicationSortBy;

  cursor?: string;

  limit?: number;
}