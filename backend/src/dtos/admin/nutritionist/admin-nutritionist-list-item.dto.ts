import { Types } from "mongoose";
import {
  AvailabilityStatus,
  CoachLevel,
} from "../../../types/nutritionist.types";

export interface AdminNutritionistListItemDto {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
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
