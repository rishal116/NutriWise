import { AvailabilityStatus, CoachLevel } from "@/types/nutritionist.types";

export interface AdminNutritionistListItemDto {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
  coachLevel: CoachLevel;
  availabilityStatus: AvailabilityStatus;
  totalExperienceYears: number;
  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
  isBlocked: boolean;
  createdAt: Date;
}
