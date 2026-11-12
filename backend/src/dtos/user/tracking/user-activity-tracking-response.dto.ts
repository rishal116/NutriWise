import type { ActivityCompletedBy } from "../../../constants/user/program/activity-completed-by.constants";
import type { ActivityTrackingStatus } from "../../../constants/user/program/activity-tracking-status.constants";
import type { ProgramActivityCategory } from "../../../constants/user/program/program-activity-category.constants";
import type { ActivityValueType } from "../../../constants/user/program/activity-value-type.constants";

export interface UserActivityTrackingResponseDTO {
  _id: string;
  userDayTrackingId: string | null;
  activityId: string;

  title: string;
  category: ProgramActivityCategory;
  status: ActivityTrackingStatus;
  valueType: ActivityValueType;

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