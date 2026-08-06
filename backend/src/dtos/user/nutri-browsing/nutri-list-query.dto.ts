import {
  Specialization,
  Language,
  CoachLevel,
  NutritionistSortBy,
} from "../../../types/nutritionist.types";
import { Gender } from "../../../enums/user.enum";

export interface NutritionistListQueryDTO {
  search?: string;
  specialization?: Specialization;
  languages?: Language[];
  coachLevel?: CoachLevel;
  gender?: Gender;
  minRating?: number;
  availableOnly?: boolean;
  sortBy?: NutritionistSortBy;
  cursor?: string;
  limit?: number;
}
