import {
  ApplicationStatus,
  AvailabilityStatus,
  CoachLevel,
} from "../../../types/nutritionist.types";

export interface AdminNutritionistListQueryDto {
  skip: number;
  limit: number;
  search?: string;
  coachLevel?: CoachLevel;
  availabilityStatus?: AvailabilityStatus;
  applicationStatus?: ApplicationStatus;
  isBlocked?: boolean;
  sortBy?:
    | "createdAt"
    | "fullName"
    | "rating"
    | "coachLevel"
    | "totalExperienceYears";
  sortOrder?: "asc" | "desc";
}
