import {
  Specialization,
  Language,
  CoachLevel,
  AvailabilityStatus,
  NutritionistSortBy,
} from "../../../types/nutritionist.types";

export interface NutritionistListQueryDTO {
  search?: string;
  specializations?: Specialization[];
  languages?: Language[];
  coachLevels?: CoachLevel[];
  availabilityStatuses?: AvailabilityStatus[];
  minRating?: number;
  sortBy?: NutritionistSortBy;
  cursor?: string;
  limit?: number;
}
