export const ADMIN_CHALLENGE_DAY_SORT_OPTIONS = [
  "day_asc",
  "day_desc",
] as const;

export type AdminChallengeDaySortBy =
  (typeof ADMIN_CHALLENGE_DAY_SORT_OPTIONS)[number];

export interface AdminChallengeDayListQueryDTO {
  sortBy?: AdminChallengeDaySortBy;
  cursor?: string;
  limit?: number;
}