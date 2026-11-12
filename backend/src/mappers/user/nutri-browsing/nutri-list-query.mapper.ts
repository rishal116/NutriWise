import { ParsedQs } from "qs";

import { CoachLevel } from "../../../constants/nutritionist/profile/coach-level.constants";

import { Gender } from "../../../enums/user.enum";
import { NutritionistListQueryDTO } from "../../../dtos/user/nutri-browsing/nutri-list-query.dto";
import { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";
import { Language } from "../../../constants/nutritionist/profile/language.constants";
import { NutritionistSortBy } from "../../../constants/nutritionist/profile/nutritionist-sort.constants";

const parseBoolean = (value: unknown): boolean | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  return value === "true" ? true : value === "false" ? false : undefined;
};

export const toNutritionistListQueryDTO = (
  query: ParsedQs,
): NutritionistListQueryDTO => ({
  search: typeof query.search === "string" ? query.search.trim() : undefined,

  specialization:
    typeof query.specialization === "string"
      ? (query.specialization as Specialization)
      : undefined,

  languages:
    typeof query.languages === "string"
      ? (query.languages.split(",") as Language[])
      : undefined,

  coachLevel:
    typeof query.coachLevel === "string"
      ? (query.coachLevel as CoachLevel)
      : undefined,

  gender:
    typeof query.gender === "string" ? (query.gender as Gender) : undefined,

  minRating:
    typeof query.minRating === "string" ? Number(query.minRating) : undefined,

  availableOnly: parseBoolean(query.availableOnly),

  sortBy:
    typeof query.sortBy === "string"
      ? (query.sortBy as NutritionistSortBy)
      : undefined,

  cursor: typeof query.cursor === "string" ? query.cursor : undefined,

  limit: typeof query.limit === "string" ? Number(query.limit) : undefined,
});
