import {
  SessionStatus,
  SessionType,
} from "@/constants/common/session.constants";

export const NUTRI_SESSION_SORT_OPTIONS = [
  "latest",
  "oldest",
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
