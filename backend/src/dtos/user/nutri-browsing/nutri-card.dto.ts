import { CoachLevel } from "../../../constants/nutritionist/profile/coach-level.constants";
import { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";


export interface NutritionistCardDTO {
  id: string;
  username: string;
  fullName: string;
  profileImage?: string;
  specializations: Specialization[];
  coachLevel: CoachLevel;
  rating: number;
  totalReviews: number;
  totalExperienceYears: number;
}
