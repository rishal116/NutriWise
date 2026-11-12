import { ActivityTrackingStatus } from "../../../constants/user/program/activity-tracking-status.constants";
import { ActivityValueType } from "../../../constants/user/program/activity-value-type.constants";
import { DayTrackingStatus } from "../../../constants/user/program/day-tracking-status.constants";
import { ProgramActivityCategory } from "../../../constants/user/program/program-activity-category.constants";


export interface UserProgramDayActivityResponseDTO {
  _id: string;
  category: ProgramActivityCategory;
  title: string;
  description?: string;
  instructions?: string;
  valueType: ActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  scheduledTime?: string;
  isRequired: boolean;
  order: number;
  tracking: {
    status: ActivityTrackingStatus;
    recordedValue?: number;
    evidence: string[];
    skippedReason?: string;
    notes?: string;
    nutritionistFeedback?: string;
    startedAt: Date | null;
    completedAt: Date | null;
  };
}

export interface UserProgramDayDetailsResponseDTO {
  _id: string;
  dayNumber: number;
  tracking: {
    _id: string;
    date: Date;
    status: DayTrackingStatus;
    isLocked: boolean;
    totalActivities: number;
    completedActivities: number;
    skippedActivities: number;
    overallCompletionPercentage: number;
    startedAt: Date | null;
    completedAt: Date | null;
    lastActivityAt: Date | null;
    userNotes?: string;
    nutritionistNotes?: string;
  } | null;
  activities: UserProgramDayActivityResponseDTO[];
}
