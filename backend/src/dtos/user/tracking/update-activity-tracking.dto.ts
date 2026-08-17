import {
  ActivityTrackingValueType,
  UserActivityTrackingStatus,
} from "../../../models/userActivityTracking.model";

export interface UpdateActivityTrackingDTO {
  status?: UserActivityTrackingStatus;
  recordedValue?: number;
  actualDurationMinutes?: number;
  evidence?: string[];
  notes?: string;
  valueType?: ActivityTrackingValueType;
}
