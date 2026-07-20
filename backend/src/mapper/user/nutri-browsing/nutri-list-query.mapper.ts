import { ParsedQs } from "qs";

import {
  AvailabilityStatus,
  CoachLevel,
  Language,
  NutritionistSortBy,
  Specialization,
} from "../../../types/nutritionist.types";

import { NutritionistListQueryDTO } from "../../../dtos/user/nutri-browsing/nutri-list-query.dto";

const parseArray = (value: unknown): string[] | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string",
    );
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return undefined;
};

export const toNutritionistListQueryDTO = (
  query: ParsedQs,
): NutritionistListQueryDTO => ({
  search:
    typeof query.search === "string"
      ? query.search
      : undefined,

  specializations: parseArray(query.specializations) as
    | Specialization[]
    | undefined,

  languages: parseArray(query.languages) as
    | Language[]
    | undefined,

  coachLevels: parseArray(query.coachLevels) as
    | CoachLevel[]
    | undefined,

  availabilityStatuses: parseArray(
    query.availabilityStatuses,
  ) as AvailabilityStatus[] | undefined,

  minRating:
    typeof query.minRating === "string"
      ? Number(query.minRating)
      : undefined,

  sortBy:
    typeof query.sortBy === "string"
      ? (query.sortBy as NutritionistSortBy)
      : undefined,

  cursor:
    typeof query.cursor === "string"
      ? query.cursor
      : undefined,

  limit:
    typeof query.limit === "string"
      ? Number(query.limit)
      : undefined,
});