import { Types } from "mongoose";

import type { CoachLevel } from "../../nutritionist.types";

export interface IAdminNutritionistListProjection {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
  coachLevel: CoachLevel;
  rating: number;
  totalReviews: number;
  isBlocked: boolean;
  createdAt: Date;
}
