import {
  ActivityValueType,
  ProgramActivityCategory,
} from "../../../models/userProgramDay.model";
import { UserActivityTrackingStatus } from "../../../models/userActivityTracking.model";
import { UserDayTrackingStatus } from "../../../models/userDayTracking.model";

export interface UserProgramDayActivityResponseDTO {
  _id: string;
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

export interface UserProgramDayDetailsResponseDTO {
  _id: string;
  dayNumber: number;
  tracking: {
    _id: string;
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
  activities: UserProgramDayActivityResponseDTO[];
}
