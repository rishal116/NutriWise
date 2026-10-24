import type {
  ActivityCompletedBy,
  UserActivityTrackingStatus,
} from "../../../models/userActivityTracking.model";
import type {
  ProgramActivityCategory,
  ActivityValueType,
} from "../../../models/userProgramDay.model";

export interface CreateUserActivityTrackingDTO {
  userId: string;
  userProgramId: string;
  userProgramDayId: string;
  userDayTrackingId: string;
  activityId: string;
  title: string;
  category: ProgramActivityCategory;
  status: UserActivityTrackingStatus;
  valueType: ActivityValueType;
  targetValue?: number;
  unit?: string;
  lastUpdatedBy: ActivityCompletedBy;
}
