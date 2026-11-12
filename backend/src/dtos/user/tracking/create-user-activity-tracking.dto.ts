import { ActivityCompletedBy } from "../../../constants/user/program/activity-completed-by.constants";
import { ActivityTrackingStatus } from "../../../constants/user/program/activity-tracking-status.constants";
import { ActivityValueType } from "../../../constants/user/program/activity-value-type.constants";
import { ProgramActivityCategory } from "../../../constants/user/program/program-activity-category.constants";


export interface CreateUserActivityTrackingDTO {
  userId: string;
  userProgramId: string;
  userProgramDayId: string;
  userDayTrackingId: string;
  activityId: string;
  title: string;
  category: ProgramActivityCategory;
  status: ActivityTrackingStatus;
  valueType: ActivityValueType;
  targetValue?: number;
  unit?: string;
  lastUpdatedBy: ActivityCompletedBy;
}
