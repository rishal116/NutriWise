import {
  AvailabilityStatus,
  CoachLevel,
  Specialization,
} from "@/types/nutritionist.types";

export interface NutritionistCardDTO {
  username: string;
  fullName: string;
  profileImage?: string;

  specializations: Specialization[];

  coachLevel: CoachLevel;

  rating: number;
  totalReviews: number;
  totalExperienceYears: number;

  availabilityStatus: AvailabilityStatus;
}