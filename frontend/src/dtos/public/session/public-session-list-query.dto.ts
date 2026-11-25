import {
  SessionPricingType,
  SessionType,
} from "@/constants/common/session.constants";

export const PUBLIC_SESSION_SORT_OPTIONS = [
  "all",
  "latest",
  "oldest",
  "upcoming",
  "price_low_to_high",
  "price_high_to_low",
] as const;

export type PublicSessionSortOption =
  (typeof PUBLIC_SESSION_SORT_OPTIONS)[number];

export interface GetPublicSessionsQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  type?: SessionType;
  pricingType?: SessionPricingType;
  sortBy?: PublicSessionSortOption;
}
