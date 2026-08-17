import { Types } from "mongoose";
import { UserActivityTrackingStatus } from "../../../models/userActivityTracking.model";
import {
  ActivityValueType,
  ProgramActivityCategory,
} from "../../../models/userProgramDay.model";
import { UserDayTrackingStatus } from "../../../models/userDayTracking.model";

export interface IUserProgramDayListProjection {
  _id: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  totalActivities: number;
  requiredActivities: number;
  tracking: {
    status: UserDayTrackingStatus;
    completedActivities: number;
    skippedActivities: number;
    overallCompletionPercentage: number;
    adherenceScore: number;
    isLocked: boolean;
  } | null;
}

export interface IUserProgramDayActivityProjection {
  _id: Types.ObjectId;
  category: ProgramActivityCategory;
  title: string;
  description?: string;
  instructions?: string;
  valueType: ActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  scheduledTime?: string;
  isRequired: boolean;
  order: number;
  tracking: {
    status: UserActivityTrackingStatus;
    recordedValue?: number;
    actualDurationMinutes?: number;
    score?: number;
    evidence: string[];
    skippedReason?: string;
    notes?: string;
    nutritionistFeedback?: string;
    startedAt: Date | null;
    completedAt: Date | null;
  };
}

export interface IUserProgramDayDetailsProjection {
  _id: Types.ObjectId;
  dayNumber: number;
  tracking: {
    _id: Types.ObjectId;
    date: Date;
    status: UserDayTrackingStatus;
    isLocked: boolean;
    totalActivities: number;
    completedActivities: number;
    skippedActivities: number;
    overallCompletionPercentage: number;
    adherenceScore: number;
    startedAt: Date | null;
    completedAt: Date | null;
    lastActivityAt: Date | null;
    userNotes?: string;
    nutritionistNotes?: string;
  };
  activities: IUserProgramDayActivityProjection[];
}
