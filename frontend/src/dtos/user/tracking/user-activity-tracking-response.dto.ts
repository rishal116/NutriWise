import {
  ActivityTrackingValueType,
  UserActivityTrackingStatus,
} from "@/types/user/program/user-program-day.types";

export interface UserActivityTrackingResponseDTO {
  _id: string;

  activityId: string;
  userProgramDayId: string;
  userDayTrackingId: string;

  title: string;
  category: string;

  status: UserActivityTrackingStatus;
  valueType: ActivityTrackingValueType;

  targetValue?: number;
  recordedValue?: number;
  unit?: string;

  actualDurationMinutes?: number;
  score?: number;

  evidence: string[];

  skippedReason?: string;
  notes?: string;
  nutritionistFeedback?: string;

  completedBy: string;
  lastUpdatedBy: string;

  startedAt: string | null;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}