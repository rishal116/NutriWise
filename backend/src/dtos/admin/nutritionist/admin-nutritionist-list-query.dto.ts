import {
  ApplicationStatus,
  AvailabilityStatus,
  CoachLevel,
} from "../../../types/nutritionist.types";

export const ADMIN_NUTRITIONIST_SORT_OPTIONS = ["newest", "oldest"] as const;

export type AdminNutritionistSortBy =
  (typeof ADMIN_NUTRITIONIST_SORT_OPTIONS)[number];

export interface AdminNutritionistListQueryDto {
  search?: string;

  coachLevel?: CoachLevel;

  availabilityStatus?: AvailabilityStatus;

  applicationStatus?: ApplicationStatus;

  isBlocked?: boolean;

  sortBy?: AdminNutritionistSortBy;

  cursor?: string;

  limit?: number;
}
