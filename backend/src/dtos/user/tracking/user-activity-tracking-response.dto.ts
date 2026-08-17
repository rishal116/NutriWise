import {
  ActivityCompletedBy,
  ActivityTrackingValueType,
  UserActivityTrackingStatus,
} from "../../../models/userActivityTracking.model";
import { ProgramActivityCategory } from "../../../models/userProgramDay.model";

export interface UserActivityTrackingResponseDTO {
  _id: string;
  userProgramDayId: string;
  userDayTrackingId: string;
  activityId: string;
  title: string;
  category: ProgramActivityCategory;
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
  completedBy: ActivityCompletedBy;
  lastUpdatedBy: ActivityCompletedBy;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
