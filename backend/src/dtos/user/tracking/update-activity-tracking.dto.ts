import { ActivityTrackingStatus } from "../../../constants/user/program/activity-tracking-status.constants";


export interface UpdateActivityTrackingDTO {
  status?: ActivityTrackingStatus;
  recordedValue?: number;
  recordedText?: string;
  unit?: string;
  evidence?: string[];
  skippedReason?: string;
  notes?: string;
}
