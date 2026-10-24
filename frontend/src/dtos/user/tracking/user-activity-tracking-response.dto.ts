import type {
  UserActivityTrackingStatus,
  ActivityTrackingValueType,
} from "@/types/user/program/user-program-day.types";

export interface UserActivityTrackingResponseDTO {
  _id: string;

  activityId: string;
  userDayTrackingId: string;
  userProgramDayId: string;

  title: string;
  category: string;

  status: UserActivityTrackingStatus;
  valueType: ActivityTrackingValueType;

  recordedValue?: number;
  recordedText?: string;
  unit?: string;

  evidence: string[];

  skippedReason?: string;
  notes?: string;

  lastUpdatedBy: string;

  startedAt: string | null;
  completedAt: string | null;
}
