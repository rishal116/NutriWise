import {
  SessionStatus,
  SessionType,
} from "@/types/nutritionist/session/session.types";

export const NUTRI_SESSION_SORT_OPTIONS = [
  "latest",
  "oldest",
  "title_asc",
  "title_desc",
  "date_asc",
  "date_desc",
] as const;
export type NutriSessionSortOption =
  (typeof NUTRI_SESSION_SORT_OPTIONS)[number];

export interface GetNutriSessionsQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  status?: SessionStatus;
  type?: SessionType;
  sortBy?: NutriSessionSortOption;
}
