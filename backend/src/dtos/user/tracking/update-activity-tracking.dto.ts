import type { UserActivityTrackingStatus } from "../../../models/userActivityTracking.model";

export interface UpdateActivityTrackingDTO {
  status?: UserActivityTrackingStatus;
  recordedValue?: number;
  recordedText?: string;
  unit?: string;
  evidence?: string[];
  skippedReason?: string;
  notes?: string;
}
