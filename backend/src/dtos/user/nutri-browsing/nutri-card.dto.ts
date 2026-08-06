import { CoachLevel, Specialization } from "../../../types/nutritionist.types";

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
