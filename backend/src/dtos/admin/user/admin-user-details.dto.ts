import { AuthProvider, Gender, UserRole } from "../../../enums/user.enum";
import {
  ActivityLevel,
  DietType,
  GoalType,
  TimelineType,
} from "../../../types/health.types";

export interface AdminUserHealthDetailsDto {
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  dietType: DietType;
  goal: GoalType;
  targetWeightKg?: number;
  preferredTimeline?: TimelineType;
}

export interface AdminUserDetailsDto {
  id: string;
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
  healthDetails: AdminUserHealthDetailsDto | null;
}
