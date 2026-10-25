import type { CoachLevel } from "@/types/nutritionist.types";

export interface AdminNutritionistListItemDto {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
  coachLevel: CoachLevel;
  rating: number;
  totalReviews: number;
  isBlocked: boolean;
  createdAt: string;
}