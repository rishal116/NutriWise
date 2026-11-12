import { CoachLevel } from "../../../constants/nutritionist/profile/coach-level.constants";
import { Language } from "../../../constants/nutritionist/profile/language.constants";
import { NutritionistSortBy } from "../../../constants/nutritionist/profile/nutritionist-sort.constants";
import { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";
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
