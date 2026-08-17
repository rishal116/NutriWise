import {
  ActivityCompletedBy,
  ActivityTrackingValueType,
  UserActivityTrackingStatus,
} from "../../../models/userActivityTracking.model";
import { ProgramActivityCategory } from "../../../models/userProgramDay.model";

export interface CreateUserActivityTrackingDTO {
  userId: string;
  userProgramId: string;
  userProgramDayId: string;
  userDayTrackingId: string;
  activityId: string;
  title: string;
  category: ProgramActivityCategory;
  status: UserActivityTrackingStatus;
  valueType: ActivityTrackingValueType;
  targetValue?: number;
  unit?: string;
  completedBy: ActivityCompletedBy;
  lastUpdatedBy: ActivityCompletedBy;
}
