import { Types } from "mongoose";
import { AuthProvider, Gender, UserRole } from "../../../enums/user.enum";
import {
  ActivityLevel,
  DietType,
  GoalType,
  TimelineType,
} from "../../health.types";

export interface IAdminUserDetailsProjection {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  gender?: Gender;
  profileImage?: string;
  authProvider: AuthProvider;
  emailVerifiedAt?: Date | null;
  roles: UserRole[];
  activeRole: UserRole;
  isBlocked: boolean;
  isProfileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  healthDetails: IAdminUserHealthDetailsProjection | null;
}

export interface IAdminUserHealthDetailsProjection {
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  dietType: DietType;
  goal: GoalType;
  targetWeightKg?: number;
  preferredTimeline?: TimelineType;
}
