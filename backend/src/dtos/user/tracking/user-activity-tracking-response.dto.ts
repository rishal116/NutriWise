import type {
  ActivityCompletedBy,
  UserActivityTrackingStatus,
} from "../../../models/userActivityTracking.model";
import type { ProgramActivityCategory } from "../../../models/userProgramDay.model";

export interface UserActivityTrackingResponseDTO {
  _id: string;
  userDayTrackingId: string;
  activityId: string;

  title: string;
  category: ProgramActivityCategory;
  status: UserActivityTrackingStatus;
  valueType: "boolean" | "number" | "duration" | "photo" | "text";

  recordedValue?: number;
  recordedText?: string;
  unit?: string;

  evidence: string[];
  skippedReason?: string;
  notes?: string;

  lastUpdatedBy: ActivityCompletedBy;
  startedAt: Date | null;
  completedAt: Date | null;
}
